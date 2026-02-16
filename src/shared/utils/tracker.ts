import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { saveTrackerEvents, TrackingEvent } from "@/shared/api/tracker";

function simpleId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

class Tracker {
    private static instance: Tracker;
    private sessionId: string;
    private clientId: string = "";
    private packageName: string = "";
    private appVersion: string = "";
    private queue: TrackingEvent[] = [];
    private sending: boolean = false;
    private flushTimer: any = null;
    private initialized: boolean = false;
    private started: boolean = false;

    private constructor() {
        this.sessionId = simpleId();
    }

    public static getInstance(): Tracker {
        if (!Tracker.instance) {
            Tracker.instance = new Tracker();
        }
        return Tracker.instance;
    }

    /**
     * Call this when the app is ready and idle to start flushing events.
     */
    public start() {
        if (this.started) return;
        this.started = true;
        console.log("[Tracker] Starting background flushing...");
        this.scheduleFlush(10000); // Wait another 10s after start to be safe
    }

    private async ensureInitialized() {
        if (this.initialized) return;
        try {
            this.clientId = await DeviceInfo.getUniqueId();
            this.packageName = DeviceInfo.getBundleId();
            this.appVersion = DeviceInfo.getVersion();
            this.initialized = true;
        } catch (e) {
            console.warn("[Tracker] Metadata collection failed:", e);
        }
    }

    /**
     * Track an event. Pure memory operation, zero blocking.
     */
    public track(eventName: string, payload: any = {}) {
        const deviceTs = Date.now();
        
        const partialEvent: any = {
            deviceTs,
            eventId: simpleId(),
            payload: {
                event: eventName,
                ...Object.keys(payload).reduce((acc, key) => {
                    acc[key] = String(payload[key]);
                    return acc;
                }, {} as any),
            },
            sendAt: deviceTs,
        };

        this.queue.push(partialEvent);
    }

    public trackPageView(pageName: string) {
        this.track("page_view", { page: pageName });
    }

    private scheduleFlush(delay: number) {
        if (this.flushTimer || this.sending) return;
        this.flushTimer = setTimeout(() => {
            this.flushTimer = null;
            void this.flush();
        }, delay);
    }

    private async flush() {
        if (!this.started || this.sending || this.queue.length === 0) return;

        this.sending = true;

        try {
            await this.ensureInitialized();

            const eventsToSend: TrackingEvent[] = this.queue.map(e => ({
                appId: "voiceagent-rn",
                build: {
                    packageName: this.packageName,
                    version: this.appVersion,
                },
                clientId: this.clientId,
                deviceTs: e.deviceTs,
                eventId: e.eventId,
                payload: e.payload,
                platform: Platform.OS,
                sendAt: Date.now(),
                sessionId: this.sessionId,
                version: "1.0.0",
            }));

            this.queue = [];
            await saveTrackerEvents(eventsToSend);
        } catch (error) {
            // Silently fail, we'll try later or drop
        } finally {
            this.sending = false;
            if (this.queue.length > 0) {
                this.scheduleFlush(20000); // 20s interval for background activity
            }
        }
    }
}

export default Tracker.getInstance();

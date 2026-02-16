import instance from "@/shared/providers/api";

export interface TrackingEvent {
    appId: string;
    build: {
        packageName: string;
        version: string;
    };
    clientId: string;
    deviceTs: number;
    eventId: string;
    payload: {
        event: string;
        [key: string]: string;
    };
    platform: string;
    sendAt: number;
    sessionId: string;
    version: string;
}

export const saveTrackerEvents = async (events: TrackingEvent[]) => {
    return instance.request({
        url: `/api/tracking/events`,
        method: "POST",
        data: {
            data: events
        },
    });
};

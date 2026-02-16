import tracker from "@/shared/utils/tracker";
import { useCallback } from "react";

export const useTracker = () => {
    const track = useCallback((eventName: string, payload: any = {}) => {
        void tracker.track(eventName, payload);
    }, []);

    const trackPageView = useCallback((pageName: string) => {
        void tracker.trackPageView(pageName);
    }, []);

    return {
        track,
        trackPageView,
    };
};

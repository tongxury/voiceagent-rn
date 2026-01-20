// hooks/useProgressTimer.ts
import {useEffect, useRef} from 'react';

export const useTimer = (isActive: boolean, f: () => void) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive) {
            // @ts-ignore
            intervalRef.current = setInterval(() => {
                f()
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, f]);

    return intervalRef.current;
};

import {useEffect, useRef} from 'react';

interface UseIntervalOptions {
    immediate?: boolean; // 是否立即执行
    enabled?: boolean;   // 是否启用定时器
}

/**
 * 自定义 hook 用于管理 setInterval
 * @param callback 要执行的函数
 * @param delay 延迟时间（毫秒），null 或 0 表示停止定时器
 * @param options 配置选项
 */
function useInterval(
    callback: () => void,
    delay: number | null,
    options: UseIntervalOptions = {}
) {
    const {immediate = false, enabled = true} = options;
    const savedCallback = useRef<() => void>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 保存最新的 callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // 清理定时器的函数
    const clearInterval = () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // 启动定时器的函数
    const startInterval = () => {
        if (!enabled || delay === null || delay <= 0) {
            return;
        }

        clearInterval(); // 先清理之前的定时器

        // @ts-ignore
        intervalRef.current = window.setInterval(() => {
            savedCallback.current?.();
        }, delay);

        // 如果需要立即执行
        if (immediate) {
            savedCallback.current?.();
        }
    };

    // 管理定时器生命周期
    useEffect(() => {
        if (enabled && delay !== null && delay > 0) {
            startInterval();
        } else {
            clearInterval();
        }

        // 清理函数
        return () => {
            clearInterval();
        };
    }, [delay, enabled, immediate]);

    // 返回控制函数
    return {
        clear: clearInterval,
        start: startInterval,
        isRunning: intervalRef.current !== null,
    };
}

export default useInterval;

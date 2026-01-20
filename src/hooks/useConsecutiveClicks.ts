import {useRef, useCallback} from 'react';


export const useConsecutiveClicks = (numberOfClicks: number, callback: () => void, delay = 300) => {
    // 使用 useRef 来存储点击次数和上一次点击的时间戳，
    // 这样它们在组件的重新渲染之间会保持不变。
    const clickCount = useRef(0);
    const lastClickTime = useRef(0);

    // 使用 useCallback 来确保返回的函数引用是稳定的，
    // 避免不必要的子组件重新渲染。
    return useCallback(() => {
        const now = Date.now();

        // 检查当前点击与上一次点击的时间间隔
        if (now - lastClickTime.current < delay) {
            // 如果间隔在允许的范围内，增加点击计数
            clickCount.current += 1;
        } else {
            // 如果间隔太长，重置计数器为 1
            clickCount.current = 1;
        }

        // 更新最后一次点击的时间
        lastClickTime.current = now;

        // 检查是否达到了目标的点击次数
        if (clickCount.current === numberOfClicks) {
            // 如果达到了，执行回调函数
            callback();
            // 并重置计数器，以防万一
            clickCount.current = 0;
        }
    }, [numberOfClicks, callback, delay]);
};

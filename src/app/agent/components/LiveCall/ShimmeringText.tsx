import React, { useEffect } from "react";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";

export const ShimmeringText = ({ text, active }: { text: string, active: boolean }) => {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        if (active) {
            shimmer.value = withRepeat(
                withTiming(1, { duration: 1500 }),
                -1,
                false
            );
        }
    }, [active]);

    const textStyle = useAnimatedStyle(() => ({
        opacity: active ? interpolate(shimmer.value, [0, 0.5, 1], [0.4, 1, 0.4]) : 0.4,
    }));

    return (
        <Animated.Text style={textStyle} className="text-foreground text-[10px] font-black uppercase tracking-[4px]">
            {text}
        </Animated.Text>
    );
};

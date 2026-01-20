import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from "react-native-reanimated";

const Bar = ({ index, isActive }: { index: number, isActive: boolean }) => {
    const height = useSharedValue(4);

    useEffect(() => {
        if (isActive) {
            height.value = withRepeat(
                withTiming(Math.random() * 30 + 10, { duration: Math.random() * 400 + 300 }),
                -1,
                true
            );
        } else {
            height.value = withTiming(4);
        }
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: interpolate(height.value, [4, 30], [8, 60]),
        backgroundColor: index % 3 === 0 ? '#06b6d4' : (index % 3 === 1 ? '#8b5cf6' : '#ec4899'),
        opacity: interpolate(height.value, [4, 30], [0.4, 1])
    }));

    return (
        <Animated.View
            style={animatedStyle}
            className="w-1.5 rounded-full"
        />
    );
};

export const BarVisualizer = ({ isActive }: { isActive: boolean }) => {
    return (
        <View className="flex-row items-center justify-center h-12 space-x-1.5">
            {[...Array(15)].map((_, i) => (
                <Bar key={i} index={i} isActive={isActive} />
            ))}
        </View>
    );
};

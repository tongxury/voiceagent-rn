import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { useTailwindVars } from "@/hooks/useTailwindVars";

export const Orb = ({ isActive, isSpeaking }: { isActive: boolean, isSpeaking: boolean }) => {
    const { colors } = useTailwindVars();
    const pulse = useSharedValue(0);
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (isActive) {
            pulse.value = withRepeat(
                withTiming(1, { duration: isSpeaking ? 1200 : 3000 }),
                -1,
                true
            );
            rotation.value = withRepeat(
                withTiming(1, { duration: 10000 }),
                -1,
                false
            );
        } else {
            pulse.value = 0;
            rotation.value = 0;
        }
    }, [isActive, isSpeaking]);

    const layer1Style = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotation.value * 360}deg` },
            { scale: interpolate(pulse.value, [0, 1], [1, 1.2]) }
        ],
        opacity: interpolate(pulse.value, [0, 1], [0.6, 0.8]),
    }));

    const layer2Style = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${-rotation.value * 360}deg` },
            { scale: interpolate(pulse.value, [0, 1], [0.8, 1.4]) }
        ],
        opacity: interpolate(pulse.value, [0, 1], [0.4, 0.6]),
    }));

    const glowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 2]) }],
        opacity: interpolate(pulse.value, [0, 1], [0.2, 0.4]),
    }));

    return (
        <View className="items-center justify-center">
            {/* Massive Ambient Glow - Dynamic Swelling */}
            <Animated.View
                style={glowStyle}
                className="absolute h-96 w-96 rounded-full bg-[#06b6d4]/10 blur-[80px]"
            />
            <Animated.View
                style={glowStyle}
                className="absolute h-[500px] w-[500px] rounded-full bg-[#8b5cf6]/05 blur-[120px]"
            />

            {/* Main Fluid Core Components */}
            <View className="h-80 w-80 items-center justify-center">
                {/* Background Mist Layer */}
                <Animated.View
                    style={[layer2Style, { position: 'absolute' }]}
                    className="h-64 w-64 rounded-full blur-2xl opacity-40"
                >
                    <LinearGradient
                        colors={['#06b6d4', '#8b5cf6']}
                        style={{ flex: 1, borderRadius: 128 }}
                    />
                </Animated.View>

                {/* Pulsing Fluid Core 1 */}
                <Animated.View
                    style={layer1Style}
                    className="absolute h-56 w-56 rounded-full overflow-hidden"
                >
                    <LinearGradient
                        colors={['#06b6d4', '#8b5cf6', '#ec4899']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ flex: 1, opacity: 0.8 }}
                    />
                </Animated.View>

                {/* Pulsing Fluid Core 2 - Opposite Rotation */}
                <Animated.View
                    style={layer2Style}
                    className="absolute h-60 w-60 rounded-full overflow-hidden"
                >
                    <LinearGradient
                        colors={['#ec4899', '#06b6d4', '#8b5cf6']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ flex: 1, opacity: 0.5, transform: [{ scale: 1.3 }] }}
                    />
                </Animated.View>

                {/* Highlight/Glint Layer */}
                <Animated.View
                    style={[layer1Style, { position: 'absolute', transform: [{ scale: 0.8 }] }]}
                    className="h-40 w-40 rounded-full"
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.3)', 'transparent']}
                        start={{ x: 0.3, y: 0.3 }}
                        end={{ x: 0.7, y: 0.7 }}
                        style={{ flex: 1, borderRadius: 80 }}
                    />
                </Animated.View>
            </View>
        </View>
    );
};

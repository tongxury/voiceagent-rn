import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { useTailwindVars } from "@/hooks/useTailwindVars";

export const Orb = ({ isActive, isSpeaking }: { isActive: boolean, isSpeaking: boolean }) => {
    const pulse = useSharedValue(0);
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (isActive) {
            // "Breathing" cycle: Talking is more active bloom, Listening is slow expansion
            const duration = isSpeaking ? 2500 : 5000;
            pulse.value = withRepeat(
                withTiming(1, { duration }),
                -1,
                true
            );
            // Eternal slow swirl
            rotation.value = withRepeat(
                withTiming(1, { duration: 15000 }),
                -1,
                false
            );
        } else {
            pulse.value = withTiming(0, { duration: 1000 });
        }
    }, [isActive, isSpeaking]);

    const layer1Style = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotation.value * 360}deg` },
            { scale: interpolate(pulse.value, [0, 1], [1, isSpeaking ? 1.3 : 1.15]) }
        ],
        opacity: interpolate(pulse.value, [0, 1], [0.4, isSpeaking ? 0.7 : 0.5]),
    }));

    const layer2Style = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${-rotation.value * 360 + 45}deg` },
            { scale: interpolate(pulse.value, [0, 1], [0.9, isSpeaking ? 1.5 : 1.25]) }
        ],
        opacity: interpolate(pulse.value, [0, 1], [0.2, isSpeaking ? 0.5 : 0.3]),
    }));

    const glowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pulse.value, [0, 1], [1, isSpeaking ? 2.5 : 1.8]) }],
        opacity: interpolate(pulse.value, [0, 1], [0.1, isSpeaking ? 0.3 : 0.15]),
    }));

    return (
        <View className="items-center justify-center">
            {/* Deep Atmospheric Halo */}
            <Animated.View
                style={glowStyle}
                className="absolute h-96 w-96 rounded-full bg-[#06b6d4]/20 blur-[100px]"
            />
            <Animated.View
                style={glowStyle}
                className="absolute h-[500px] w-[500px] rounded-full bg-[#8b5cf6]/10 blur-[150px]"
            />

            {/* Breathing Soul Core */}
            <View className="h-80 w-80 items-center justify-center">
                {/* Mist Layer - Outer Bloom */}
                <Animated.View
                    style={[layer2Style, { position: 'absolute' }]}
                    className="h-72 w-72 rounded-full blur-3xl opacity-20"
                >
                    <LinearGradient
                        colors={['#06b6d4', '#8b5cf6']}
                        style={{ flex: 1, borderRadius: 144 }}
                    />
                </Animated.View>

                {/* Main Therapeutic Core (Muted Colors) */}
                <Animated.View
                    style={layer1Style}
                    className="absolute h-64 w-64 rounded-full overflow-hidden"
                >
                    <LinearGradient
                        colors={['#083344', '#1e1b4b', '#2e1065']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ flex: 1 }}
                    />
                    {/* Inner Ethereal Glow */}
                    <View style={StyleSheet.absoluteFill} className="items-center justify-center">
                        <View className="h-48 w-48 rounded-full bg-[#06b6d4]/10 blur-xl" />
                    </View>
                </Animated.View>

                {/* Subtle Fluidity Layers */}
                <Animated.View
                    style={layer2Style}
                    className="absolute h-60 w-60 rounded-full border border-white/5"
                />

                {/* Top Soft Glint */}
                <Animated.View
                    style={[layer1Style, { position: 'absolute', transform: [{ scale: 0.7 }] }]}
                    className="h-48 w-48 rounded-full"
                >
                    <LinearGradient
                        colors={['rgba(255,255,255,0.1)', 'transparent']}
                        start={{ x: 0.2, y: 0.2 }}
                        end={{ x: 0.8, y: 0.8 }}
                        style={{ flex: 1, borderRadius: 96 }}
                    />
                </Animated.View>
            </View>
        </View>
    );
};

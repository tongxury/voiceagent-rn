import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, ViewStyle } from 'react-native';

interface WaveformVisualizerProps {
    isPlaying: boolean;
    isLoading: boolean;
    onPress: () => void;
    waveform?: number[];
    barCount?: number;
    barColor?: string;
    activeBarColor?: string;
    style?: ViewStyle;
}

export const WaveformVisualizer = ({
    isPlaying,
    isLoading,
    onPress,
    waveform,
    barCount = 40,
    barColor = 'rgba(255, 255, 255, 0.4)',
    activeBarColor = 'rgba(255, 255, 255, 0.95)',
    style,
}: WaveformVisualizerProps) => {
    // Generate random waveform if not provided
    const bars = waveform && waveform.length > 0
        ? waveform.slice(0, barCount)
        : Array.from({ length: barCount }, () => Math.random() * 0.5 + 0.3);

    // Create animated values for each bar
    const animatedValues = useRef(
        bars.map(() => new Animated.Value(1))
    ).current;

    useEffect(() => {
        if (isPlaying) {
            // Create staggered animation for bars
            const animations = animatedValues.map((value, index) => {
                return Animated.loop(
                    Animated.sequence([
                        Animated.timing(value, {
                            toValue: 1.5,
                            duration: 300 + (index % 5) * 50,
                            useNativeDriver: true,
                        }),
                        Animated.timing(value, {
                            toValue: 0.6,
                            duration: 300 + (index % 5) * 50,
                            useNativeDriver: true,
                        }),
                    ])
                );
            });

            Animated.stagger(30, animations).start();
        } else {
            // Reset all bars to original height
            animatedValues.forEach((value) => {
                Animated.timing(value, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            });
        }
    }, [isPlaying]);

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isLoading}
            style={[
                {
                    height: 60,
                    borderRadius: 16,
                    paddingHorizontal: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    // borderWidth: 1,
                    // borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                style,
            ]}
            activeOpacity={0.7}
        >
            {bars.map((height, index) => {
                const animatedHeight = animatedValues[index];

                return (
                    <Animated.View
                        key={index}
                        style={{
                            width: 2,
                            height: `${height * 100}%`,
                            backgroundColor: isPlaying ? activeBarColor : barColor,
                            borderRadius: 1,
                            transform: [{ scaleY: animatedHeight }],
                            opacity: isLoading ? 0.3 : 1,
                        }}
                    />
                );
            })}
        </TouchableOpacity>
    );
};

import React, { useEffect } from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop, Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    withRepeat,
    withTiming,
    useAnimatedProps,
    Easing,
    useDerivedValue
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function MeshBackground() {
    const { width, height } = useWindowDimensions();

    // Randomize initial positions slightly for organic feel
    const orb1X = useSharedValue(width * 0.2);
    const orb1Y = useSharedValue(height * 0.3);
    const orb2X = useSharedValue(width * 0.8);
    const orb2Y = useSharedValue(height * 0.2);
    const orb3X = useSharedValue(width * 0.5);
    const orb3Y = useSharedValue(height * 0.8);

    useEffect(() => {
        const config = { duration: 10000, easing: Easing.inOut(Easing.ease) };
        const repeat = -1; // Infinite
        const reverse = true;

        orb1X.value = withRepeat(withTiming(width * 0.3, config), repeat, reverse);
        orb1Y.value = withRepeat(withTiming(height * 0.4, config), repeat, reverse);

        orb2X.value = withRepeat(withTiming(width * 0.7, { ...config, duration: 12000 }), repeat, reverse);
        orb2Y.value = withRepeat(withTiming(height * 0.1, { ...config, duration: 12000 }), repeat, reverse);

        orb3X.value = withRepeat(withTiming(width * 0.6, { ...config, duration: 15000 }), repeat, reverse);
        orb3Y.value = withRepeat(withTiming(height * 0.7, { ...config, duration: 15000 }), repeat, reverse);
    }, [width, height]);

    const animatedProps1 = useAnimatedProps(() => ({ cx: orb1X.value, cy: orb1Y.value }));
    const animatedProps2 = useAnimatedProps(() => ({ cx: orb2X.value, cy: orb2Y.value }));
    const animatedProps3 = useAnimatedProps(() => ({ cx: orb3X.value, cy: orb3Y.value }));

    return (
        <View style={StyleSheet.absoluteFill}>
            {/* Dark Base */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#020617' }]} />

            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <RadialGradient id="grad1" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                        <Stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                    </RadialGradient>
                    <RadialGradient id="grad2" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor="#c026d3" stopOpacity="0.3" />
                        <Stop offset="100%" stopColor="#c026d3" stopOpacity="0" />
                    </RadialGradient>
                    <RadialGradient id="grad3" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <Stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* Animated Orbs */}
                <AnimatedCircle
                    r={width * 0.8}
                    animatedProps={animatedProps1}
                    fill="url(#grad1)"
                />
                <AnimatedCircle
                    r={width * 0.7}
                    animatedProps={animatedProps2}
                    fill="url(#grad2)"
                />
                <AnimatedCircle
                    r={width * 0.9}
                    animatedProps={animatedProps3}
                    fill="url(#grad3)"
                />
            </Svg>

            {/* Overlay for cohesion */}
            <View
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: '#020617', opacity: 0.3 }
                ]}
            />
        </View>
    );
}

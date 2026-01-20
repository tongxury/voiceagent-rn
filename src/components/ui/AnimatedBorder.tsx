import React, {useEffect, useRef} from "react";
import {Animated} from "react-native";

const AnimatedBorder = ({fromColor, toColor, children}: {fromColor: string, toColor: string, children: React.ReactNode }) => {
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 2,
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                }),
            ])
        );

        pulseAnimation.start();

        return () => pulseAnimation.stop();
    }, []);

    const animatedStyle = {
        borderColor: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [fromColor + '30', toColor],
        }),
        shadowColor: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [toColor + '00', toColor + '50'],
        }),
    };

    return (
        <Animated.View
            style={[
                {
                    borderWidth: 3,
                    borderRadius: 12,
                    shadowOffset: {width: 0, height: 0},
                    shadowRadius: 8,
                    elevation: 3,
                },
                animatedStyle
            ]}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedBorder;

import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {Modal, View, Text, Animated, Dimensions} from 'react-native';

const Dialog = ({visible, children}: { visible: boolean, children: ReactNode }) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        );

        if (visible) {
            animation.start();
        } else {
            animation.stop();
        }

        return () => animation.stop();
    }, [visible]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="bg-background/50 h-full justify-center items-center">
                <View className="bg-background1 rounded-2xl p-8 items-center shadow-xl">
                    {children}
                </View>
            </View>
        </Modal>
    );
};


export default Dialog;

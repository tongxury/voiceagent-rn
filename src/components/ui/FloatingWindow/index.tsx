import React from "react";
import {Animated, Dimensions, StyleProp, View, ViewStyle} from "react-native";

interface FloatingWindowProps {
    children?: React.ReactNode;
    onClose?: () => void;
    visible?: boolean;
    height?: number;
    width?: number;
    topOffset?: number; // 距离顶部的偏移量
}

export const FloatingWindow: React.FC<FloatingWindowProps> = ({
                                                                  children,
                                                                  onClose,
                                                                  visible = false,
                                                                  height = 160,
                                                                  width = 120,
                                                                  topOffset = 60, // 调整默认偏移量
                                                              }) => {

    // 滑动动画值 - 优化初始位置
    const slideAnim = React.useRef(new Animated.Value(-height - 100)).current;
    const opacityAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.95)).current; // 更微妙的缩放效果

    React.useEffect(() => {
        if (visible) {
            // 更流畅的显示动画
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: false,
                    tension: 120, // 增加张力，更有弹性
                    friction: 7, // 减少摩擦，更流畅
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400, // 稍微延长持续时间
                    useNativeDriver: false,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: false,
                    tension: 120,
                    friction: 7,
                }),
            ]).start();
        } else {
            // 更快速的隐藏动画
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -height - 100,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.95,
                    duration: 200,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [visible, height, topOffset, slideAnim, opacityAnim, scaleAnim]);

    if (!visible) {
        return null;
    }

    return (
        <Animated.View
            className="absolute right-4 z-[9999]"
            style={{
                bottom: topOffset + 50,
                opacity: opacityAnim,
                transform: [{translateY: slideAnim}, {scale: scaleAnim}],
            }}
        >

            <View
                className="bg-background/90 rounded-[15px] p-[10px] border border-grey4"
                style={{height: height, width: width}}
            >
                {children}
            </View>
        </Animated.View>
    );
};

import React, {useEffect, useRef} from "react";
import {Animated, View, ViewStyle} from "react-native";

interface AnimatedProgressBarProps {
    progress: number; // 0-1 之间的值
    fromColor: string;
    toColor: string;
    backgroundColor?: string;
    width?: number;
    height?: number;
    borderRadius?: number;
    animated?: boolean;
    style?: ViewStyle;
    children?: React.ReactNode;
}

// 辅助函数：确保颜色格式一致
const normalizeColor = (color: string): string => {
    // 如果是hex颜色且长度为7（#RRGGBB），直接返回
    if (color.startsWith('#') && color.length === 7) {
        return color;
    }
    // 如果是3位hex（#RGB），转换为6位
    if (color.startsWith('#') && color.length === 4) {
        const r = color[1];
        const g = color[2];
        const b = color[3];
        return `#${r}${r}${g}${g}${b}${b}`;
    }
    // 其他情况使用默认颜色
    return '#000000';
};

const AnimatedProgressBar = ({
                                 progress = 0,
                                 fromColor = "red",
                                 toColor = "green",
                                 backgroundColor = '#E5E7EB',
                                 width = 200,
                                 height = 8,
                                 borderRadius = 4,
                                 animated = true,
                                 style,
                                 children
                             }: AnimatedProgressBarProps) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;

    // 标准化颜色格式
    const normalizedFromColor = normalizeColor(fromColor);
    const normalizedToColor = normalizeColor(toColor);

    useEffect(() => {
        // 进度动画
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    useEffect(() => {
        if (animated && progress > 0 && progress < 1) {
            // 脉冲动画 - 只在进度中时播放
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: false,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: false,
                    }),
                ])
            );
            pulseAnimation.start();
            return () => pulseAnimation.stop();
        }
    }, [animated, progress]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    const animatedProgressStyle = {
        backgroundColor: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [normalizedFromColor, normalizedToColor],
        }),
        shadowColor: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [normalizedFromColor, normalizedToColor], // 修复：使用相同格式的颜色
        }),
        shadowOpacity: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.8], // 用透明度控制阴影强度
        }),
    };

    return (
        <View style={[{width, height}, style]}>
            {/* 背景容器 */}
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor,
                    borderRadius,
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {/* 进度条 */}
                <Animated.View
                    style={[
                        {
                            height: '100%',
                            width: progressWidth,
                            borderRadius,
                            shadowOffset: {width: 0, height: 0},
                            shadowRadius: 6,
                            elevation: 2,
                        },
                        animatedProgressStyle
                    ]}
                />
            </View>

            {/* 内容覆盖层 */}
            {children && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {children}
                </View>
            )}
        </View>
    );
};

export default AnimatedProgressBar;

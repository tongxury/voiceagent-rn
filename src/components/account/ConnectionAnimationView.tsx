import React, {useEffect, useRef} from "react";
import {Animated, Image, View} from "react-native";
import {useColors} from "@/hooks/useColors";
import SocialIcon from "@/assets/svgs";

interface ConnectionAnimationViewProps {
    platform: string;
}

const ConnectionAnimationView: React.FC<ConnectionAnimationViewProps> = ({
                                                                             platform,
                                                                         }) => {
    const colors = useColors();

    // 将动画值移到组件内部
    const connectionProgress = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {

        // 开始连接动画
        connectionProgress.setValue(0);
        pulseAnim.setValue(1);
        scaleAnim.setValue(1);

        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );

        const progressAnimation = Animated.timing(connectionProgress, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: false,
        });

        pulseAnimation.start();
        progressAnimation.start();

        // 清理函数
        return () => {
            pulseAnimation.stop();
            progressAnimation.stop();
        };
    }, []);

    return (
        <View className="items-center justify-center py-8">
            <View className="w-full max-w-sm">
                {/* 中心连接区域 */}
                <View className="flex-row items-center">
                    {/* App 图标 */}
                    <Animated.View
                        style={{
                            transform: [
                                {scale: Animated.multiply(pulseAnim, scaleAnim)}
                            ]
                        }}
                    >
                        <Image
                            style={{
                                height: 64,
                                width: 64,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: colors.grey1
                            }}
                            source={require('@/assets/images/app_icon.png')}
                        />
                    </Animated.View>

                    {/* 连接线 */}
                    <View className="flex-1 mx-8 h-2 relative">
                        {/* 背景线 */}
                        <View className="absolute top-0 left-0 right-0 h-2 bg-gray-600 rounded-full"/>

                        {/* 进度线 */}
                        <Animated.View
                            className="absolute top-0 left-0 h-2 bg-primary rounded-full"
                            style={{
                                width: connectionProgress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0%', '100%'],
                                }),
                            }}
                        />
                    </View>

                    <Animated.View
                        style={{
                            transform: [
                                {scale: Animated.multiply(pulseAnim, scaleAnim)}
                            ]
                        }}
                    >
                        <SocialIcon name={platform} size={64}/>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};

export default ConnectionAnimationView;

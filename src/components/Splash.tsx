import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    Animated,
    Dimensions,
    StatusBar,
    Platform,
    Image,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useColors} from "@/hooks/useColors";

const {width, height} = Dimensions.get('window');

interface CustomSplashScreenProps {
    isReady: boolean;
    onFinish: () => void;
}

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
                                                                   isReady,
                                                                   onFinish,
                                                               }) => {
    // 动画值
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(30)).current;
    const progressOpacity = useRef(new Animated.Value(0)).current;
    const progressWidth = useRef(new Animated.Value(0)).current;
    const containerOpacity = useRef(new Animated.Value(1)).current;

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        startEntranceAnimation();
    }, []);

    useEffect(() => {
        if (isReady && progress >= 100) {
            // 应用准备就绪且进度完成，开始退出动画
            setTimeout(() => {
                startExitAnimation();
            }, 500);
        }
    }, [isReady, progress]);

    const startEntranceAnimation = () => {
        // 入场动画序列
        Animated.sequence([
            // Logo 缩放和透明度
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            // 标题出现
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(titleTranslateY, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            // 进度条出现
            Animated.timing(progressOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    };


    const startExitAnimation = () => {
        // 退出动画
        Animated.timing(containerOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start(() => {
            onFinish();
        });
    };

    const colors = useColors()

    return (
        <Animated.View
            style={{
                flex: 1,
                opacity: containerOpacity
            }}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            <LinearGradient
                colors={[colors.primary, colors.background, colors.background]}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: Platform.OS === 'ios' ? 50 : 30,
                }}
            >
                {/* Logo 容器 */}
                <Animated.View
                    style={{
                        transform: [{scale: logoScale}],
                        opacity: logoOpacity,
                        marginBottom: 40,
                    }}
                >

                    <Image
                        source={require("../assets/images/icon.png")}
                        style={{
                            width: 120,
                            height: 120,
                            // borderRadius: '50%',
                        }}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* 应用标题 */}
                <Animated.View
                    style={{
                        opacity: titleOpacity,
                        transform: [{translateY: titleTranslateY}],
                        alignItems: 'center',
                        marginBottom: 60,
                    }}
                >
                    <Text style={{
                        fontSize: 40,
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: 8,
                        textAlign: 'center',
                    }}>
                        Veogo
                    </Text>
                    {/*<Text style={{*/}
                    {/*    fontSize: 16,*/}
                    {/*    color: 'rgba(255, 255, 255, 0.8)',*/}
                    {/*    textAlign: 'center',*/}
                    {/*    paddingHorizontal: 40,*/}
                    {/*}}>*/}
                    {/*    创造美好的用户体验*/}
                    {/*</Text>*/}
                </Animated.View>

                {/*/!* 进度区域 *!/*/}
                {/*<Animated.View*/}
                {/*    style={{*/}
                {/*        opacity: progressOpacity,*/}
                {/*        alignItems: 'center',*/}
                {/*        width: '100%',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    /!* 进度条 *!/*/}
                {/*    <View style={{*/}
                {/*        width: width * 0.7,*/}
                {/*        height: 4,*/}
                {/*        backgroundColor: 'rgba(255, 255, 255, 0.3)',*/}
                {/*        borderRadius: 2,*/}
                {/*        overflow: 'hidden',*/}
                {/*        marginBottom: 20,*/}
                {/*    }}>*/}
                {/*        <Animated.View*/}
                {/*            style={{*/}
                {/*                width: progressWidth,*/}
                {/*                height: '100%',*/}
                {/*                backgroundColor: 'white',*/}
                {/*                borderRadius: 2,*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </View>*/}

                {/*    /!* 加载文本 *!/*/}
                {/*    <Text style={{*/}
                {/*        fontSize: 16,*/}
                {/*        color: 'rgba(255, 255, 255, 0.9)',*/}
                {/*        marginBottom: 8,*/}
                {/*    }}>*/}
                {/*        {currentStep}*/}
                {/*    </Text>*/}

                {/*    /!* 进度百分比 *!/*/}
                {/*    <Text style={{*/}
                {/*        fontSize: 14,*/}
                {/*        color: 'rgba(255, 255, 255, 0.7)',*/}
                {/*    }}>*/}
                {/*        {Math.round(progress)}%*/}
                {/*    </Text>*/}
                {/*</Animated.View>*/}

                {/*/!* 底部信息 *!/*/}
                {/*<View style={{*/}
                {/*    position: 'absolute',*/}
                {/*    bottom: 50,*/}
                {/*    alignItems: 'center',*/}
                {/*}}>*/}
                {/*    <Text style={{*/}
                {/*        fontSize: 14,*/}
                {/*        color: 'rgba(255, 255, 255, 0.6)',*/}
                {/*        marginBottom: 4,*/}
                {/*    }}>*/}
                {/*        版本 1.0.0*/}
                {/*    </Text>*/}
                {/*    <Text style={{*/}
                {/*        fontSize: 12,*/}
                {/*        color: 'rgba(255, 255, 255, 0.5)',*/}
                {/*    }}>*/}
                {/*        © 2024 我的公司*/}
                {/*    </Text>*/}
                {/*</View>*/}
            </LinearGradient>
        </Animated.View>
    );
};

export default CustomSplashScreen;

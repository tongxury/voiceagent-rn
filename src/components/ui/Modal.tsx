import {
    Animated,
    TouchableOpacity,
    View,
    Text,
    Pressable,
    ViewStyle,
    Dimensions,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import {ReactNode, useEffect, useRef} from 'react';
import {useColors} from '@/hooks/useColors';

// 定义可能的出现位置
type Position = 'top' | 'bottom';

interface CustomModalProps {
    visible?: boolean;
    onClose?: () => void;
    position?: Position;
    showCloseButton?: boolean;
    closeButtonStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    animationDuration?: number;
    backgroundOpacity?: number;
    closeOnBackdropPress?: boolean;
    children: ReactNode;
}

const Modal = ({
                   visible = false,
                   onClose,
                   position = 'bottom',
                   contentStyle,
                   animationDuration = 300,
                   backgroundOpacity = 0.6, // 增加默认蒙层透明度
                   closeOnBackdropPress = true,
                   children,
               }: CustomModalProps) => {
    const animation = useRef(new Animated.Value(0)).current;
    const scaleAnimation = useRef(new Animated.Value(0.95)).current; // 添加缩放动画
    const {height} = Dimensions.get('window');
    const colors = useColors();

    useEffect(() => {
        if (visible) {
            // 确保动画从初始值开始
            animation.setValue(0);
            scaleAnimation.setValue(0.95);

            Animated.parallel([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnimation, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(animation, {
                    toValue: 0,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnimation, {
                    toValue: 0.95,
                    duration: animationDuration,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, animationDuration]);

    // 计算从哪个方向滑入
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: position === 'bottom' ? [height, 0] : [-height, 0],
    });

    const overlayOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, backgroundOpacity],
    });

    // 不可见时不渲染
    if (!visible) return null;

    // 内容样式基于位置
    const positionStyle: ViewStyle = {
        ...(position === 'top' ? {top: 0} : {bottom: 0}),
        left: 0,
        right: 0,
        position: 'absolute',
    };

    // 内容边框圆角基于位置 - 改进圆角设计
    const borderRadiusStyle: ViewStyle = {
        ...(position === 'top'
            ? {
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
            }
            : {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
            }),
    };

    const modalContainerStyle = {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: position === 'top' ? 'flex-start' : 'flex-end',
        zIndex: 1000,
        pointerEvents: 'box-none' as const,
    } as any;

    const pressableOverlayStyle = {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    };

    const modalContentStyle = {
        backgroundColor: colors.background,
        position: 'relative' as const,
        zIndex: 1002,
        overflow: 'hidden' as const,
        // 添加阴影效果
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: position === 'bottom' ? -4 : 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 15,
        // 添加最小高度和内边距
        minHeight: 100,
        paddingTop: position === 'top' ? 20 : 12,
        paddingBottom: position === 'bottom' ? 20 : 12,
    };

    return (
        <View style={modalContainerStyle}>
            {/* 改进的蒙层部分 */}
            <Animated.View
                style={[
                    {
                        opacity: overlayOpacity,
                        ...pressableOverlayStyle,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)', // 增加蒙层透明度
                        pointerEvents: 'auto' as const,
                        zIndex: 1001,
                    },
                ]}
                className="h-screen"
            >
                <Pressable style={pressableOverlayStyle} onPress={closeOnBackdropPress ? onClose : undefined}/>
            </Animated.View>


            <Animated.View
                style={[
                    modalContentStyle,
                    positionStyle,
                    borderRadiusStyle,
                    {
                        transform: [
                            {translateY},
                            {scale: scaleAnimation}
                        ]
                    },
                    contentStyle,
                ]}
                className="overflow-hidden"
                pointerEvents="auto"
            >
                {/* 添加顶部指示器（仅bottom位置） */}
                {position === 'bottom' && (
                    <View className="items-center">
                        <View
                            className="w-10 h-1 rounded-full mb-4"
                            style={{backgroundColor: colors.border}}
                        />
                    </View>
                )}

                {children}
            </Animated.View>
        </View>
    );
};

export default Modal;

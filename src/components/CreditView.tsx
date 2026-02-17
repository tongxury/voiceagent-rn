import React, { useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { fetchCreditState } from "@/api/payment";
import { FlashIcon } from "@/constants/scene_icons";
import { useQueryData } from '@/shared/hooks/useQueryData';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withRepeat, 
    withTiming, 
    Easing,
    interpolate
} from 'react-native-reanimated';

interface CreditViewProps {
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    showIcon?: boolean;
    iconSize?: number;
    iconColor?: string;
}

export const CreditView: React.FC<CreditViewProps> = ({
    style,
    textStyle,
    showIcon = true,
    iconSize = 14,
    iconColor = "rgba(255, 255, 255, 0.95)"
}) => {
    const { data, refetch } = useQueryData({
        queryKey: ['credit-state'],
        queryFn: () => fetchCreditState(),
    });

    // Track first mount to avoid duplicate request
    const isFirstMount = useRef(true);

    // Refresh credit state when screen gains focus (skip first mount)
    useFocusEffect(
        useCallback(() => {
            if (isFirstMount.current) {
                isFirstMount.current = false;
                return;
            }
            refetch();
        }, [refetch])
    );

    const shimmerValue = useSharedValue(0);

    useEffect(() => {
        shimmerValue.value = withRepeat(
            withTiming(1, { 
                duration: 3000, 
                easing: Easing.bezier(0.4, 0, 0.2, 1) 
            }),
            -1,
            false
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            shimmerValue.value,
            [0, 1],
            [-100, 100]
        );
        return {
            transform: [{ translateX }, { skewX: '-20deg' }],
        };
    });

    if (!data) return null;

    const balance = data.balance || 0;

    return (
        <View style={[styles.container, style]}>
            {/* Background Base */}
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.03)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}
            >
                {/* Shimmer Overlay */}
                <Animated.View style={[styles.shimmerContainer, shimmerStyle]}>
                    <LinearGradient
                        colors={['transparent', 'rgba(255, 255, 255, 0.15)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.shimmer}
                    />
                </Animated.View>

                {/* Content */}
                <View style={styles.content}>
                    {showIcon && (
                        <View style={styles.iconContainer}>
                            <FlashIcon size={iconSize} color={iconColor} />
                        </View>
                    )}
                    <Text
                        style={[styles.text, textStyle]}
                        numberOfLines={1}
                    >
                        {balance}
                    </Text>
                </View>
            </LinearGradient>
            
            {/* Outer Highlight Border */}
            <View style={styles.borderOverlay} pointerEvents="none" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 999,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    gradient: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
    },
    shimmerContainer: {
        ...StyleSheet.absoluteFillObject,
        width: '50%',
    },
    shimmer: {
        flex: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 6,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        fontFamily: 'System',
    },
    borderOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
});

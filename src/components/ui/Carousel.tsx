import React, {useState, useRef, useEffect, ReactNode} from 'react';
import {
    View,
    ScrollView,
    Dimensions,
    StyleSheet,
    TouchableOpacity, StyleProp, ViewStyle,
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

export interface CarouselProps {
    data: any[];
    renderItem: (item: any, index: number) => ReactNode;
    autoPlay?: boolean;
    interval?: number;
    showDots?: boolean;
    dotStyle?: object;
    activeDotStyle?: object;
    onItemPress?: (item: any, index: number) => void;
    style?: StyleProp<ViewStyle>;
    itemWidth?: number;
    itemHeight?: number;
}

const Carousel: React.FC<CarouselProps> = (
    {
        data = [],
        autoPlay = true,
        interval = 3000,
        showDots = true,
        dotStyle = {},
        activeDotStyle = {},
        onItemPress = () => {
        },
        style = {},
        renderItem,
        itemWidth = screenWidth,
        itemHeight = 200,
    }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // 自动播放功能
    useEffect(() => {
        if (autoPlay && data.length > 1) {
            // @ts-ignore
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex: number) => {
                    const nextIndex = (prevIndex + 1) % data.length;
                    scrollViewRef.current?.scrollTo({
                        x: nextIndex * itemWidth,
                        animated: true,
                    });
                    return nextIndex;
                });
            }, interval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [autoPlay, interval, data.length, itemWidth]);

    // 处理滚动事件
    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const index = Math.round(contentOffset.x / itemWidth);
        setCurrentIndex(index);
    };

    // 渲染轮播项
    const renderCarouselItem = (item: any, index: number) => (
        <TouchableOpacity
            key={item.id || index}
            style={[styles.itemContainer, {width: itemWidth, height: itemHeight}]}
            onPress={() => onItemPress(item, index)}
            activeOpacity={0.8}
        >
            {renderItem(item, index)}
        </TouchableOpacity>
    );

    // 渲染指示器
    const renderDots = () => {
        if (!showDots || data.length <= 1) return null;

        return (
            <View style={styles.dotsContainer}>
                {data.map((_, index: number) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            dotStyle,
                            index === currentIndex && [styles.activeDot, activeDotStyle],
                        ]}
                    />
                ))}
            </View>
        );
    };

    if (data.length === 0) {
        return null;
    }

    return (
        <View style={[styles.container, style]}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                style={styles.scrollView}
            >
                {data.map((item, index) => renderCarouselItem(item, index))}
            </ScrollView>
            {renderDots()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    scrollView: {
        flex: 1,
    },
    itemContainer: {
        position: 'relative',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#007AFF',
        width: 12,
        height: 8,
        borderRadius: 4,
    },
});

export default Carousel;

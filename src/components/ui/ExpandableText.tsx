import React, {useState} from 'react';
import {Text, TouchableOpacity, View, Animated} from 'react-native';

interface ExpandableTextProps {
    content?: string;
    maxLength?: number;
    className?: string;
}


const ExpandableText = ({
                            content,
                            maxLength = 100,
                            className = 'text-sm text-grey0'
                        }: ExpandableTextProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(1));

    if (!content) return null;

    const shouldShowToggle = content.length > maxLength;
    const displayText = shouldShowToggle && !isExpanded
        ? content.slice(0, maxLength) + '...'
        : content;

    const handleToggle = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setIsExpanded(!isExpanded);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }).start();
        });
    };

    return (
        <View>
            <Animated.View style={{opacity: fadeAnim}}>
                <Text className={className}>
                    {displayText}
                </Text>
            </Animated.View>

            {shouldShowToggle && (
                <TouchableOpacity
                    onPress={handleToggle}
                    className="mt-[2px]"
                    activeOpacity={0.7}
                >
                    <Text className="text-sm text-primary font-medium">
                        {isExpanded ? '收起' : '查看全部'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ExpandableText;

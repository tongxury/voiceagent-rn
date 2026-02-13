import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Animated } from 'react-native';
import { useTranslation } from "@/i18n/translation";

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
    const { t } = useTranslation();
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
            <Animated.View style={{ opacity: fadeAnim }}>
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
                        {isExpanded ? t('ui.expandableText.collapse') : t('ui.expandableText.viewAll')}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ExpandableText;

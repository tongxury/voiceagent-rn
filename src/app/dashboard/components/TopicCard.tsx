import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTailwindVars from '@/hooks/useTailwindVars';

interface TopicCardProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: () => void;
    description?: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({ title, icon, color, onPress, description }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white/5 rounded-2xl p-4 border border-white/10 w-full min-h-[140px] justify-between"
            activeOpacity={0.7}
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
            }}
        >
            <View>
                <View className={`w-10 h-10 rounded-full items-center justify-center mb-3`} style={{ backgroundColor: `${color}20` }}>
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text className="text-white font-bold text-lg mb-1">{title}</Text>
            </View>
            {description && (
                <Text className="text-white/50 text-xs leading-4">
                    {description}
                </Text>
            )}
        </TouchableOpacity>
    );
};

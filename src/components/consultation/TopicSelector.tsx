import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// 咨询主题配置
export const CONSULTATION_TOPICS = [
    { id: 'anxiety', label: '焦虑缓解', icon: 'head-question', color: '#f59e0b', prompt: '帮助用户缓解焦虑情绪' },
    { id: 'stress', label: '压力管理', icon: 'lightning-bolt', color: '#ef4444', prompt: '帮助用户管理和释放压力' },
    { id: 'relationship', label: '人际关系', icon: 'account-group', color: '#06b6d4', prompt: '帮助用户处理人际关系问题' },
    { id: 'mood', label: '情绪低落', icon: 'emoticon-sad', color: '#6366f1', prompt: '帮助用户走出情绪低落' },
    { id: 'work', label: '职场困扰', icon: 'briefcase', color: '#10b981', prompt: '帮助用户解决职场问题' },
    { id: 'love', label: '亲密关系', icon: 'heart', color: '#ec4899', prompt: '帮助用户处理感情问题' },
    { id: 'growth', label: '自我成长', icon: 'sprout', color: '#84cc16', prompt: '帮助用户实现自我成长' },
    { id: 'other', label: '自由聊聊', icon: 'chat', color: '#8b5cf6', prompt: '自由对话咨询' },
];

interface TopicSelectorProps {
    onSelect: (topic: typeof CONSULTATION_TOPICS[0]) => void;
    visible?: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect, visible = true }) => {
    if (!visible) return null;

    return (
        <View className="px-4 mb-4">
            <Text className="text-white/40 text-xs tracking-wider mb-3 text-center">
                今天想聊什么？
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
            >
                {CONSULTATION_TOPICS.map((topic) => (
                    <TouchableOpacity
                        key={topic.id}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onSelect(topic);
                        }}
                        className="mr-2"
                    >
                        <BlurView
                            intensity={15}
                            tint="dark"
                            className="rounded-xl overflow-hidden border border-white/10"
                        >
                            <View className="px-3 py-2 flex-row items-center">
                                <MaterialCommunityIcons
                                    name={topic.icon as any}
                                    size={16}
                                    color={topic.color}
                                />
                                <Text className="text-white/70 text-xs ml-1.5">
                                    {topic.label}
                                </Text>
                            </View>
                        </BlurView>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

interface ConsultationSummaryProps {
    visible: boolean;
    onClose: () => void;
    emotion?: string;
    trigger?: string;
    suggestion?: string;
    daysCount?: number;
}

export const ConsultationSummary: React.FC<ConsultationSummaryProps> = ({
    visible,
    onClose,
    emotion = '平静',
    trigger = '未检测到明确触发因素',
    suggestion = '保持当前状态，继续关注自己的情绪变化',
    daysCount = 1,
}) => {
    if (!visible) return null;

    const emotionConfig: Record<string, { label: string; icon: string; color: string }> = {
        '焦虑': { label: '焦虑', icon: 'emoticon-confused', color: '#f59e0b' },
        '压力': { label: '压力', icon: 'lightning-bolt', color: '#ef4444' },
        '平静': { label: '平静', icon: 'emoticon-neutral', color: '#06b6d4' },
        '开心': { label: '开心', icon: 'emoticon-happy', color: '#10b981' },
        '低落': { label: '低落', icon: 'emoticon-sad', color: '#6366f1' },
    };

    const config = emotionConfig[emotion] || emotionConfig['平静'];

    return (
        <View className="absolute inset-0 items-center justify-center bg-black/60 z-50">
            <BlurView intensity={30} tint="dark" className="mx-6 rounded-3xl overflow-hidden border border-white/10">
                <LinearGradient
                    colors={[`${config.color}15`, 'transparent']}
                    className="p-6"
                >
                    {/* 头部 */}
                    <View className="items-center mb-4">
                        <View
                            className="h-14 w-14 rounded-2xl items-center justify-center mb-3"
                            style={{ backgroundColor: `${config.color}30` }}
                        >
                            <MaterialCommunityIcons
                                name={config.icon as any}
                                size={28}
                                color={config.color}
                            />
                        </View>
                        <Text className="text-white text-lg font-medium">今日情绪快照</Text>
                    </View>

                    {/* 内容 */}
                    <View className="bg-white/5 rounded-2xl p-4 mb-4">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-white/40 text-sm w-20">主要情绪</Text>
                            <Text className="text-white">{config.label}</Text>
                        </View>
                        <View className="flex-row items-start mb-3">
                            <Text className="text-white/40 text-sm w-20">触发因素</Text>
                            <Text className="text-white/70 flex-1">{trigger}</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-white/40 text-sm w-20">AI 建议</Text>
                            <Text className="text-white/70 flex-1">{suggestion}</Text>
                        </View>
                    </View>

                    {/* 7天进度条 */}
                    <View className="bg-white/5 rounded-2xl p-4 mb-4">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-white/60 text-sm">🌱 心理健康之旅</Text>
                            <Text className="text-white/40 text-xs">{daysCount}/7 天</Text>
                        </View>
                        <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <View
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${(daysCount / 7) * 100}%` }}
                            />
                        </View>
                        <Text className="text-white/30 text-xs mt-2 text-center">
                            连续咨询7天，解锁完整心理健康报告
                        </Text>
                    </View>

                    {/* 按钮 */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1"
                        >
                            <View className="py-3 items-center bg-white/5 rounded-xl border border-white/10">
                                <Text className="text-white/60">查看详情</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1"
                        >
                            <LinearGradient
                                colors={['#10b981', '#059669']}
                                className="py-3 items-center rounded-xl"
                            >
                                <Text className="text-white font-medium">明天继续</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </BlurView>
        </View>
    );
};

export default TopicSelector;

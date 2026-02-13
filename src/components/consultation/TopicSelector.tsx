import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTranslation } from "@/i18n/translation";

// 咨询主题配置
export const CONSULTATION_TOPICS = [
    { id: 'anxiety', label: 'Anxiety Relief', icon: 'head-question', color: '#f59e0b', prompt: 'Help user relieve anxiety' },
    { id: 'stress', label: 'Stress Management', icon: 'lightning-bolt', color: '#ef4444', prompt: 'Help user manage and release stress' },
    { id: 'relationship', label: 'Relationships', icon: 'account-group', color: '#06b6d4', prompt: 'Help user handle relationship issues' },
    { id: 'mood', label: 'Low Mood', icon: 'emoticon-sad', color: '#6366f1', prompt: 'Help user get out of low mood' },
    { id: 'work', label: 'Career Issues', icon: 'briefcase', color: '#10b981', prompt: 'Help user solve workplace problems' },
    { id: 'love', label: 'Intimacy', icon: 'heart', color: '#ec4899', prompt: 'Help user handle relationship problems' },
    { id: 'growth', label: 'Self Growth', icon: 'sprout', color: '#84cc16', prompt: 'Help user achieve self-growth' },
    { id: 'other', label: 'Free Chat', icon: 'chat', color: '#8b5cf6', prompt: 'Free conversation' },
];

interface TopicSelectorProps {
    onSelect: (topic: typeof CONSULTATION_TOPICS[0]) => void;
    visible?: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect, visible = true }) => {
    const { t } = useTranslation();
    if (!visible) return null;

    return (
        <View className="px-4 mb-4">
            <Text className="text-white/40 text-xs tracking-wider mb-3 text-center">
                {t('consultation.topicSelector.title')}
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
                                    {t(`consultation.topicValues.${topic.id}`)}
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
    const { t } = useTranslation();
    if (!visible) return null;

    const emotionConfig: Record<string, { label: string; icon: string; color: string }> = {
        '焦虑': { label: t('consultation.summary.emotions.anxiety'), icon: 'emoticon-confused', color: '#f59e0b' },
        '压力': { label: t('consultation.summary.emotions.stress'), icon: 'lightning-bolt', color: '#ef4444' },
        '平静': { label: t('consultation.summary.emotions.calm'), icon: 'emoticon-neutral', color: '#06b6d4' },
        '开心': { label: t('consultation.summary.emotions.happy'), icon: 'emoticon-happy', color: '#10b981' },
        '低落': { label: t('consultation.summary.emotions.down'), icon: 'emoticon-sad', color: '#6366f1' },
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
                        <Text className="text-white text-lg font-medium">{t('consultation.summary.title')}</Text>
                    </View>

                    {/* 内容 */}
                    <View className="bg-white/5 rounded-2xl p-4 mb-4">
                        <View className="flex-row items-center mb-3">
                            <Text className="text-white/40 text-sm w-20">{t('consultation.summary.mainEmotion')}</Text>
                            <Text className="text-white">{config.label}</Text>
                        </View>
                        <View className="flex-row items-start mb-3">
                            <Text className="text-white/40 text-sm w-20">{t('consultation.summary.trigger')}</Text>
                            <Text className="text-white/70 flex-1">{trigger}</Text>
                        </View>
                        <View className="flex-row items-start">
                            <Text className="text-white/40 text-sm w-20">{t('consultation.summary.aiSuggestion')}</Text>
                            <Text className="text-white/70 flex-1">{suggestion}</Text>
                        </View>
                    </View>

                    {/* 7天进度条 */}
                    <View className="bg-white/5 rounded-2xl p-4 mb-4">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-white/60 text-sm">{t('consultation.summary.journeyTitle')}</Text>
                            <Text className="text-white/40 text-xs">{daysCount}/7</Text>
                        </View>
                        <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <View
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${(daysCount / 7) * 100}%` }}
                            />
                        </View>
                        <Text className="text-white/30 text-xs mt-2 text-center">
                            {t('consultation.summary.journeyDesc')}
                        </Text>
                    </View>

                    {/* 按钮 */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1"
                        >
                            <View className="py-3 items-center bg-white/5 rounded-xl border border-white/10">
                                <Text className="text-white/60">{t('consultation.summary.viewDetails')}</Text>
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
                                <Text className="text-white font-medium">{t('consultation.summary.continueTomorrow')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </BlurView>
        </View >
    );
};

export default TopicSelector;

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from "@/i18n/translation";
import { Topic } from '@/types';
import { useQueryData } from '@/shared/hooks/useQueryData';
import { listTopics } from '@/api/voiceagent';

interface TopicStepProps {
    selectedTopics: string[];
    setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
    onNext: () => void;
    onBack: () => void;
}

export default function TopicStep({ selectedTopics, setSelectedTopics, onNext, onBack }: TopicStepProps) {
    const { t } = useTranslation();

    const { data: topicsData, isLoading: isLoadingTopics } = useQueryData({
        queryKey: ['topics'],
        queryFn: () => listTopics(),
    });

    const topics = topicsData?.list || [];

    return (
        <View className="flex-1 pt-24 px-6">
            <View className="mb-12 px-4">
                <Text className="text-white text-4xl font-light mb-4 text-center">{t('onboarding.topics_title', { defaultValue: '此刻的你' })}</Text>
                <Text className="text-white/50 text-base font-light text-center">{t('onboarding.topics_subtitle', { defaultValue: '选择你关心的，我们将为你定制体验' })}</Text>
            </View>
            <View className="flex-1">
                {isLoadingTopics ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#a78bfa" />
                    </View>
                ) : (
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        <View className="flex-row flex-wrap justify-between">
                            {topics.map((topic: Topic) => {
                                const isSelected = selectedTopics.includes(topic.id);
                                return (
                                    <TouchableOpacity 
                                        key={topic.id} 
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setSelectedTopics(prev => isSelected ? prev.filter(id => id !== topic.id) : [...prev, topic.id]);
                                        }} 
                                        className="w-[48%] mb-4"
                                    >
                                        <BlurView intensity={isSelected ? 40 : 15} tint="dark" className={`rounded-[32px] overflow-hidden border p-6 items-center ${isSelected ? 'border-violet-400/60 bg-violet-900/20' : 'border-white/10 bg-white/5'}`}>
                                            <View className={`h-12 w-12 rounded-full items-center justify-center mb-4 ${isSelected ? 'bg-white/20' : 'bg-white/5'}`}>
                                                <MaterialCommunityIcons name={(topic.icon || 'head-question') as any} size={28} color={isSelected ? (topic.color || '#a78bfa') : '#ffffff60'} />
                                            </View>
                                            <Text className={`text-sm font-medium tracking-wide ${isSelected ? 'text-white' : 'text-white/40'}`}>{topic.title}</Text>
                                        </BlurView>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                )}
            </View>
            <View className="absolute bottom-12 left-6 right-6 flex-row gap-4">
                <TouchableOpacity onPress={onBack} className="h-16 w-16 rounded-full border border-white/10 items-center justify-center bg-white/5">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onNext} disabled={selectedTopics.length === 0} className={`flex-1 h-16 rounded-full items-center justify-center overflow-hidden ${selectedTopics.length > 0 ? 'bg-white/20 border border-white/30' : 'bg-white/5 border border-white/5 opacity-50'}`}>
                    {selectedTopics.length > 0 ? <BlurView intensity={20} tint="dark" className="absolute inset-0" /> : null}
                    <Text className="text-white text-base font-light tracking-widest">{t('onboarding.topics_continue', { defaultValue: '寻找契合的灵魂' })}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';

import ScreenContainer from '@/shared/components/ScreenContainer';
import { useQueryData } from '@/shared/hooks/useQueryData';
import { getUserProfile, updateUserProfile, getEmotionStats } from '@/api/voiceagent';
import { UserProfile, EmotionStats } from '@/types';
import useTailwindVars from '@/hooks/useTailwindVars';
import { useTranslation } from '@/i18n/translation';

// 情绪颜色映射
const EMOTION_COLORS: Record<string, string> = {
    happy: '#10b981',
    excited: '#f59e0b',
    calm: '#06b6d4',
    neutral: '#9ca3af',
    sad: '#3b82f6',
    anxious: '#8b5cf6',
    angry: '#ef4444',
};

const EMOTION_ICONS: Record<string, string> = {
    happy: 'emoticon-happy-outline',
    excited: 'emoticon-excited-outline',
    calm: 'emoticon-neutral-outline',
    neutral: 'emoticon-neutral-outline',
    sad: 'emoticon-sad-outline',
    anxious: 'emoticon-confused-outline',
    angry: 'emoticon-angry-outline',
};

export default function ProfilePage() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const { colors } = useTailwindVars();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    // Unified Form State
    const [form, setForm] = useState<Partial<UserProfile>>({});
    const [hasChanges, setHasChanges] = useState(false);

    // 获取用户档案
});
const profile = profileData as UserProfile;

// Sync form with profile data when loaded
useEffect(() => {
    if (profile) {
        setForm({
            nickname: profile.nickname || '',
            birthday: profile.birthday || '',
            bio: profile.bio || '',
            interests: profile.interests || [],
            goals: profile.goals || [],
            personality: profile.personality || '',
        });
    }
}, [profile]);

// 获取情绪统计
const { data: emotionStatsData } = useQueryData({
    queryKey: ['emotionStats'],
    queryFn: () => getEmotionStats({ days: 30 }),
});
const emotionStats = (emotionStatsData as any)?.data as EmotionStats | undefined;

const handleSave = useCallback(async () => {
    try {
        await updateUserProfile(form);
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setHasChanges(false);
    } catch (error) {
        Alert.alert(t('profileDetail.saveFailed'), t('profileDetail.tryAgain'));
    }
}, [form, queryClient, t]);

const updateField = (field: keyof UserProfile, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
};

const toggleSelection = (field: 'interests' | 'goals', value: string) => {
    setForm(prev => {
        const current = (prev[field] as string[]) || [];
        const newValues = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
        return { ...prev, [field]: newValues };
    });
    setHasChanges(true);
};

// Components
const SectionTitle = ({ title }: { title: string }) => (
    <Text className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4 ml-1">
        {title}
    </Text>
);

const ChipGroup = ({
    field,
    options,
    translationPrefix,
    colorClass = 'indigo'
}: {
    field: 'interests' | 'goals',
    options: string[],
    translationPrefix: string,
    colorClass?: string
}) => {
    const currentValues = (form[field] as string[]) || [];

    return (
        <View className="flex-row flex-wrap gap-2">
            {options.map((option) => {
                const isSelected = currentValues.includes(option);
                const label = t(`${translationPrefix}.${option}`, { defaultValue: option });

                const bgClass = isSelected
                    ? (colorClass === 'cyan' ? 'bg-cyan-500/20' : 'bg-indigo-500/20')
                    : 'bg-white/5';
                const borderClass = isSelected
                    ? (colorClass === 'cyan' ? 'border-cyan-500/50' : 'border-indigo-500/50')
                    : 'border-white/10';
                const textClass = isSelected ? 'text-white' : 'text-white/60';

                return (
                    <TouchableOpacity
                        key={option}
                        onPress={() => toggleSelection(field, option)}
                        className={`px-3 py-2 rounded-xl border ${bgClass} ${borderClass}`}
                    >
                        <Text className={`${textClass} text-xs font-medium`}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

return (
    <ScreenContainer edges={['top']} style={{ backgroundColor: '#020617' }}>
        {/* Simple Background */}
        <View className="absolute top-0 left-0 right-0 h-[400px]">
            <LinearGradient
                colors={['#1e1b4b', '#020617']}
                style={{ flex: 1 }}
            />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
            <TouchableOpacity
                onPress={() => router.back()}
                className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
            >
                <Feather name="arrow-left" size={20} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-medium text-base">{t('profileDetail.title')}</Text>

            <TouchableOpacity
                onPress={handleSave}
                disabled={!hasChanges}
                className={`px-4 py-2 rounded-full ${hasChanges ? 'bg-indigo-500' : 'bg-white/5'}`}
            >
                <Text className={`font-medium text-xs ${hasChanges ? 'text-white' : 'text-white/30'}`}>
                    {hasChanges ? t('profileDetail.save') : t('profileDetail.save')}
                </Text>
            </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="pb-32 px-6">

                {/* 1. Profile Card (Avatar + Basic Info) */}
                <View className="flex-row items-center bg-white/5 p-4 rounded-3xl border border-white/5 mb-8">
                    <View className="h-20 w-20 rounded-full bg-indigo-500 items-center justify-center mr-4">
                        <Text className="text-white text-3xl font-medium">
                            {(form.nickname || 'U')[0]}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <TextInput
                            value={form.nickname}
                            onChangeText={(text) => updateField('nickname', text)}
                            placeholder={t('profileDetail.nicknamePlaceholder')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            className="text-white text-xl font-bold mb-1"
                        />
                        <TextInput
                            value={form.bio}
                            onChangeText={(text) => updateField('bio', text)}
                            placeholder={t('profileDetail.bioPlaceholder')}
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            multiline
                            className="text-white/60 text-sm leading-5"
                        />
                    </View>
                </View>

                {/* 2. Basic Info Grid */}
                <View className="flex-row gap-4 mb-8">
                    <View className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <Text className="text-white/40 text-xs mb-1">{t('profileDetail.birthday')}</Text>
                        <TextInput
                            value={form.birthday}
                            onChangeText={(text) => updateField('birthday', text)}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            className="text-white font-medium"
                        />
                    </View>
                    <View className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <Text className="text-white/40 text-xs mb-1">{t('profileDetail.joinDate')}</Text>
                        <Text className="text-white font-medium">2024</Text>
                    </View>
                </View>

                {/* 3. Personality Pulse */}
                <View className="mb-8">
                    <SectionTitle title={t('profileDetail.personalityType')} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                        <View className="flex-row gap-3">
                            {["INFP", "ENFP", "INFJ", "INTJ", "ENTP", "ISFJ", "Optimistic", "Calm", "Sensitive"].map((p) => {
                                const isSelected = form.personality === p;
                                const label = t(`profileDetail.personality.${p}`, { defaultValue: p });
                                return (
                                    <TouchableOpacity
                                        key={p}
                                        onPress={() => updateField('personality', p)}
                                        className={`h-24 w-24 rounded-2xl items-center justify-center border ${isSelected ? 'bg-purple-500 border-purple-400' : 'bg-white/5 border-white/10'}`}
                                    >
                                        <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                            {p.length <= 4 ? p : p.slice(0, 2)}
                                        </Text>
                                        <Text className={`text-[10px] mt-1 ${isSelected ? 'text-white/80' : 'text-white/40'}`}>
                                            {label}
                                        </Text>
                                        {isSelected && (
                                            <View className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>

                {/* 4. Focus Areas */}
                <View className="mb-8">
                    <SectionTitle title={t('profileDetail.currentGoals')} />
                    <ChipGroup
                        field="goals"
                        options={["sleep", "focus", "social", "emotion", "confidence", "energy"]}
                        translationPrefix="profileDetail.goals"
                        colorClass="cyan"
                    />
                </View>

                {/* 5. Topics */}
                <View className="mb-8">
                    <SectionTitle title={t('profileDetail.interestsTopics')} />
                    <ChipGroup
                        field="interests"
                        options={["anxiety", "stress", "relationship", "mood", "career", "intimate", "growth", "free"]}
                        translationPrefix="profileDetail.interests"
                        colorClass="indigo"
                    />
                </View>

                {/* 6. Emotion History (Compact) */}
                {emotionStats && (
                    <View className="mb-8">
                        <SectionTitle title={t('profileDetail.emotionHistory')} />
                        <View className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <View className="flex-row flex-wrap gap-2">
                                {Object.entries(emotionStats.emotionCounts || {}).map(([emotion, count]) => (
                                    <View
                                        key={emotion}
                                        className="px-3 py-1.5 rounded-lg bg-white/5 flex-row items-center"
                                    >
                                        <MaterialCommunityIcons
                                            name={(EMOTION_ICONS[emotion] || 'emoticon-neutral') as any}
                                            size={14}
                                            color={EMOTION_COLORS[emotion] || '#9ca3af'}
                                            style={{ marginRight: 6 }}
                                        />
                                        <Text className="text-white/60 text-xs font-medium capitalize">
                                            {emotion} <Text className="text-white/40">×{count}</Text>
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

            </KeyboardAvoidingView>
        </ScrollView>
    </ScreenContainer>
);
}

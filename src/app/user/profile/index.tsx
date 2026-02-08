import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';

import ScreenContainer from '@/shared/components/ScreenContainer';
import { useQueryData } from '@/shared/hooks/useQueryData';
import { getUserProfile, updateUserProfile, listMemories, getEmotionStats } from '@/api/voiceagent';
import { Memory, UserProfile, EmotionStats } from '@/types';
import useTailwindVars from '@/hooks/useTailwindVars';

// 情绪颜色映射
const EMOTION_COLORS: Record<string, string> = {
    happy: '#10b981',
    excited: '#f59e0b',
    calm: '#06b6d4',
    neutral: '#6b7280',
    sad: '#3b82f6',
    anxious: '#8b5cf6',
    angry: '#ef4444',
};

// 情绪图标映射
const EMOTION_ICONS: Record<string, string> = {
    happy: 'emoticon-happy',
    excited: 'emoticon-excited',
    calm: 'emoticon-neutral',
    neutral: 'emoticon-neutral-outline',
    sad: 'emoticon-sad',
    anxious: 'emoticon-confused',
    angry: 'emoticon-angry',
};

export default function ProfilePage() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const { colors } = useTailwindVars();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

    // 获取用户档案
    const { data: profileData, isLoading: profileLoading } = useQueryData({
        queryKey: ['userProfile'],
        queryFn: () => getUserProfile(),
    });
    const profile = (profileData as any)?.data;

    // 获取记忆列表
    const { data: memoriesData } = useQueryData({
        queryKey: ['memories'],
        queryFn: () => listMemories({ size: 10 }),
    });
    const memories = ((memoriesData as any)?.data?.list || []) as Memory[];

    // 获取情绪统计
    const { data: emotionStatsData } = useQueryData({
        queryKey: ['emotionStats'],
        queryFn: () => getEmotionStats({ days: 30 }),
    });
    const emotionStats = (emotionStatsData as any)?.data as EmotionStats | undefined;

    const handleEditStart = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setEditForm({
            nickname: profile?.nickname || '',
            birthday: profile?.birthday || '',
            bio: profile?.bio || '',
            interests: profile?.interests || [],
            goals: profile?.goals || [],
        });
        setIsEditing(true);
    }, [profile]);

    const handleSave = useCallback(async () => {
        try {
            await updateUserProfile(editForm);
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsEditing(false);
        } catch (error) {
            Alert.alert('保存失败', '请稍后重试');
        }
    }, [editForm, queryClient]);

    return (
        <ScreenContainer edges={['top']} style={{ backgroundColor: 'transparent' }}>
            {/* 背景 */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#020210' }} />
            <LinearGradient
                colors={['#1e1b4b', '#2e1065', '#020617']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.8 }}
            />

            {/* 头部 */}
            <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-light tracking-wider">我的档案</Text>
                <TouchableOpacity
                    onPress={isEditing ? handleSave : handleEditStart}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <Feather name={isEditing ? "check" : "edit-2"} size={18} color={isEditing ? "#10b981" : "white"} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* 基本信息卡片 */}
                <BlurView intensity={20} tint="dark" className="rounded-3xl overflow-hidden mb-6">
                    <View className="p-6">
                        <View className="flex-row items-center mb-4">
                            <View className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 items-center justify-center">
                                <Text className="text-white text-2xl font-bold">
                                    {(profile?.nickname || '用户')[0]}
                                </Text>
                            </View>
                            <View className="ml-4 flex-1">
                                {isEditing ? (
                                    <TextInput
                                        value={editForm.nickname}
                                        onChangeText={(text) => setEditForm(prev => ({ ...prev, nickname: text }))}
                                        placeholder="昵称"
                                        placeholderTextColor="#666"
                                        className="text-white text-xl font-medium bg-white/10 rounded-lg px-3 py-2"
                                    />
                                ) : (
                                    <Text className="text-white text-xl font-medium">
                                        {profile?.nickname || '设置昵称'}
                                    </Text>
                                )}
                                <Text className="text-white/40 text-sm mt-1">
                                    {profile?.birthday ? `🎂 ${profile.birthday}` : '设置生日'}
                                </Text>
                            </View>
                        </View>

                        {isEditing ? (
                            <TextInput
                                value={editForm.bio}
                                onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
                                placeholder="写点什么介绍自己..."
                                placeholderTextColor="#666"
                                multiline
                                className="text-white/60 bg-white/10 rounded-lg px-3 py-2 min-h-[80px]"
                            />
                        ) : (
                            <Text className="text-white/60 text-sm">
                                {profile?.bio || '点击编辑添加个人简介...'}
                            </Text>
                        )}
                    </View>

                </BlurView>

                {/* 兴趣标签编辑/展示 */}
                <BlurView intensity={20} tint="dark" className="rounded-3xl overflow-hidden mb-6">
                    <View className="p-6">
                        <Text className="text-white font-medium mb-4">我的兴趣 / 关注话题</Text>

                        {isEditing ? (
                            <View className="flex-row flex-wrap gap-2">
                                {/* 这里使用预定义的 TOPICS 列表，需要引入或定义 */}
                                {["anxiety", "stress", "relationship", "mood", "career", "intimate", "growth", "free"].map((topicId) => {
                                    // 简单的 ID 到 Label 映射，实际应该用 i18n 或常量
                                    const labels: Record<string, string> = {
                                        anxiety: '焦虑缓解', stress: '压力管理', relationship: '人际关系',
                                        mood: '情绪低落', career: '职场困扰', intimate: '亲密关系',
                                        growth: '自我成长', free: '自由聊聊'
                                    };
                                    const isSelected = editForm.interests?.includes(topicId);

                                    return (
                                        <TouchableOpacity
                                            key={topicId}
                                            onPress={() => {
                                                setEditForm(prev => {
                                                    const current = prev.interests || [];
                                                    if (current.includes(topicId)) {
                                                        return { ...prev, interests: current.filter(id => id !== topicId) };
                                                    }
                                                    return { ...prev, interests: [...current, topicId] };
                                                });
                                            }}
                                            className={`px-3 py-1.5 rounded-full border ${isSelected ? 'bg-indigo-500/20 border-indigo-500' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <Text className={`${isSelected ? 'text-white' : 'text-white/60'} text-xs`}>
                                                {labels[topicId] || topicId}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : (
                            <View className="flex-row flex-wrap gap-2">
                                {(!profile?.interests || profile.interests.length === 0) ? (
                                    <Text className="text-white/40 text-sm">暂未选择兴趣标签</Text>
                                ) : (
                                    profile.interests.map((tag) => {
                                        const labels: Record<string, string> = {
                                            anxiety: '焦虑缓解', stress: '压力管理', relationship: '人际关系',
                                            mood: '情绪低落', career: '职场困扰', intimate: '亲密关系',
                                            growth: '自我成长', free: '自由聊聊'
                                        };
                                        return (
                                            <View key={tag} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                                                <Text className="text-white/80 text-xs">{labels[tag] || tag}</Text>
                                            </View>
                                        );
                                    })
                                )}
                            </View>
                        )}
                    </View>
                </BlurView>

                {/* 情绪曲线卡片 */}
                {emotionStats && (
                    <BlurView intensity={20} tint="dark" className="rounded-3xl overflow-hidden mb-6">
                        <View className="p-6">
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="text-white font-medium">情绪记录</Text>
                                <Text className="text-white/40 text-xs">{emotionStats.dateRange}</Text>
                            </View>

                            {/* 主要情绪 */}
                            <View className="flex-row items-center mb-4">
                                <View
                                    className="h-12 w-12 rounded-full items-center justify-center"
                                    style={{ backgroundColor: (EMOTION_COLORS[emotionStats.dominantEmotion] || '#6b7280') + '30' }}
                                >
                                    <MaterialCommunityIcons
                                        name={(EMOTION_ICONS[emotionStats.dominantEmotion] || 'emoticon-neutral') as any}
                                        size={28}
                                        color={EMOTION_COLORS[emotionStats.dominantEmotion] || '#6b7280'}
                                    />
                                </View>
                                <View className="ml-3">
                                    <Text className="text-white/60 text-xs">近期主要情绪</Text>
                                    <Text className="text-white text-lg capitalize">{emotionStats.dominantEmotion || '暂无数据'}</Text>
                                </View>
                            </View>

                            {/* 情绪分布 */}
                            <View className="flex-row flex-wrap gap-2">
                                {Object.entries(emotionStats.emotionCounts || {}).map(([emotion, count]) => (
                                    <View
                                        key={emotion}
                                        className="px-3 py-1 rounded-full"
                                        style={{ backgroundColor: (EMOTION_COLORS[emotion] || '#6b7280') + '20' }}
                                    >
                                        <Text style={{ color: EMOTION_COLORS[emotion] || '#6b7280' }} className="text-xs">
                                            {emotion} × {count}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </BlurView>
                )}

                {/* 记忆列表 */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-white font-medium">AI 记住的事</Text>
                        <TouchableOpacity onPress={() => router.push('/user/memories')}>
                            <Text className="text-cyan-400 text-sm">查看全部</Text>
                        </TouchableOpacity>
                    </View>

                    {memories.length === 0 ? (
                        <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden p-6">
                            <Text className="text-white/40 text-center">
                                与 AI 多聊聊，ta 会记住你的故事 ✨
                            </Text>
                        </BlurView>
                    ) : (
                        memories.slice(0, 5).map((memory) => (
                            <BlurView
                                key={memory._id}
                                intensity={15}
                                tint="dark"
                                className="rounded-2xl overflow-hidden p-4 mb-3"
                            >
                                <View className="flex-row items-start">
                                    <View className="h-8 w-8 rounded-full bg-purple-500/20 items-center justify-center">
                                        <MaterialCommunityIcons
                                            name={
                                                memory.type === 'preference' ? 'heart' :
                                                    memory.type === 'experience' ? 'clock-time-four' :
                                                        memory.type === 'relationship' ? 'account-group' :
                                                            'lightbulb'
                                            }
                                            size={16}
                                            color="#a855f7"
                                        />
                                    </View>
                                    <View className="flex-1 ml-3">
                                        <Text className="text-white/80 text-sm leading-5">
                                            {memory.content}
                                        </Text>
                                        {memory.tags?.length > 0 && (
                                            <View className="flex-row flex-wrap gap-1 mt-2">
                                                {memory.tags.map((tag, i) => (
                                                    <Text key={i} className="text-white/30 text-xs">#{tag}</Text>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </BlurView>
                        ))
                    )}
                </View>

                {/* 事件入口 */}
                <TouchableOpacity
                    onPress={() => router.push('/user/events')}
                    activeOpacity={0.8}
                >
                    <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden mb-8">
                        <LinearGradient
                            colors={['#06b6d420', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="absolute top-0 left-0 right-0 bottom-0"
                        />
                        <View className="p-5 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <MaterialCommunityIcons name="calendar-heart" size={24} color="#06b6d4" />
                                <Text className="text-white ml-3">重要日子</Text>
                            </View>
                            <Feather name="chevron-right" size={20} color="#06b6d4" />
                        </View>
                    </BlurView>
                </TouchableOpacity>

                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}

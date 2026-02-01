import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';

import ScreenContainer from '@/shared/components/ScreenContainer';
import { useQueryData } from '@/shared/hooks/useQueryData';
import { listMemories, deleteMemory } from '@/api/voiceagent';
import { Memory } from '@/types';

// 记忆类型配置
const MEMORY_TYPES = {
    fact: { label: '事实', icon: 'lightbulb', color: '#f59e0b' },
    preference: { label: '偏好', icon: 'heart', color: '#ec4899' },
    experience: { label: '经历', icon: 'clock-time-four', color: '#8b5cf6' },
    relationship: { label: '关系', icon: 'account-group', color: '#06b6d4' },
};

export default function MemoriesPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // 获取记忆列表
    const { data: memoriesData, refetch } = useQueryData({
        queryKey: ['memoriesAll'],
        queryFn: () => listMemories({ size: 100 }),
    });
    const memories = ((memoriesData as any)?.data?.list || []) as Memory[];

    const handleDelete = (memory: Memory) => {
        Alert.alert(
            '删除记忆',
            '确定要让 AI 忘记这条信息吗？',
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '删除',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteMemory(memory._id);
                            queryClient.invalidateQueries({ queryKey: ['memoriesAll'] });
                            queryClient.invalidateQueries({ queryKey: ['memories'] });
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        } catch (error) {
                            Alert.alert('删除失败', '请稍后重试');
                        }
                    },
                },
            ]
        );
    };

    const getTypeConfig = (type: string) => {
        return MEMORY_TYPES[type as keyof typeof MEMORY_TYPES] || MEMORY_TYPES.fact;
    };

    // 按类型分组
    const groupedMemories = memories.reduce((acc, memory) => {
        const type = memory.type || 'fact';
        if (!acc[type]) acc[type] = [];
        acc[type].push(memory);
        return acc;
    }, {} as Record<string, Memory[]>);

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
                <Text className="text-white text-lg font-light tracking-wider">AI 的记忆</Text>
                <View className="h-10 w-10" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* 统计 */}
                <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden mb-6">
                    <View className="p-5 flex-row justify-around">
                        <View className="items-center">
                            <Text className="text-white text-2xl font-medium">{memories.length}</Text>
                            <Text className="text-white/40 text-xs mt-1">总记忆</Text>
                        </View>
                        {Object.entries(groupedMemories).slice(0, 3).map(([type, items]) => {
                            const config = getTypeConfig(type);
                            return (
                                <View key={type} className="items-center">
                                    <Text className="text-2xl font-medium" style={{ color: config.color }}>
                                        {items.length}
                                    </Text>
                                    <Text className="text-white/40 text-xs mt-1">{config.label}</Text>
                                </View>
                            );
                        })}
                    </View>
                </BlurView>

                {/* 记忆列表 */}
                {memories.length === 0 ? (
                    <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden p-8">
                        <View className="items-center">
                            <MaterialCommunityIcons name="brain" size={48} color="#6b7280" />
                            <Text className="text-white/40 mt-4 text-center">
                                AI 还没有记住任何信息{'\n'}多聊聊天，ta 会记住你的故事
                            </Text>
                        </View>
                    </BlurView>
                ) : (
                    Object.entries(groupedMemories).map(([type, items]) => {
                        const config = getTypeConfig(type);
                        return (
                            <View key={type} className="mb-6">
                                <View className="flex-row items-center mb-3">
                                    <MaterialCommunityIcons
                                        name={config.icon as any}
                                        size={18}
                                        color={config.color}
                                    />
                                    <Text className="text-white/60 text-sm ml-2">{config.label}</Text>
                                </View>
                                {items.map((memory) => (
                                    <TouchableOpacity
                                        key={memory._id}
                                        onLongPress={() => handleDelete(memory)}
                                        activeOpacity={0.8}
                                    >
                                        <BlurView intensity={15} tint="dark" className="rounded-2xl overflow-hidden mb-3">
                                            <View className="p-4">
                                                <Text className="text-white/80 text-sm leading-5">
                                                    {memory.content}
                                                </Text>
                                                <View className="flex-row items-center justify-between mt-3">
                                                    <View className="flex-row flex-wrap gap-1">
                                                        {memory.tags?.slice(0, 3).map((tag, i) => (
                                                            <Text key={i} className="text-white/30 text-xs">#{tag}</Text>
                                                        ))}
                                                    </View>
                                                    <View className="flex-row items-center">
                                                        {Array.from({ length: Math.min(memory.importance || 5, 5) }).map((_, i) => (
                                                            <View
                                                                key={i}
                                                                className="h-1.5 w-1.5 rounded-full mx-0.5"
                                                                style={{ backgroundColor: config.color + (i < (memory.importance || 5) ? 'ff' : '40') }}
                                                            />
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                        </BlurView>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        );
                    })
                )}

                <View className="items-center py-8">
                    <Text className="text-white/20 text-xs">长按可删除记忆</Text>
                </View>

                <View className="h-10" />
            </ScrollView>
        </ScreenContainer>
    );
}

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

import ScreenContainer from '@/shared/components/ScreenContainer';
import { useQueryData } from '@/shared/hooks/useQueryData';
import { getGrowthReport, GrowthReport } from '@/api/voiceagent';

// 情绪配置
const EMOTION_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
    happy: { label: '开心', color: '#10b981', icon: 'emoticon-happy' },
    sad: { label: '难过', color: '#6366f1', icon: 'emoticon-sad' },
    anxious: { label: '焦虑', color: '#f59e0b', icon: 'emoticon-confused' },
    calm: { label: '平静', color: '#06b6d4', icon: 'emoticon-neutral' },
    angry: { label: '生气', color: '#ef4444', icon: 'emoticon-angry' },
    excited: { label: '兴奋', color: '#ec4899', icon: 'emoticon-excited' },
    neutral: { label: '平常', color: '#6b7280', icon: 'emoticon-neutral-outline' },
};

const PERIODS = [
    { value: 'week', label: '最近一周' },
    { value: 'month', label: '最近一月' },
    { value: 'year', label: '最近一年' },
];

export default function GrowthReportPage() {
    const router = useRouter();
    const [period, setPeriod] = useState('week');
    const [refreshing, setRefreshing] = useState(false);

    const { data: reportData, refetch, isLoading } = useQueryData({
        queryKey: ['growthReport', period],
        queryFn: () => getGrowthReport({ period }),
    });
    const report = (reportData as any)?.data as GrowthReport | undefined;

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}小时${mins}分钟`;
        }
        return `${mins}分钟`;
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    };

    const getEmotionConfig = (emotion: string) => {
        return EMOTION_CONFIG[emotion] || EMOTION_CONFIG.neutral;
    };

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
                <Text className="text-white text-lg font-light tracking-wider">成长报告</Text>
                <View className="h-10 w-10" />
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
            >
                {/* 时间段选择 */}
                <View className="flex-row gap-2 mb-6">
                    {PERIODS.map((p) => (
                        <TouchableOpacity
                            key={p.value}
                            onPress={() => setPeriod(p.value)}
                            className={`flex-1 py-2.5 rounded-xl items-center ${period === p.value ? 'bg-violet-500/30 border border-violet-500/50' : 'bg-white/5'
                                }`}
                        >
                            <Text className={`text-sm ${period === p.value ? 'text-violet-400' : 'text-white/50'}`}>
                                {p.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 日期范围 */}
                {report && (
                    <View className="items-center mb-6">
                        <Text className="text-white/40 text-xs tracking-wider">
                            {formatDate(report.startDate)} - {formatDate(report.endDate)}
                        </Text>
                    </View>
                )}

                {/* 数据统计卡片 */}
                <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden mb-6">
                    <View className="p-5">
                        <Text className="text-white/60 text-sm mb-4 tracking-wider">数据概览</Text>
                        <View className="flex-row justify-around">
                            <View className="items-center">
                                <View className="h-12 w-12 rounded-2xl bg-cyan-500/20 items-center justify-center mb-2">
                                    <Ionicons name="chatbubbles-outline" size={24} color="#06b6d4" />
                                </View>
                                <Text className="text-white text-xl font-semibold">
                                    {report?.conversationCount || 0}
                                </Text>
                                <Text className="text-white/40 text-xs mt-1">对话次数</Text>
                            </View>
                            <View className="items-center">
                                <View className="h-12 w-12 rounded-2xl bg-violet-500/20 items-center justify-center mb-2">
                                    <Ionicons name="time-outline" size={24} color="#8b5cf6" />
                                </View>
                                <Text className="text-white text-xl font-semibold">
                                    {report?.totalDuration ? formatDuration(report.totalDuration) : '0分钟'}
                                </Text>
                                <Text className="text-white/40 text-xs mt-1">对话时长</Text>
                            </View>
                            <View className="items-center">
                                <View className="h-12 w-12 rounded-2xl bg-pink-500/20 items-center justify-center mb-2">
                                    <MaterialCommunityIcons name="brain" size={24} color="#ec4899" />
                                </View>
                                <Text className="text-white text-xl font-semibold">
                                    {report?.newMemories?.length || 0}
                                </Text>
                                <Text className="text-white/40 text-xs mt-1">新记忆</Text>
                            </View>
                        </View>
                    </View>
                </BlurView>

                {/* 情绪概览 */}
                {report?.emotionSummary?.dominantEmotion && (
                    <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden mb-6">
                        <View className="p-5">
                            <Text className="text-white/60 text-sm mb-4 tracking-wider">情绪概览</Text>
                            <View className="flex-row items-center">
                                <View
                                    className="h-14 w-14 rounded-2xl items-center justify-center"
                                    style={{ backgroundColor: getEmotionConfig(report.emotionSummary.dominantEmotion).color + '30' }}
                                >
                                    <MaterialCommunityIcons
                                        name={getEmotionConfig(report.emotionSummary.dominantEmotion).icon as any}
                                        size={32}
                                        color={getEmotionConfig(report.emotionSummary.dominantEmotion).color}
                                    />
                                </View>
                                <View className="ml-4 flex-1">
                                    <Text className="text-white text-lg font-medium">
                                        {getEmotionConfig(report.emotionSummary.dominantEmotion).label}
                                    </Text>
                                    <Text className="text-white/40 text-sm">
                                        主导情绪 · 平均强度 {report.emotionSummary.averageIntensity?.toFixed(1) || '-'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </BlurView>
                )}

                {/* 成长亮点 */}
                {report?.highlights && report.highlights.length > 0 && (
                    <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden mb-6">
                        <LinearGradient
                            colors={['#10b98120', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="absolute top-0 left-0 right-0 bottom-0"
                        />
                        <View className="p-5">
                            <View className="flex-row items-center mb-4">
                                <MaterialCommunityIcons name="star-shooting" size={20} color="#10b981" />
                                <Text className="text-white/60 text-sm ml-2 tracking-wider">成长亮点</Text>
                            </View>
                            {report.highlights.map((highlight, index) => (
                                <View key={index} className="flex-row items-start mb-3 last:mb-0">
                                    <View className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 mr-3" />
                                    <Text className="text-white/80 flex-1 leading-5">{highlight}</Text>
                                </View>
                            ))}
                        </View>
                    </BlurView>
                )}

                {/* AI 建议 */}
                {report?.suggestions && report.suggestions.length > 0 && (
                    <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden mb-6">
                        <LinearGradient
                            colors={['#6366f120', 'transparent']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="absolute top-0 left-0 right-0 bottom-0"
                        />
                        <View className="p-5">
                            <View className="flex-row items-center mb-4">
                                <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#6366f1" />
                                <Text className="text-white/60 text-sm ml-2 tracking-wider">温馨建议</Text>
                            </View>
                            {report.suggestions.map((suggestion, index) => (
                                <View key={index} className="flex-row items-start mb-3 last:mb-0">
                                    <View className="h-2 w-2 rounded-full bg-indigo-400 mt-1.5 mr-3" />
                                    <Text className="text-white/80 flex-1 leading-5">{suggestion}</Text>
                                </View>
                            ))}
                        </View>
                    </BlurView>
                )}

                {/* 新增记忆 */}
                {report?.newMemories && report.newMemories.length > 0 && (
                    <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden mb-6">
                        <View className="p-5">
                            <View className="flex-row items-center mb-4">
                                <MaterialCommunityIcons name="heart-outline" size={20} color="#ec4899" />
                                <Text className="text-white/60 text-sm ml-2 tracking-wider">新增记忆</Text>
                            </View>
                            {report.newMemories.slice(0, 5).map((memory: any, index: number) => (
                                <View key={index} className="mb-3 last:mb-0">
                                    <Text className="text-white/70 text-sm leading-5">{memory.content}</Text>
                                    {memory.tags?.length > 0 && (
                                        <View className="flex-row flex-wrap gap-1 mt-1">
                                            {memory.tags.slice(0, 3).map((tag: string, i: number) => (
                                                <Text key={i} className="text-white/30 text-xs">#{tag}</Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </BlurView>
                )}

                {/* 即将到来的事件 */}
                {report?.upcomingEvents && report.upcomingEvents.length > 0 && (
                    <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden mb-6">
                        <View className="p-5">
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="calendar-outline" size={20} color="#f59e0b" />
                                <Text className="text-white/60 text-sm ml-2 tracking-wider">即将到来</Text>
                            </View>
                            {report.upcomingEvents.slice(0, 3).map((event: any, index: number) => (
                                <View key={index} className="flex-row items-center mb-3 last:mb-0">
                                    <View className="h-2 w-2 rounded-full bg-amber-400 mr-3" />
                                    <Text className="text-white/80 flex-1">{event.title}</Text>
                                    <Text className="text-white/40 text-xs">{event.date}</Text>
                                </View>
                            ))}
                        </View>
                    </BlurView>
                )}

                {/* 空状态 */}
                {!isLoading && (!report || (report.conversationCount === 0 && report.newMemories?.length === 0)) && (
                    <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden p-8">
                        <View className="items-center">
                            <MaterialCommunityIcons name="chart-arc" size={48} color="#6b7280" />
                            <Text className="text-white/40 mt-4 text-center">
                                还没有足够的数据生成报告{'\n'}多和 AI 聊聊天吧
                            </Text>
                        </View>
                    </BlurView>
                )}

                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}

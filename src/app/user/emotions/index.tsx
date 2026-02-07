import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";

import ScreenContainer from '@/shared/components/ScreenContainer';
import { useQueryData } from '@/shared/hooks/useQueryData';
import { getEmotionStats, listEmotionLogs } from '@/api/voiceagent';
import { EmotionStats, EmotionLog } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

export default function EmotionsPage() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const [days, setDays] = useState(30);

    // 获取情绪统计
    const { data: statsData } = useQueryData({
        queryKey: ['emotionStats', days],
        queryFn: () => getEmotionStats({ days }),
    });
    const stats = (statsData as any)?.data as EmotionStats | undefined;

    // 获取情绪日志
    const { data: logsData } = useQueryData({
        queryKey: ['emotionLogs'],
        queryFn: () => listEmotionLogs({ size: 50 }),
    });
    const logs = ((logsData as any)?.data?.list || []) as EmotionLog[];

    const getEmotionConfig = (emotion: string) => {
        return EMOTION_CONFIG[emotion] || EMOTION_CONFIG.neutral;
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    // 简易情绪曲线
    const renderEmotionChart = () => {
        if (!stats?.timeline?.length) return null;

        const timeline = stats.timeline.slice(-14); // 最近14个数据点
        const maxIntensity = 10;
        const chartHeight = 120;
        const chartWidth = SCREEN_WIDTH - 80;
        const pointSpacing = chartWidth / Math.max(timeline.length - 1, 1);

        return (
            <View style={{ height: chartHeight, marginTop: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: chartHeight - 20 }}>
                    {timeline.map((point, index) => {
                        const config = getEmotionConfig(point.emotion);
                        const height = (point.intensity / maxIntensity) * (chartHeight - 40);
                        return (
                            <View
                                key={index}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <View
                                    style={{
                                        width: 8,
                                        height: Math.max(height, 8),
                                        backgroundColor: config.color,
                                        borderRadius: 4,
                                        opacity: 0.8,
                                    }}
                                />
                            </View>
                        );
                    })}
                </View>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    {timeline.filter((_, i) => i % 3 === 0 || i === timeline.length - 1).map((point, index) => (
                        <Text
                            key={index}
                            style={{
                                flex: 1,
                                fontSize: 10,
                                color: 'rgba(255,255,255,0.3)',
                                textAlign: 'center',
                            }}
                        >
                            {point.date.slice(5)}
                        </Text>
                    ))}
                </View>
            </View>
        );
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
                <Text className="text-white text-lg font-light tracking-wider">情绪追踪</Text>
                <View className="h-10 w-10" />
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* 时间段选择 */}
                <View className="flex-row gap-2 mb-6">
                    {[7, 30, 90].map((d) => (
                        <TouchableOpacity
                            key={d}
                            onPress={() => setDays(d)}
                            className={`flex-1 py-2 rounded-xl items-center ${days === d ? 'bg-cyan-500/30 border border-cyan-500/50' : 'bg-white/5'
                                }`}
                        >
                            <Text className={`text-sm ${days === d ? 'text-cyan-400' : 'text-white/50'}`}>
                                {d}天
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 统计卡片 */}
                <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden mb-6">
                    <View className="p-5">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-white/60 text-sm">情绪概览</Text>
                            <Text className="text-white/30 text-xs">{stats?.dateRange || `最近${days}天`}</Text>
                        </View>

                        {stats?.dominantEmotion ? (
                            <View className="flex-row items-center mb-4">
                                <View
                                    className="h-14 w-14 rounded-2xl items-center justify-center"
                                    style={{ backgroundColor: getEmotionConfig(stats.dominantEmotion).color + '30' }}
                                >
                                    <MaterialCommunityIcons
                                        name={getEmotionConfig(stats.dominantEmotion).icon as any}
                                        size={32}
                                        color={getEmotionConfig(stats.dominantEmotion).color}
                                    />
                                </View>
                                <View className="ml-4">
                                    <Text className="text-white text-xl font-medium">
                                        {getEmotionConfig(stats.dominantEmotion).label}
                                    </Text>
                                    <Text className="text-white/40 text-sm">
                                        主导情绪 · 平均强度 {stats.averageIntensity?.toFixed(1) || '-'}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View className="items-center py-4">
                                <MaterialCommunityIcons name="chart-line" size={40} color="#6b7280" />
                                <Text className="text-white/40 mt-2 text-center">
                                    暂无情绪数据{'\n'}多和 AI 聊聊天吧
                                </Text>
                            </View>
                        )}

                        {/* 情绪分布 */}
                        {stats?.emotionCounts && Object.keys(stats.emotionCounts).length > 0 && (
                            <View className="flex-row flex-wrap gap-2 mt-2">
                                {Object.entries(stats.emotionCounts).map(([emotion, count]) => {
                                    const config = getEmotionConfig(emotion);
                                    return (
                                        <View
                                            key={emotion}
                                            className="flex-row items-center px-3 py-1.5 rounded-full"
                                            style={{ backgroundColor: config.color + '20' }}
                                        >
                                            <View
                                                className="h-2 w-2 rounded-full mr-2"
                                                style={{ backgroundColor: config.color }}
                                            />
                                            <Text style={{ color: config.color, fontSize: 12 }}>
                                                {config.label} {count}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* 情绪曲线 */}
                        {renderEmotionChart()}
                    </View>
                </BlurView>

                {/* 情绪日志列表 */}
                <View className="mb-6">
                    <Text className="text-white/60 text-sm mb-3 tracking-wider">情绪记录</Text>
                    {logs.length === 0 ? (
                        <BlurView intensity={15} tint="dark" className="rounded-2xl overflow-hidden p-6">
                            <View className="items-center">
                                <MaterialCommunityIcons name="notebook-outline" size={40} color="#6b7280" />
                                <Text className="text-white/40 mt-3 text-center">
                                    还没有情绪记录
                                </Text>
                            </View>
                        </BlurView>
                    ) : (
                        logs.map((log) => {
                            const config = getEmotionConfig(log.emotion);
                            return (
                                <BlurView
                                    key={log._id}
                                    intensity={15}
                                    tint="dark"
                                    className="rounded-2xl overflow-hidden mb-3"
                                >
                                    <View className="p-4 flex-row items-center">
                                        <View
                                            className="h-11 w-11 rounded-xl items-center justify-center"
                                            style={{ backgroundColor: config.color + '25' }}
                                        >
                                            <MaterialCommunityIcons
                                                name={config.icon as any}
                                                size={24}
                                                color={config.color}
                                            />
                                        </View>
                                        <View className="flex-1 ml-3">
                                            <View className="flex-row items-center justify-between">
                                                <Text className="text-white font-medium">{config.label}</Text>
                                                <Text className="text-white/30 text-xs">
                                                    {formatDate(log.createdAt)}
                                                </Text>
                                            </View>
                                            {log.summary && (
                                                <Text className="text-white/50 text-sm mt-1" numberOfLines={2}>
                                                    {log.summary}
                                                </Text>
                                            )}
                                            {log.triggers?.length > 0 && (
                                                <View className="flex-row flex-wrap gap-1 mt-2">
                                                    {log.triggers.slice(0, 3).map((trigger, i) => (
                                                        <Text key={i} className="text-white/30 text-xs">
                                                            #{trigger}
                                                        </Text>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                        {/* 强度指示 */}
                                        <View className="ml-2 items-center">
                                            <Text style={{ color: config.color, fontSize: 16, fontWeight: '600' }}>
                                                {log.intensity}
                                            </Text>
                                            <Text className="text-white/20 text-[10px]">强度</Text>
                                        </View>
                                    </View>
                                </BlurView>
                            );
                        })
                    )}
                </View>

                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}

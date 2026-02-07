import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenContainer from '@/shared/components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/i18n/translation';
import { listAssessments } from '@/api/voiceagent';
import { Assessment } from '@/types';
import { useInfiniteQueryData } from "@/shared/hooks/useQueryData";
import { useFocusEffect } from "expo-router";

const PAGE_SIZE = 20;

export default function AssessmentHistory() {
    const router = useRouter();
    const { t } = useTranslation();

    const {
        list: assessments,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isFetching
    } = useInfiniteQueryData({
        queryKey: ['assessments'],
        queryFn: ({ pageParam = 1 }) => listAssessments({ page: pageParam, size: PAGE_SIZE }),
        getNextPageParam: (lastPage, allPages) => {
            const serverPayload = lastPage?.data;
            const businessData = (serverPayload && typeof serverPayload === 'object' && 'list' in serverPayload)
                ? serverPayload
                : serverPayload;

            const currentTotal = allPages.length * PAGE_SIZE;
            const totalCount = (businessData as any)?.total || 0;
            return currentTotal < totalCount ? allPages.length + 1 : undefined;
        },
    });

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getLevelColor = (level: string, score: number) => {
        if (score <= 4) return '#4ADE80';
        if (score <= 9) return '#FACC15';
        if (score <= 14) return '#FB923C';
        if (score <= 19) return '#F87171';
        return '#EF4444';
    };

    const renderItem = ({ item }: { item: Assessment }) => {
        const color = getLevelColor(item.level, item.score);
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                className="bg-white/5 rounded-2xl p-4 mb-3 border border-white/10 flex-row justify-between items-center"
            >
                <View>
                    <Text className="text-white/60 text-xs mb-1">
                        {formatDate(item.createdAt)}
                    </Text>
                    <Text className="text-white font-medium text-base">
                        {t(`assessment.levels.${item.level}`) || item.level}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-2xl font-bold" style={{ color }}>
                        {item.score}
                    </Text>
                    <Text className="text-white/40 text-xs">{t('assessment.score')}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
        if (!isFetchingNextPage) return <View className="h-10" />;
        return (
            <View className="py-6 items-center justify-center">
                <ActivityIndicator color="#06b6d4" />
            </View>
        );
    };

    return (
        <ScreenContainer>
            <View className="flex-1">
                {/* Header */}
                <View className="px-6  pb-4 flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-bold">
                        {t('assessment.historyTitle')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                {isLoading && assessments.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator color="#06b6d4" />
                        <Text className="text-white/40 text-[10px] uppercase tracking-[2px] mt-4">{t('common.loading')}</Text>
                    </View>
                ) : assessments.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-12">
                        <View className="h-24 w-24 rounded-[40px] bg-white/5 items-center justify-center mb-8 border border-white/10">
                            <Ionicons name="clipboard-outline" size={32} color="white" opacity={0.2} />
                        </View>
                        <Text className="text-white text-xl font-light tracking-wide text-center">{t('assessment.noRecords')}</Text>
                        <Text className="text-white/40 text-center mt-3 leading-6 text-[13px] font-light">
                            {t('assessment.intro')}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/assessment/phq9')}
                            className="mt-10 bg-white/10 px-10 py-4 rounded-full border border-white/10"
                        >
                            <Text className="text-white font-medium text-sm tracking-widest uppercase">{t('assessment.startAssessment')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={assessments}
                        keyExtractor={item => item._id}
                        renderItem={renderItem}
                        className="flex-1 px-6"
                        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={() => {
                            if (hasNextPage && !isFetchingNextPage) {
                                fetchNextPage();
                            }
                        }}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={renderFooter}
                        onRefresh={refetch}
                        refreshing={isFetching && !isFetchingNextPage}
                    />
                )}
                {/* FAB to Start New Assessment - Only show when list is not empty to avoid clutter on empty state */}
                {assessments.length > 0 && (
                    <TouchableOpacity
                        className="absolute bottom-10 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg shadow-indigo-500/50"
                        onPress={() => router.push('/assessment/phq9')}
                    >
                        <Ionicons name="add" size={30} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </ScreenContainer>
    );
}

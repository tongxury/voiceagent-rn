import React, { useMemo, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Dimensions
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { listConversations, listAgents } from "@/api/voiceagent";
import { Conversation, Agent } from "@/types";
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { useInfiniteQueryData, useQueryData } from "@/shared/hooks/useQueryData";
import { BlurView } from "expo-blur";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { useTranslation } from "@/i18n/translation";
import { useTailwindVars } from "@/hooks/useTailwindVars";

const { width } = Dimensions.get('window');
const PAGE_SIZE = 20;

export default function HistoryListScreen() {
    const { t } = useTranslation();
    const { colors } = useTailwindVars();
    const {
        list: conversations,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isHistoryLoading,
        refetch,
        isFetching
    } = useInfiniteQueryData({
        queryKey: ['conversations'],
        queryFn: ({ pageParam = 1 }) => listConversations({ page: pageParam, size: PAGE_SIZE }),
        getNextPageParam: (lastPage, allPages) => {
            const serverPayload = lastPage?.data;
            const businessData = (serverPayload && typeof serverPayload === 'object' && 'data' in serverPayload)
                ? serverPayload.data
                : serverPayload;

            const currentTotal = allPages.length * PAGE_SIZE;
            const totalCount = (businessData as any)?.total || 0;
            return currentTotal < totalCount ? allPages.length + 1 : undefined;
        },
    });


    const { data: agentsData } = useQueryData({
        queryKey: ['agents'],
        queryFn: () => listAgents(),
    });

    // // 每次进入页面时强制刷新数据
    // useFocusEffect(
    //     useCallback(() => {
    //         refetch();
    //     }, [refetch])
    // );

    const agents = useMemo(() => agentsData?.list || [], [agentsData]);

    const formatRelativeTime = (timestamp?: number) => {
        if (!timestamp) return t('conversation.unknownTime');
        // 兼容秒和毫秒 (JS Date 需要毫秒，Go Unix() 返回秒)
        const isMs = timestamp > 1000000000000;
        const tsInMs = isMs ? timestamp : timestamp * 1000;
        const date = new Date(tsInMs);

        if (isNaN(date.getTime())) return t('conversation.invalidDate');

        const now = Date.now();
        const diff = Math.floor((now - tsInMs) / 1000);

        if (diff < 60) return t('conversation.justNow');
        if (diff < 3600) return t('conversation.minutesAgo', { count: Math.floor(diff / 60) });
        if (diff < 86400) return t('conversation.hoursAgo', { count: Math.floor(diff / 3600) });

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return t('conversation.today');
        if (date.toDateString() === yesterday.toDateString()) return t('conversation.yesterday');

        return t('conversation.dateFormat', { month: date.getMonth() + 1, day: date.getDate() });
    };

    const getDuration = (start?: number, end?: number) => {
        if (!start || !end || start === end) return null;
        const s = start > 1000000000000 ? Math.floor(start / 1000) : start;
        const e = end > 1000000000000 ? Math.floor(end / 1000) : end;

        const duration = e - s;
        if (duration <= 0) return null;

        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        return mins > 0
            ? t('conversation.durationMinSec', { min: mins, sec: secs })
            : t('conversation.durationSec', { sec: secs });
    };

    const renderItem = ({ item }: { item: Conversation }) => {
        // Prioritize nested agent object from backend, fallback to manual lookup
        const agent = item.agent || agents.find((a: Agent) => a._id === item.agentId);
        const duration = getDuration(item.createdAt, item.lastMessageAt);
        const avatarUrl = agent?.persona?.avatar || agent?.avatar;
        const displayName = agent?.persona?.displayName || agent?.name || t('conversation.roleAgent');

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/conversation/${item._id}`);
                }}
                className="mb-4 overflow-hidden rounded-[32px] border border-white/5 bg-white/[0.03]"
            >
                <View className="p-6 flex-row items-center">
                    <View className="h-16 w-16 rounded-2xl bg-white/5 items-center justify-center overflow-hidden border border-white/5 shadow-2xl">
                        {avatarUrl ? (
                            <Image source={{ uri: avatarUrl }} className="h-full w-full" />
                        ) : (
                            <View className="bg-primary/10 h-full w-full items-center justify-center">
                                <Ionicons name="person" size={28} color="#06b6d4" opacity={0.5} />
                            </View>
                        )}
                    </View>

                    <View className="ml-5 flex-1">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-white text-lg font-bold tracking-tight" numberOfLines={1}>
                                {displayName}
                            </Text>
                            <Text className="text-white/20 text-[10px] font-black uppercase tracking-[2px]">
                                {formatRelativeTime(item.createdAt)}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-4">
                            <View className="flex-row items-center opacity-40">
                                <MaterialCommunityIcons name="clock-outline" size={14} color="white" />
                                <Text className="text-white text-[12px] ml-1.5 font-medium">
                                    {item.createdAt ? new Date((item.createdAt > 1000000000000 ? Math.floor(item.createdAt / 1000) : item.createdAt) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                                </Text>
                            </View>

                            {duration && (
                                <View className="flex-row items-center">
                                    <View className="w-1 h-1 rounded-full bg-white/10 mr-4" />
                                    <MaterialCommunityIcons name="timer-outline" size={14} color="#06b6d4" />
                                    <Text className="text-[#06b6d4] text-[12px] ml-1.5 font-bold">
                                        {duration}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View className="ml-2 w-8 h-8 items-center justify-center rounded-full bg-white/5">
                        <Feather name="chevron-right" size={16} color="white" opacity={0.3} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFooter = () => {
        if (!isFetchingNextPage) return <View className="h-10" />;
        return (
            <View className="py-6 items-center justify-center">
                <ActivityIndicator color={colors.primary} />
            </View>
        );
    };

    return (
        <View className="flex-1">
            {/* Fixed Header */}
            <View className="px-8 pt-6 pb-4">
                <Text className="text-white text-[10px] uppercase tracking-[4px] opacity-40 mb-1">
                    Archives
                </Text>
                <Text className="text-white text-3xl font-extralight tracking-widest">
                    {t('conversation.historyTitle')}
                </Text>
            </View>

            {isHistoryLoading && conversations.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="#06b6d4" />
                    <Text className="text-white/40 text-[10px] uppercase tracking-[2px] mt-4">{t('conversation.loadingArchive')}</Text>
                </View>
            ) : conversations.length === 0 ? (
                <View className="flex-1 items-center justify-center px-12">
                    <View className="h-24 w-24 rounded-[40px] bg-white/5 items-center justify-center mb-8 border border-white/10">
                        <Ionicons name="journal-outline" size={32} color="white" opacity={0.2} />
                    </View>
                    <Text className="text-white text-xl font-light tracking-wide text-center">{t('conversation.emptyHistory')}</Text>
                    <Text className="text-white/40 text-center mt-3 leading-6 text-[13px] font-light">
                        {t('conversation.emptyHistoryDesc')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/')}
                        className="mt-10 bg-white/10 px-10 py-4 rounded-full border border-white/10"
                    >
                        <Text className="text-white font-medium text-sm tracking-widest uppercase">{t('conversation.startFirstCall')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    className="flex-1 px-6"
                    contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
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
        </View>
    );
}

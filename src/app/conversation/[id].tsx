import React, { useMemo } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    FlatList
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { listTranscriptEntries, listAgents, getConversation } from "@/api/voiceagent";
import { TranscriptEntry, Agent } from "@/types";
import { useLocalSearchParams, router } from "expo-router";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useInfiniteQueryData, useQueryData } from "@/shared/hooks/useQueryData";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { useTranslation } from "@/i18n/translation";
import { useTailwindVars } from "@/hooks/useTailwindVars";

const PAGE_SIZE = 50;

export default function ConversationDetailScreen() {
    const { t } = useTranslation();
    const { colors } = useTailwindVars();
    const { id } = useLocalSearchParams<{ id: string }>();

    const {
        list: transcripts,
        isLoading: isTranscriptLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQueryData({
        queryKey: ['transcript', id],
        queryFn: ({ pageParam = 1 }) => listTranscriptEntries(id!, { page: pageParam, size: PAGE_SIZE }),
        getNextPageParam: (lastPage, allPages) => {
            const serverPayload = lastPage?.data;
            const businessData = (serverPayload && typeof serverPayload === 'object' && 'data' in serverPayload)
                ? serverPayload.data
                : serverPayload;

            const currentTotal = allPages.length * PAGE_SIZE;
            const totalCount = (businessData as any)?.total || 0;
            return currentTotal < totalCount ? allPages.length + 1 : undefined;
        },
        enabled: !!id
    });

    const { data: agentsData } = useQueryData({
        queryKey: ['agents'],
        queryFn: () => listAgents(),
    });

    const agents = useMemo(() => agentsData?.list || [], [agentsData]);

    const { data: conversationData } = useQueryData({
        queryKey: ['conversation', id],
        queryFn: () => getConversation(id!),
        enabled: !!id
    });

    const agent = useMemo(() => {
        if (conversationData) {
            return conversationData.agent || agents.find((a: Agent) => a._id === conversationData.agentId);
        }
        return null;
    }, [conversationData, agents]);

    return (
        <ScreenContainer edges={['top']}>
            {/* Header */}
            <View className="px-6 py-5 flex-row items-center justify-between border-b border-white/5 bg-black/20">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/5"
                >
                    <Feather name="chevron-left" size={24} color="white" />
                </TouchableOpacity>

                <View className="items-center flex-1 mx-4">
                    <Text className="text-white text-lg font-bold tracking-tight" numberOfLines={1}>
                        {agent?.persona?.displayName || agent?.name || t('conversation.transcriptTitle')}
                    </Text>
                    <Text className="text-white/30 text-[10px] uppercase tracking-[2px] mt-0.5">
                        {t('conversation.transcriptRecord')}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    className="h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/5"
                >
                    <Feather name="share-2" size={20} color="white" opacity={0.4} />
                </TouchableOpacity>
            </View>

            {isTranscriptLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color={colors.primary} size="large" />
                </View>
            ) : (
                <FlatList
                    data={transcripts}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <View key={item._id} className={`mb-10 ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <View className={`flex-row items-center mb-3 ${item.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <View className={`h-1.5 w-1.5 rounded-full ${item.role === 'user' ? 'bg-primary' : 'bg-white/40'} mx-3`} />
                                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px]">
                                    {item.role === 'user' ? t('conversation.roleUser') : agent?.persona?.displayName || agent?.name || t('conversation.roleAgent')}
                                </Text>
                            </View>
                            <View className={`max-w-[85%] p-6 rounded-[32px] ${item.role === 'user'
                                ? 'bg-primary rounded-tr-none shadow-2xl shadow-primary/20'
                                : 'bg-white/5 border border-white/5 rounded-tl-none'
                                }`}>
                                <Text className={`text-[15px] leading-7 font-medium ${item.role === 'user' ? 'text-white' : 'text-white/90'}`}>
                                    {item.message}
                                </Text>
                            </View>
                        </View>
                    )}
                    className="flex-1 px-6 pt-6"
                    contentContainerStyle={{ paddingBottom: 60 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                    onEndReachedThreshold={0.2}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-20">
                            <View className="h-20 w-20 rounded-full bg-muted items-center justify-center mb-4">
                                <Feather name="slash" size={32} color={colors.foreground} opacity={0.1} />
                            </View>
                            <Text className="text-muted-foreground italic font-medium">{t('conversation.noTranscript')}</Text>
                        </View>
                    }
                    ListFooterComponent={
                        isFetchingNextPage ? (
                            <View className="py-4">
                                <ActivityIndicator color={colors.primary} />
                            </View>
                        ) : null
                    }
                />
            )}
        </ScreenContainer>
    );
}

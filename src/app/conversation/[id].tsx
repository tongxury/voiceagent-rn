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
            return agents.find((a: Agent) => a._id === conversationData.agentId);
        }
        return null;
    }, [conversationData, agents]);

    return (
        <ScreenContainer edges={['top']}>
                {/* Header */}
                <View className="px-6 py-5 flex-row items-center justify-between border-b border-border/50">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border/10"
                    >
                        <Feather name="chevron-left" size={24} color={colors.foreground} />
                    </TouchableOpacity>
                    
                    <View className="items-center">
                        <Text className="text-foreground text-lg font-black tracking-tight">{agent?.name || t('conversation.transcriptTitle')}</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            // Optional: Share or Export
                        }}
                        className="h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border/10"
                    >
                        <Feather name="share-2" size={20} color={colors.foreground} opacity={0.6} />
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
                            <View key={item._id} className={`mb-8 ${item.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <Text className={`text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-2 ${item.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                                    {item.role === 'user' ? t('conversation.roleUser') : agent?.name || t('conversation.roleAgent')}
                                </Text>
                                <View className={`max-w-[90%] p-5 rounded-[28px] ${
                                    item.role === 'user' 
                                        ? 'bg-primary rounded-tr-none shadow-xl' 
                                        : 'bg-muted border border-border/10 rounded-tl-none'
                                }`}>
                                    <Text className={item.role === 'user' ? 'text-primary-foreground text-[15px] leading-6 font-medium' : 'text-foreground text-[15px] leading-6 font-medium'}>{item.message}</Text>
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

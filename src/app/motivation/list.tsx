import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useTranslation } from "@/i18n/translation";
import useTailwindVars from "@/hooks/useTailwindVars";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { listMotivationCards, deleteMotivationCard } from "@/api/voiceagent";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import dayjs from 'dayjs';
import { AudioPlayer, stopGlobalAudio } from "@/shared/components/AudioPlayer";
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { MotivationPoster } from './components/MotivationPoster';
import { WaveformVisualizer } from './components/WaveformVisualizer';
import { MotivationCard } from './components/MotivationCard';


type PosterData = {
    [key: string]: any
};

export default function MotivationListPage() {
    const { t } = useTranslation();
    const { colors } = useTailwindVars();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQueryData({
        queryKey: ['motivations'],
        queryFn: () => listMotivationCards({ page: 1, size: 50 }),
    });

    const motivations = data?.list || [];
    const posterRef = useRef<any>(null);
    const [posterData, setPosterData] = useState<PosterData | null>(null);
    const [sharingPosterId, setSharingPosterId] = useState<string | null>(null);

    const emotions = [
        { id: 'encouraging', label: t('agent.emotionEncouraging'), icon: 'fire', colors: ['#9333ea', '#8b5cf6'] },
        { id: 'comfort', label: t('agent.emotionComfort'), icon: 'heart', colors: ['#ec4899', '#f472b6'] },
        { id: 'energetic', label: t('agent.emotionEnergetic'), icon: 'flash', colors: ['#3b82f6', '#0ea5e9'] },
    ];

    const getEmotion = (emotionTag?: string) =>
        emotions.find(e => e.id === emotionTag) || emotions[0];

    const handleDelete = (id: string) => {
        Alert.alert(
            t('agent.deleteConfirmTitle'),
            t('agent.deleteConfirmDesc'),
            [
                { text: t('agent.cancel'), style: 'cancel' },
                {
                    text: t('agent.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {

                            await stopGlobalAudio();
                            await deleteMotivationCard(id);
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            queryClient.invalidateQueries({ queryKey: ['motivations'] });
                        } catch (error) {
                            console.error("Failed to delete motivation:", error);
                        }
                    }
                }
            ]
        );
    };

    const handleShare = async (item: any) => {
        try {
            await Share.share({
                message: `${item.agentName}: ${item.text}\n\n${t('agent.listenLink')}: ${item.shareUrl}`,
                url: item.shareUrl,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSharePoster = async (item: any) => {
        const itemId = item.id || item._id;
        if (!posterRef.current) return;
        setSharingPosterId(itemId);
        setPosterData({
            text: item.text || item.polishedText || "",
            shareUrl: item.shareUrl,
            userName: item.userName,
            userAvatar: item.userAvatar,
            agentName: item.agentName || item.agent?.name,
            agentAvatar: item.agentAvatar || item.agent?.avatar,
            emotionTag: item.emotionTag,
            createdAt: item.createdAt,
            waveform: item.waveform,
            qrCodeUrl: item.qrCodeUrl,
        });

        try {
            await new Promise(resolve => requestAnimationFrame(resolve));
            const uri = await captureRef(posterRef, {
                format: "png",
                quality: 1,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: '分享我的声音印记海报',
                    UTI: 'public.png',
                });
            } else {
                Alert.alert("提示", "分享不可用");
            }
        } catch (error) {
            console.error("Poster Share Error:", error);
            Alert.alert("错误", "生成海报失败，请确保已安装所需组件");
        } finally {
            setSharingPosterId(null);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const emotion = getEmotion(item.emotionTag);
        return (
            <MotivationCard
                item={item}
                emotion={emotion}
                onDelete={handleDelete}
                onSharePoster={handleSharePoster}
                onShare={handleShare}
                sharingPosterId={sharingPosterId}
                t={t}
            />
        );
    };

    return (
        <ScreenContainer>
            <View className="flex-1">
                <View style={{ position: 'absolute', left: -9999, top: -9999 }} pointerEvents="none">
                    <ViewShot ref={posterRef} options={{ format: "png", quality: 1 }}>
                        {posterData && (
                            <MotivationPoster
                                data={posterData}
                            />
                        )}
                    </ViewShot>
                </View>
                <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-12 w-12 bg-muted rounded-2xl items-center justify-center border border-border"
                    >
                        <Ionicons name="chevron-back" size={24} color={colors.foreground} />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-2xl font-bold text-foreground">{t('agent.motivationHistory') || t('agent.history')}</Text>
                        <Text className="text-muted-foreground mt-1">{t('agent.motivationHistorySubtitle') || '回顾你的每一个声音瞬间'}</Text>
                    </View>
                    <View className='h-12 w-12' />
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={motivations}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-20">
                                <MaterialCommunityIcons name="auto-fix" size={64} color={colors.muted} />
                                <Text className="text-muted-foreground mt-4 text-center">
                                    {t('agent.noMotivationHistory') || '暂无声音印记记录'}
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </ScreenContainer>
    );
}

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    ActivityIndicator,
    Share,
    Alert
} from 'react-native';
import { useTranslation } from "@/i18n/translation";
import useTailwindVars from "@/hooks/useTailwindVars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createMotivationCard } from "@/api/voiceagent";
import * as Haptics from "expo-haptics";
import { LinearGradient } from 'expo-linear-gradient';
import { Agent } from '@/types';
import { stopGlobalAudio } from "@/shared/components/AudioPlayer";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { MotivationPoster } from './MotivationPoster';
import { MotivationCard } from './MotivationCard';


interface MotivationTabProps {
    activeAgent: Agent | null;
}

export const MotivationCreator = ({ activeAgent }: MotivationTabProps) => {
    const { t } = useTranslation();
    const { colors } = useTailwindVars();
    const [draft, setDraft] = useState("");
    const [selectedEmotion, setSelectedEmotion] = useState("encouraging");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const posterRef = useRef<any>(null);
    const [isSharingPoster, setIsSharingPoster] = useState(false);
    const [isResultSheetOpen, setIsResultSheetOpen] = useState(false);

    // Auto-open result sheet when result is available
    React.useEffect(() => {
        if (result) {
            setIsResultSheetOpen(true);
        }
    }, [result]);

    const emotions = [
        { id: 'encouraging', label: t('agent.emotionEncouraging'), icon: 'fire', colors: ['#9333ea', '#8b5cf6'] },
        { id: 'comfort', label: t('agent.emotionComfort'), icon: 'heart', colors: ['#ec4899', '#f472b6'] },
        { id: 'energetic', label: t('agent.emotionEnergetic'), icon: 'flash', colors: ['#3b82f6', '#0ea5e9'] },
    ];

    const currentEmotion = emotions.find(e => e.id === selectedEmotion) || emotions[0];

    const suggestions = [
        "今天的我也在努力发光",
        "凡事发生必有利于我",
        "保持热爱，奔赴山海",
        "每一个努力过的日子都值得被纪念",
        "只要在路上，就没有到不了的远方"
    ];

    const handleGenerate = async () => {
        if (!draft || !activeAgent) return;

        setIsGenerating(true);
        await stopGlobalAudio();
        setResult(null);
        setIsResultSheetOpen(false);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        try {
            const response = await createMotivationCard({
                agentId: activeAgent._id,
                originalText: draft,
                emotionTag: selectedEmotion,
                modelId: "eleven_multilingual_v3",
                isPublic: true
            });

            const payload = (response.data as any)?.data || response.data;
            setResult(payload);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error("Failed to generate motivation card:", error);
            Alert.alert(t('agent.error'), t('agent.generationFailed'));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        if (!result) return;
        try {
            await Share.share({
                message: `${t('agent.shareMessagePrefix')} ${activeAgent?.name}: ${result.polishedText}\n\n${t('agent.listenLink')}: ${result.shareUrl}`,
                url: result.shareUrl,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleSharePoster = async () => {
        if (!posterRef.current || !result) return;

        setIsSharingPoster(true);
        try {
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
            setIsSharingPoster(false);
        }
    };

    const handleCloseResultSheet = () => {
        setIsResultSheetOpen(false);
    };

    return (
        <>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60, paddingHorizontal: 20 }}>
                {/* 隐藏的 Poster 用于截图 */}
                <View style={{ position: 'absolute', left: -9999, top: -9999 }} pointerEvents="none">
                    <ViewShot ref={posterRef} options={{ format: "png", quality: 1 }}>
                        {result && (
                            <MotivationPoster
                                data={result}
                            />
                        )}
                    </ViewShot>
                </View>

                {/* 情感选择 */}
                <Text className="text-muted-foreground font-semibold uppercase text-[10px] mb-4 tracking-widest">{t('agent.selectEmotion')}</Text>
                <View className="flex-row space-x-3 mb-8 gap-3">
                    {emotions.map(emotion => (
                        <TouchableOpacity
                            key={emotion.id}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSelectedEmotion(emotion.id);
                            }}
                            className={`flex-1 p-4 rounded-3xl border items-center justify-center ${selectedEmotion === emotion.id ? 'bg-primary border-primary' : 'bg-muted border-border'}`}
                        >
                            <MaterialCommunityIcons
                                name={emotion.icon as any}
                                size={24}
                                color={selectedEmotion === emotion.id ? colors.primaryForeground : colors.foreground}
                            />
                            <Text className={`font-bold mt-2 text-xs ${selectedEmotion === emotion.id ? 'text-primary-foreground' : 'text-foreground'}`}>{emotion.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 输入框 */}
                <Text className="text-muted-foreground font-semibold uppercase text-[10px] mb-4 tracking-widest ml-4">{t('agent.inputMotivation')}</Text>
                <View className="bg-card rounded-[30px] p-5 mb-4 border border-border/40 shadow-inner">
                    <TextInput
                        multiline
                        placeholder={t('agent.motivationPlaceholder')}
                        placeholderTextColor={colors.mutedForeground}
                        className="text-foreground text-md leading-7 min-h-[120px]"
                        style={{ textAlignVertical: 'top' }}
                        value={draft}
                        onChangeText={setDraft}
                    />
                </View>


                {/* 建议快捷词 */}
                <View className="flex-col gap-2 items-start">
                    {suggestions.map((s, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                setDraft(s);
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            className="bg-muted px-4 py-2 rounded-full border border-border/30"
                        >
                            <Text className="text-muted-foreground text-md font-medium">{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>


            </ScrollView>
            {/* 生成按钮 */}
            <TouchableOpacity
                onPress={handleGenerate}
                disabled={isGenerating || !draft}
                activeOpacity={0.8}
                className="overflow-hidden rounded-[40px] mx-5 shadow-2xl shadow-primary/40"
            >
                <LinearGradient
                    colors={currentEmotion.colors as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="min-h-[96px] flex-row items-center justify-center px-8 py-4"
                >
                    {isGenerating ? (
                        <View className="flex-row items-center">
                            <ActivityIndicator color="white" className="mr-3" />
                            <Text className="text-white font-bold text-xl">AI 正在调音润色...</Text>
                        </View>
                    ) : (
                        <View className="flex-row items-center justify-center w-full">
                            <View className="p-3 rounded-full mr-5">
                                <MaterialCommunityIcons name="auto-fix" size={28} color="white" />
                            </View>
                            <Text className="text-white  text-2xl tracking-tight">
                                {t('agent.generateVoiceMark')}
                            </Text>
                        </View>
                    )}
                </LinearGradient>
            </TouchableOpacity>
            <Modal
                visible={isResultSheetOpen && !!result}
                transparent
                animationType="slide"
                onRequestClose={handleCloseResultSheet}
            >
                <View className="flex-1 justify-end">
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={handleCloseResultSheet}
                        className="absolute inset-0 bg-black/50"
                    />
                    {result && (
                        <View className="bg-background rounded-t-[44px] px-5 pt-5 pb-7">
                            <View className="items-center mb-3">
                                <View className="w-12 h-1.5 rounded-full bg-border/60" />
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <MotivationCard
                                    item={result}
                                    emotion={currentEmotion}
                                    onDelete={() => {
                                        handleCloseResultSheet();
                                        setResult(null);
                                    }}
                                    onSharePoster={handleSharePoster}
                                    onShare={handleShare}
                                    sharingPosterId={isSharingPoster ? result.id : null}
                                    t={t}
                                />
                            </ScrollView>
                        </View>
                    )}
                </View>
            </Modal>
        </>
    );
};

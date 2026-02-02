import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Haptics from "expo-haptics";
import dayjs from 'dayjs';
import { stopGlobalAudio } from "@/shared/components/AudioPlayer";
import { WaveformVisualizer } from './WaveformVisualizer';

interface MotivationCardProps {
    item: any;
    emotion: {
        id: string;
        label: string;
        icon: string;
        colors: string[];
    };
    onDelete: (id: string) => void;
    onSharePoster: (item: any) => void;
    onShare: (item: any) => void;
    sharingPosterId: string | null;
    t: (key: string) => string;
}

export const MotivationCard = ({
    item,
    emotion,
    onDelete,
    onSharePoster,
    onShare,
    sharingPosterId,
    t,
}: MotivationCardProps) => {
    const itemId = item.id || item._id;
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleWaveformPress = async () => {
        if (isPlaying || isLoading) {
            await stopGlobalAudio();
            setIsPlaying(false);
            return;
        }

        try {
            setIsLoading(true);
            await stopGlobalAudio();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
            });

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: item.audioUrl },
                { shouldPlay: true }
            );

            setIsLoading(false);
            setIsPlaying(true);

            newSound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsPlaying(false);
                    stopGlobalAudio();
                }
            });
        } catch (error) {
            console.error("Audio playback error:", error);
            setIsPlaying(false);
            setIsLoading(false);
        }
    };

    return (
        <View className="mb-5">
            <LinearGradient
                colors={emotion.colors as any}
                style={{ padding: 15, borderRadius: 20 }}
                className="rounded-[32px] p-6 border border-white/10 shadow-2xl overflow-hidden relative"
            >
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <View className="h-10 w-10 rounded-full bg-white/20 items-center justify-center">
                            <MaterialCommunityIcons name={emotion.icon as any} size={22} color="white" />
                        </View>
                        <View className="ml-3">
                            <Text className="text-white text-xl font-bold">
                                {item.agent?.persona?.displayName || t('agent.defaultAgentName')}
                            </Text>
                            <Text className="text-white/60 text-[10px] mt-1">
                                {dayjs(item.createdAt * 1000).format('YYYY-MM-DD HH:mm')}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => onDelete(itemId)}
                        className="h-9 w-9 rounded-full bg-white/15 items-center justify-center"
                    >
                        <Feather name="trash-2" size={18} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center gap-2 mb-4">
                    <View className="px-3 py-1 rounded-full bg-white/15">
                        <Text className="text-white/80 text-[10px] font-semibold uppercase tracking-widest">{emotion.label}</Text>
                    </View>
                    <View className="px-3 py-1 rounded-full bg-white/15">
                        <Text className="text-white/80 text-[10px] font-semibold uppercase tracking-widest">可分享</Text>
                    </View>
                </View>

                <Text className="text-white text-2xl font-medium leading-9 tracking-tight mb-5" numberOfLines={6}>
                    "{item.text || item.polishedText}"
                </Text>

                <View className="mb-4">
                    <WaveformVisualizer
                        isPlaying={isPlaying}
                        isLoading={isLoading}
                        onPress={handleWaveformPress}
                        waveform={item.waveform}
                        barColor="rgba(255, 255, 255, 0.4)"
                        activeBarColor="rgba(255, 255, 255, 0.95)"
                    />
                </View>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        onPress={() => onSharePoster(item)}
                        disabled={sharingPosterId === itemId}
                        className="flex-1 h-14 bg-white rounded-2xl items-center justify-center flex-row"
                    >
                        {sharingPosterId === itemId ? (
                            <ActivityIndicator color={emotion.colors[0]} />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="image-plus" size={20} color={emotion.colors[0]} />
                                <Text className="font-bold ml-2 text-lg" style={{ color: emotion.colors[0] }}>海报</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => onShare(item)}
                        className="h-14 w-14 bg-white/10 border border-white/20 rounded-2xl items-center justify-center"
                    >
                        <Feather name="share" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

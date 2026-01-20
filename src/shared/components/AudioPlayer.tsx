import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ViewStyle,
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import * as Haptics from "expo-haptics";
import useTailwindVars from "@/hooks/useTailwindVars";
import { useTranslation } from "@/i18n/translation";

// -----------------------------------------------------------------------------
// 全局状态管理 (Singleton)，确保全应用范围内只有一个音频在播放
// -----------------------------------------------------------------------------
let globalSound: Audio.Sound | null = null;
let globalPlayingId: string | null = null;
let globalPlayingIntent: string | null = null;
let listeners: Array<(playingId: string | null, loadingId: string | null) => void> = [];

const notifyListeners = (playingId: string | null, loadingId: string | null) => {
    listeners.forEach(l => l(playingId, loadingId));
};

export const stopGlobalAudio = async () => {
    if (globalSound) {
        try {
            await globalSound.stopAsync();
            await globalSound.unloadAsync();
        } catch (e) {}
        globalSound = null;
    }
    globalPlayingId = null;
    globalPlayingIntent = null;
    notifyListeners(null, null);
};

// -----------------------------------------------------------------------------
// AudioPlayer 组件
// -----------------------------------------------------------------------------

interface AudioPlayerProps {
    url: string;
    id: string;
    playLabel?: string;
    pauseLabel?: string;
    className?: string;
    activeClassName?: string;
    inactiveClassName?: string;
    iconSize?: number;
    showLabel?: boolean;
}

export const AudioPlayer = ({
    url,
    id,
    playLabel,
    pauseLabel,
    className = "",
    activeClassName = "bg-primary",
    inactiveClassName = "bg-muted",
    iconSize = 24,
    showLabel = true,
}: AudioPlayerProps) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const listener = (playingId: string | null, loadingId: string | null) => {
            setIsPlaying(playingId === id);
            setIsLoading(loadingId === id);
        };
        
        listeners.push(listener);
        // 初始化状态
        setIsPlaying(globalPlayingId === id);
        setIsLoading(globalPlayingIntent === id && !globalPlayingId);

        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, [id]);

    const handleToggle = async () => {
        if (isPlaying || isLoading) {
            await stopGlobalAudio();
            return;
        }

        try {
            // 1. 停止之前的
            await stopGlobalAudio();

            // 2. 设置意图
            globalPlayingIntent = id;
            notifyListeners(null, id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            // 3. 配置模式
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
            });

            // 4. 加载
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );

            // 5. 检查意图是否改变
            if (globalPlayingIntent !== id) {
                await newSound.unloadAsync().catch(() => {});
                return;
            }

            globalSound = newSound;
            globalPlayingId = id;
            notifyListeners(id, null);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    if (status.didJustFinish) {
                        if (globalPlayingId === id) {
                            stopGlobalAudio();
                        }
                    }
                } else if (status.error) {
                    stopGlobalAudio();
                }
            });
        } catch (error) {
            console.error("AudioPlayer Error:", error);
            stopGlobalAudio();
        }
    };

    const containerClass = `h-14 rounded-2xl flex-row items-center justify-center space-x-3 ${className} ${isPlaying ? activeClassName : inactiveClassName} ${isLoading ? 'opacity-70' : ''}`;

    return (
        <TouchableOpacity
            onPress={handleToggle}
            disabled={isLoading && globalPlayingIntent !== id}
            className={containerClass}
        >
            {isLoading ? (
                <ActivityIndicator color={isPlaying ? "white" : colors.primary} />
            ) : (
                <>
                    <Ionicons 
                        name={isPlaying ? "pause" : "play"} 
                        size={iconSize} 
                        color={isPlaying ? "white" : colors.foreground} 
                    />
                    {showLabel && (
                        <Text className={`font-bold text-lg ${isPlaying ? 'text-white' : 'text-foreground'}`}>
                            {isPlaying ? (pauseLabel || t('agent.pause')) : (playLabel || t('agent.preview'))}
                        </Text>
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

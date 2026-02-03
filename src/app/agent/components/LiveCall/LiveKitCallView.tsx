import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import {
    LiveKitRoom,
} from '@livekit/react-native';
import { Track } from 'livekit-client';
import { generateLiveKitToken } from '@/api/voiceagent';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface LiveKitCallViewProps {
    agentId: string;
    onClose: () => void;
}

export const LiveKitCallView: React.FC<LiveKitCallViewProps> = ({ agentId, onClose }) => {
    const [token, setToken] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<'loading' | 'connecting' | 'connected' | 'error'>('loading');

    useEffect(() => {
        const init = async () => {
            try {
                // 1. 获取令牌
                // 房间名可以使用 agentId，身份建议使用随机或用户ID
                const res = await generateLiveKitToken(`aura_test_room`);
                // 兼容性处理：检查 res.data.accessToken 或 res.data.data.accessToken
                const payload = (res.data as any)?.accessToken ? res.data : (res.data as any)?.data;

                if (payload?.accessToken && payload?.url) {
                    setToken(payload.accessToken);
                    setUrl(payload.url);
                    setStatus('connecting');
                } else {
                    console.error('[LiveKit] Missing data in response:', res.data);
                    setStatus('error');
                }
            } catch (error) {
                console.error('[LiveKit] Failed to init:', error);
                setStatus('error');
            }
        };

        init();
    }, [agentId]);

    if (status === 'error') {
        return (
            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark">
                <View className="flex-1 items-center justify-center p-6">
                    <Ionicons name="warning-outline" size={64} color="#ef4444" />
                    <Text className="text-white text-xl font-bold mt-4">Connection Failed</Text>
                    <Text className="text-white/60 text-center mt-2">Could not establish LiveKit session.</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        className="mt-8 bg-white/10 px-8 py-3 rounded-full border border-white/20"
                    >
                        <Text className="text-white font-medium">Close</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        );
    }

    if (!token || !url) {
        return (
            <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="dark">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text className="text-white/60 mt-4">Preparing session...</Text>
                </View>
            </BlurView>
        );
    }

    return (
        <View style={StyleSheet.absoluteFill}>
            <LiveKitRoom
                serverUrl={url}
                token={token}
                connect={true}
                audio={true}
                video={false}
                onConnected={() => {
                    console.log('[LiveKit] Connected to room');
                    setStatus('connected');
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                }}
                onDisconnected={() => {
                    console.log('[LiveKit] Disconnected');
                    onClose();
                }}
                onError={(e) => {
                    console.error('[LiveKit] Room Error:', e);
                    setStatus('error');
                }}
            >
                <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark">
                    <View className="flex-1 bg-black/40">
                        {/* Header */}
                        <View className="pt-16 px-6 flex-row justify-between items-center">
                            <TouchableOpacity onPress={onClose} className="w-10 h-10 items-center justify-center rounded-full bg-white/10">
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                            <View className="items-center">
                                <Text className="text-white/40 text-[10px] uppercase tracking-[2px]">LiveKit Agent Session</Text>
                                <Text className="text-white font-bold mt-1">AURA Live</Text>
                            </View>
                            <View className="w-10" />
                        </View>

                        {/* Visualizer / Center Area */}
                        <View className="flex-1 items-center justify-center">
                            <View className="w-48 h-48 rounded-full bg-indigo-500/20 items-center justify-center border border-indigo-500/30">
                                <View className="w-40 h-40 rounded-full bg-indigo-500/40 items-center justify-center">
                                    <Ionicons name="mic" size={60} color="white" />
                                </View>
                            </View>
                            <Text className="text-white/80 mt-8 text-lg font-medium">
                                {status === 'connected' ? 'Listening...' : 'Connecting...'}
                            </Text>
                        </View>

                        {/* Audio Components */}
                        {/* Audio is handled automatically by LiveKitRoom in Native */}

                        {/* Hidden AudioConference to handle agent interaction if needed */}
                        {/* In a real Agent flow, the agent is just another participant publishing audio */}

                        {/* Controls */}
                        <View className="pb-16 px-6 items-center">
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    onClose();
                                }}
                                className="w-20 h-20 rounded-full bg-red-500 items-center justify-center shadow-lg shadow-red-500/40"
                            >
                                <Ionicons name="stop" size={32} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </LiveKitRoom>
        </View>
    );
};

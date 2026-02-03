import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import {
    LiveKitRoom,
    useTracks,
    useParticipantInfo,
    useLocalParticipant,
    useRemoteParticipants,
} from '@livekit/react-native';
import { Track } from 'livekit-client';
import { generateLiveKitToken } from '@/api/voiceagent';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Orb } from './Orb';
import { BarVisualizer } from './BarVisualizer';
import { ShimmeringText } from './ShimmeringText';

interface LiveKitCallViewProps {
    agentId: string;
    agentName?: string;
    onClose: () => void;
}

const LiveKitContent = ({ onClose, localParticipant, agentName }: { onClose: () => void, localParticipant: any, agentName?: string }) => {
    const remoteParticipants = useRemoteParticipants();

    // 假设房间里只有一个 Agent (Remote Participant)
    const agent = remoteParticipants[0];
    const isAgentSpeaking = agent?.isSpeaking ?? false;
    const isUserSpeaking = localParticipant?.isSpeaking ?? false;

    return (
        <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark">
            <View className="flex-1 bg-black/40">
                {/* Header */}
                <View className="pt-16 px-6 flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={onClose}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <ShimmeringText text={agentName || "AURA Live"} active={isAgentSpeaking || isUserSpeaking} />
                        <Text className="text-white/40 text-[10px] uppercase tracking-[2px] mt-1">LiveKit Session</Text>
                    </View>
                    <View className="w-10" />
                </View>

                {/* Visualizer / Center Area - The Orb */}
                <View className="flex-1 items-center justify-center">
                    <Orb
                        isActive={true}
                        isSpeaking={isAgentSpeaking}
                    />

                    <View className="mt-12 h-12">
                        <BarVisualizer isActive={isUserSpeaking || isAgentSpeaking} />
                    </View>

                    <Text className="text-white/80 mt-8 text-lg font-medium tracking-wide">
                        {isAgentSpeaking ? `${agentName || 'AURA'} is speaking...` : (isUserSpeaking ? 'Listening to you...' : 'Ready to listen')}
                    </Text>
                </View>

                {/* Controls */}
                <View className="pb-32 px-8 flex-row justify-center items-center space-x-8" style={{ zIndex: 100 }}>
                    {/* Mic Toggle */}
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled);
                        }}
                        className={`w-14 h-14 rounded-full items-center justify-center border-2 ${localParticipant.isMicrophoneEnabled ? 'border-white/20 bg-white/5' : 'border-red-500 bg-red-500/20'
                            }`}
                    >
                        <Ionicons
                            name={localParticipant.isMicrophoneEnabled ? "mic" : "mic-off"}
                            size={24}
                            color={localParticipant.isMicrophoneEnabled ? "white" : "#ef4444"}
                        />
                    </TouchableOpacity>

                    {/* End Call Button */}
                    <TouchableOpacity
                        onPress={() => {
                            console.log('[LiveKit] Requesting end call...');
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            onClose();
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        className="flex-row items-center bg-red-500 px-8 py-4 rounded-full shadow-xl shadow-red-500/40 active:scale-95"
                    >
                        <Ionicons name="call" size={24} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
                        <Text className="text-white font-bold ml-3 text-lg">结束通话</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BlurView>
    );
};

export const LiveKitCallView: React.FC<LiveKitCallViewProps> = ({ agentId, agentName, onClose }) => {
    const [token, setToken] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<'loading' | 'connecting' | 'connected' | 'error'>('loading');
    const [shouldConnect, setShouldConnect] = useState(true);

    useEffect(() => {
        const init = async () => {
            if (!agentId) return;
            try {
                // Generate a unique room name based on agentId to avoid collisions
                const roomName = `room_${agentId}`;
                const res = await generateLiveKitToken(roomName);
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

        if (shouldConnect) init();
    }, [agentId, shouldConnect]);

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
                connect={shouldConnect}
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
                <LiveKitInside onClose={() => setShouldConnect(false)} agentName={agentName} />
            </LiveKitRoom>
        </View>
    );
};

const LiveKitInside = ({ onClose, agentName }: { onClose: () => void, agentName?: string }) => {
    const { localParticipant } = useLocalParticipant();
    return <LiveKitContent onClose={onClose} localParticipant={localParticipant} agentName={agentName} />;
}

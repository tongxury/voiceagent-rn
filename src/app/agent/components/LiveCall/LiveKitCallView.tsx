import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import {
    LiveKitRoom,
    useTracks,
    useParticipantInfo,
    useLocalParticipant,
    useRemoteParticipants,
} from '@livekit/react-native';
import { Track } from 'livekit-client';
import { createConversation, stopConversation } from '@/api/voiceagent';
import { BlurView } from 'expo-blur';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from '@/i18n/translation';
import { Orb } from './Orb';
import { BarVisualizer } from './BarVisualizer';
import { ShimmeringText } from './ShimmeringText';
import { MessageModal } from '../Messaging/MessageModal';
import { Agent, VoiceScene, Topic } from '@/types';
// import { router } from 'expo-router';
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";

interface LiveKitCallViewProps {
    agentId: string;
    agentName?: string;
    onClose: () => void;
    topic?: Topic;
}

const SessionCenterView = ({
    status,
    agentName,
    onStart,
    isAgentSpeaking,
    isUserSpeaking,
}: {
    status: 'idle' | 'loading' | 'connecting' | 'connected' | 'error';
    agentName?: string;
    onStart: () => void;
    isAgentSpeaking: boolean;
    isUserSpeaking: boolean;
}) => {
    const { t } = useTranslation();

    switch (status) {
        case 'idle':
            return (
                <View className="items-center justify-center">
                    <Orb isActive={false} isSpeaking={false} />
                    <Text className="text-white/40 mt-12 text-sm text-center px-12 italic">
                        {t('agent.selectAssistantDesc')}
                    </Text>
                </View>
            );
        case 'loading':
        case 'connecting':
            return (
                <View className="items-center justify-center">
                    <Orb isActive={true} isSpeaking={false} />
                    <Text className="text-white/40 mt-12 text-sm font-medium tracking-[4px] uppercase italic">
                        {t('agent.connecting')}
                    </Text>
                </View>
            );
        case 'error':
            return (
                <View className="items-center justify-center p-6">
                    <View className="w-20 h-20 rounded-full bg-red-500/20 items-center justify-center mb-6">
                        <Ionicons name="warning-outline" size={48} color="#ef4444" />
                    </View>
                    <Text className="text-white text-xl font-bold">{t('agent.error')}</Text>
                    <Text className="text-white/60 text-center mt-2 mb-8">
                        {t('pleaseCheckNetwork')}
                    </Text>
                    <TouchableOpacity
                        onPress={onStart}
                        className="bg-white/10 px-10 py-4 rounded-full border border-white/20 active:scale-95"
                    >
                        <Text className="text-white font-bold text-lg">{t('retry')}</Text>
                    </TouchableOpacity>
                </View>
            );
        case 'connected':
            return (
                <View className="items-center justify-center">
                    <Orb isActive={true} isSpeaking={isAgentSpeaking} />
                    <View className="mt-12 h-12">
                        <BarVisualizer isActive={isUserSpeaking || isAgentSpeaking} />
                    </View>
                    <Text className="text-white/80 mt-8 text-lg font-medium tracking-wide">
                        {isAgentSpeaking ? (agentName ? `${agentName} ${t('agent.speaking')}` : t('agent.speaking')) : (isUserSpeaking ? t('agent.listening') : t('agent.readyToListen'))}
                    </Text>
                </View>
            );
    }
    return null;
};

export const LiveKitCallView: React.FC<LiveKitCallViewProps & { activeAgent: Agent | null, setActiveAgent: (a: Agent) => void }> = ({ agentId, agentName, onClose, activeAgent, setActiveAgent, topic }) => {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const [token, setToken] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const conversationIdRef = useRef<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'connecting' | 'connected' | 'error'>('idle');
    const { t } = useTranslation();

    // Sync ref with state
    useEffect(() => {
        conversationIdRef.current = conversationId;
    }, [conversationId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (conversationIdRef.current) {
                console.log('[LiveKit] Cleanup: Stopping conversation', conversationIdRef.current);
                stopConversation(conversationIdRef.current).catch(err => {
                    console.error('[LiveKit] Cleanup error:', err);
                });
            }
        };
    }, []);

    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [isUserSpeaking, setIsUserSpeaking] = useState(false);
    const [localParticipant, setLocalParticipant] = useState<any>(null);

    const [showMessages, setShowMessages] = useState(false);
    const [activeScene, setActiveScene] = useState<VoiceScene | null>(null);
    const [textInput, setTextInput] = useState("");

    const isFocused = useIsFocused();

    // Cleanup when blurred (leaving page)
    useEffect(() => {
        if (!isFocused && conversationIdRef.current) {
            console.log('[LiveKit] Blurred: Stopping conversation', conversationIdRef.current);
            handleEndCall();
        }
    }, [isFocused]);

    // Reset state when agentId changes, instead of auto-starting
    useEffect(() => {
        setUrl(null);
        setConversationId(null);
        setStatus('idle');
    }, [agentId]);

    const handleStart = async () => {
        if (!agentId) return;
        setStatus('loading');
        try {
            const res = await createConversation(agentId, topic);

            // Handle potentially nested data structure: { data: Conversation }
            // The API provider returns AxiosResponse, so res.data is the body.
            // If the body is wrapped in { data: ... }, we need to unwrap it.
            const conversationData = (res.data as any).data || res.data;

            const token = conversationData?.token;
            const url = conversationData?.signedUrl;

            if (token && url) {
                setToken(token);
                setUrl(url);
                setConversationId(conversationData?._id || null);
                setStatus('connecting');
            } else {
                console.error('[LiveKit] Missing data:', res.data);
                setStatus('error');
            }
        } catch (error) {
            console.error('[LiveKit] Init error:', error);
            setStatus('error');
        }
    };

    useEffect(() => {
        // Auto-start if topic is present and we are idle
        if (topic && status === 'idle' && agentId) {
            handleStart();
        }
    }, [topic?.id, agentId]);

    const handleEndCall = async () => {
        console.log('[LiveKit] Requesting end call...');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        if (conversationId) {
            try {
                console.log('[LiveKit] Calling stopConversation:', conversationId);
                await stopConversation(conversationId);
            } catch (error) {
                console.error('[LiveKit] Failed to stop conversation:', error);
            }
        }

        handleInternalClose();
    };

    const handleInternalClose = () => {
        setToken(null);
        setUrl(null);
        setConversationId(null);
        conversationIdRef.current = null;
        setStatus('idle');
        setIsAgentSpeaking(false);
        setIsUserSpeaking(false);
        setLocalParticipant(null);
        onClose();
    };

    const onSendMessage = async (text: string) => {
        console.log("Sending text message:", text);
    };

    const renderModals = () => (
        <>
            <MessageModal
                visible={showMessages}
                onClose={() => setShowMessages(false)}
                textInput={textInput}
                setTextInput={setTextInput}
                onSendMessage={onSendMessage}
            />
        </>
    );

    const renderInnerContent = () => {
        if ((status === 'connecting' || status === 'connected') && token && url) {
            return (
                <LiveKitRoom
                    serverUrl={url}
                    token={token}
                    connect={true}
                    audio={true}
                    video={false}
                    onConnected={() => {
                        console.log('[LiveKit] Connected');
                        setStatus('connected');
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }}
                    onDisconnected={() => {
                        console.log('[LiveKit] Disconnected');
                        handleInternalClose();
                    }}
                    onError={(e) => {
                        console.error('[LiveKit] Room error:', e);
                        setStatus('error');
                    }}
                >
                    <LiveKitInsideWrapper
                        onSpeakingUpdate={(agent, user) => {
                            setIsAgentSpeaking(agent);
                            setIsUserSpeaking(user);
                        }}
                        onParticipantUpdate={setLocalParticipant}
                    />
                </LiveKitRoom>
            );
        }
        return null;
    };

    return (
        <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="dark">
            <View className="flex-1">
                {/* Header - Stable Shell */}
                <View className="pt-16 px-6 flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                    >
                        <Feather name="arrow-left" size={20} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <ShimmeringText text={agentName || t('agent.liveAgent')} active={status === 'connected' && (isAgentSpeaking || isUserSpeaking)} />
                        {/* <Text className="text-white/40 text-[10px] uppercase tracking-[2px] mt-1">{t('agent.sessionStatus')}</Text> */}
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            if (activeAgent?._id) {
                                router.push({
                                    pathname: '/agent/settings',
                                    params: { agentId: activeAgent._id }
                                });
                            }
                        }}
                        className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
                    >
                        <Ionicons name="options" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Main Content Area - Always Mounted Visualizer */}
                <View className="flex-1 items-center justify-center">
                    {/* LiveKit Room (Sidecar for voice/hooks, renders null) */}
                    {renderInnerContent()}

                    <SessionCenterView
                        status={status}
                        agentName={agentName}
                        onStart={handleStart}
                        isAgentSpeaking={isAgentSpeaking}
                        isUserSpeaking={isUserSpeaking}
                    />
                </View>

                {/* Footer Controls - Stable Shell */}
                <View className="pb-36 px-4 flex-row justify-center items-center" style={{ zIndex: 100, gap: 24 }}>
                    {status === 'connected' && (
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                localParticipant?.setMicrophoneEnabled(!localParticipant?.isMicrophoneEnabled);
                            }}
                            className={`w-14 h-14 rounded-full items-center justify-center border-2 ${localParticipant?.isMicrophoneEnabled ? 'border-white/20 bg-white/5' : 'border-red-500 bg-red-500/20'}`}
                        >
                            <Ionicons
                                name={localParticipant?.isMicrophoneEnabled ? "mic" : "mic-off"}
                                size={24}
                                color={localParticipant?.isMicrophoneEnabled ? "white" : "#ef4444"}
                            />
                        </TouchableOpacity>
                    )}

                    {status === 'idle' || status === 'error' ? (
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                handleStart();
                            }}
                            className="flex-row items-center bg-primary px-12 py-4 rounded-full shadow-xl shadow-primary/40 active:scale-95"
                        >
                            <Ionicons name="play" size={24} color="white" />
                            <Text className="text-white font-bold ml-3 text-lg">{t('agent.startCall')}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleEndCall}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            className="flex-row items-center bg-red-500 px-6 py-4 rounded-full shadow-xl shadow-red-500/40 active:scale-95"
                        >
                            <Ionicons name="call" size={24} color="white" style={{ transform: [{ rotate: '135deg' }] }} />
                            <Text className="text-white font-bold ml-3 text-lg">{t('agent.endCall')}</Text>
                        </TouchableOpacity>
                    )}

                    {status === 'connected' && (
                        <TouchableOpacity
                            onPress={() => setShowMessages(true)}
                            className="w-14 h-14 rounded-full items-center justify-center border-2 border-white/20 bg-white/5"
                        >
                            <Ionicons name="chatbubble-ellipses" size={24} color="white" />
                        </TouchableOpacity>
                    )}
                </View>

                {renderModals()}
            </View>
        </BlurView>
    );
};

const LiveKitInsideWrapper = ({
    onSpeakingUpdate,
    onParticipantUpdate
}: {
    onSpeakingUpdate: (agent: boolean, user: boolean) => void,
    onParticipantUpdate: (participant: any) => void
}) => {
    const participantObj = useLocalParticipant();
    const localParticipant = participantObj.localParticipant;
    const remoteParticipants = useRemoteParticipants();

    const isAgentSpeaking = remoteParticipants[0]?.isSpeaking ?? false;
    const isUserSpeaking = localParticipant?.isSpeaking ?? false;

    useEffect(() => {
        onSpeakingUpdate(isAgentSpeaking, isUserSpeaking);
    }, [isAgentSpeaking, isUserSpeaking]);

    useEffect(() => {
        onParticipantUpdate(localParticipant);
    }, [localParticipant]);

    return null;
};

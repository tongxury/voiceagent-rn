import { createConversation, listAgents, listScenes, recordTranscriptEntry, updateConversation } from "@/api/voiceagent";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { ConversationStatus, ElevenLabsProvider, useConversation } from "@elevenlabs/react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Text,
    TouchableOpacity,
    View,
    Alert
} from "react-native";
import { Agent, VoiceScene } from "../../types";
import { Orb } from "./components/LiveCall/Orb";
import { ShimmeringText } from "./components/LiveCall/ShimmeringText";
import { MessageModal } from "./components/Messaging/MessageModal";
import { ConfigModal } from "./components/Settings/ConfigModal";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { useTranslation } from "@/i18n/translation";
import useTailwindVars from "@/hooks/useTailwindVars";
import { TopicSelector, ConsultationSummary, CONSULTATION_TOPICS } from "@/components/consultation/TopicSelector";

import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { CartesiaCallView } from "./components/LiveCall/CartesiaCallView";
import { LiveKitCallView } from "./components/LiveCall/LiveKitCallView";

const ConversationScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTailwindVars();
    const params = useLocalSearchParams();
    const router = useRouter();

    // ... (rest of the hooks remain same)
    const { data: agentsData, isSuccess: isAgentsLoaded } = useQueryData({
        queryKey: ['agents'],
        queryFn: () => listAgents(),
    });

    const { data: scenesData } = useQueryData({
        queryKey: ['scenes'],
        queryFn: () => listScenes(),
    });

    const agents = useMemo(() => agentsData?.list || [], [agentsData?.list]);
    const scenes = useMemo(() => scenesData?.list || [], [scenesData?.list]);

    const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
    const [activeScene, setActiveScene] = useState<VoiceScene | null>(null);

    const [isStarting, setIsStarting] = useState(false);
    const localIdRef = useRef<string | null>(null);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [textInput, setTextInput] = useState("");
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [showTextInput, setShowTextInput] = useState(false);
    const [lastMessage, setLastMessage] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<typeof CONSULTATION_TOPICS[0] | null>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [interactionMode, setInteractionMode] = useState<'elevenlabs' | 'cartesia' | 'livekit'>('elevenlabs');

    // ... (rest of the effects and handlers remain same)
    useEffect(() => {
        if (isAgentsLoaded && agents.length === 0) {
            setShowConfig(true)
        }
    }, [isAgentsLoaded, agents.length]);

    useEffect(() => {
        if (agents.length > 0 && !activeAgent) {
            const init = async () => {
                const savedId = await AsyncStorage.getItem("last_agent_id");
                const targetId = (params.agentId as string) || savedId;
                const initialAgent = targetId
                    ? agents.find((p: Agent) => p._id === targetId) || agents[0]
                    : agents[0];
                setActiveAgent(initialAgent);
                if (initialAgent?._id) {
                    await AsyncStorage.setItem("last_agent_id", initialAgent._id);
                }
            };
            init();
        }
    }, [agents, params.agentId]);

    useEffect(() => {
        if (scenes.length > 0 && !activeScene) {
            setActiveScene(scenes[0]);
        }
    }, [scenes]);

    const conversation = useConversation({
        onConnect: ({ conversationId }: { conversationId: string }) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCurrentConversationId(conversationId);
            setIsStarting(false);
            if (localIdRef.current) {
                updateConversation(localIdRef.current, { conversationId });
            }
        },
        onDisconnect: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setCurrentConversationId(null);
            localIdRef.current = null;
            setIsStarting(false);
            // 对话结束后显示情绪快照
            setShowSummary(true);
        },
        onMessage: ({ message, role }) => {
            if (role === "agent") setLastMessage(message);
            if (localIdRef.current) {
                recordTranscriptEntry({
                    conversationId: localIdRef.current,
                    role: role,
                    message: message
                });
            }
        },
        onStatusChange: ({ status }: { status: ConversationStatus }) => {
            if (status === "connected") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (status === "disconnected") setIsStarting(false);
        },
        onInterruption: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
    });

    const handleStart = useCallback(async () => {
        if (!activeAgent) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setIsStarting(true);
        try {
            const res = await createConversation({
                agentId: activeAgent._id,
                sceneId: activeScene?._id
            });
            const payload = (res.data as any)?.data;
            const { _id, token } = payload || {};
            if (_id) localIdRef.current = _id;
            if (token) {
                await (conversation as any).startSession({ conversationToken: token });
            } else {
                throw new Error("No token returned");
            }
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setIsStarting(false);
        }
    }, [conversation, activeAgent, activeScene]);

    const toggleMute = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const next = !isMicMuted;
        setIsMicMuted(next);
        conversation.setMicMuted(next);
    }, [isMicMuted, conversation]);

    return (
        <ScreenContainer edges={['top']} style={{ backgroundColor: 'transparent' }}>
            {/* Base Background */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#020210' }]} />

            {/* Aurora Streaks */}
            <LinearGradient
                colors={['transparent', '#10b98120', '#06b6d430', 'transparent']}
                start={{ x: 0, y: 0.3 }}
                end={{ x: 1, y: 0.7 }}
                style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.5 }, { rotate: '-15deg' }] }]}
            />
            <LinearGradient
                colors={['#1e1b4b', '#2e1065', '#020617']}
                style={[StyleSheet.absoluteFill, { opacity: 0.8 }]}
            />

            <View className="flex-row items-center justify-between px-6 pt-12 pb-4 z-10">
                <View className="flex-1 items-center">
                    <Text className="text-white text-5xl font-extralight tracking-[20px] opacity-95">AURA</Text>
                    <View className="h-[1px] w-12 bg-white/10 mt-3" />
                    <Text className="text-white/30 text-[9px] uppercase tracking-[4px] mt-4 font-light text-center">Your Private Sanctuary & Soul Companion</Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setInteractionMode(prev =>
                            prev === 'elevenlabs' ? 'cartesia' :
                                prev === 'cartesia' ? 'livekit' : 'elevenlabs'
                        );
                    }}
                    style={{ position: 'absolute', left: 24, top: 48 }}
                    className={`h-10 px-4 items-center justify-center rounded-full border bg-white/5 border-white/5`}
                >
                    <Text className={`text-[10px] uppercase font-bold text-white/70`}>
                        {interactionMode === 'elevenlabs' ? 'Mode: 11Labs' :
                            interactionMode === 'cartesia' ? 'Mode: Cartesia' : 'Mode: LiveKit'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={conversation.status === "connected" || isStarting}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setShowConfig(true);
                    }}
                    style={{ position: 'absolute', right: 24, top: 48 }}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/5"
                >
                    <Feather name="settings" size={16} color="white" opacity={0.3} />
                </TouchableOpacity>
            </View>

            <View className="flex-1 items-center justify-center">
                <Orb isActive={conversation.status === "connected" || isStarting} isSpeaking={conversation.isSpeaking} />

                <View className="mt-20 px-12 items-center">
                    {activeAgent && (
                        <Text className="text-white/40 text-[12px] font-extralight tracking-[6px] uppercase mb-1">{activeAgent.persona?.displayName}</Text>
                    )}

                    {conversation.status === "connected" ? (
                        <View className="mt-4">
                            <ShimmeringText
                                text={conversation.isSpeaking ? "Soul is speaking..." : "Listening to your heart..."}
                                active={true}
                            />
                        </View>
                    ) : (
                        <View className="items-center mt-6">
                            <View className="h-[1px] w-8 bg-white/10 mb-4" />
                            <Text className="text-white/20 text-[10px] uppercase tracking-[3px]">Holding Space for You</Text>
                        </View>
                    )}
                </View>
            </View>

            <View className="px-8 pb-32">
                {/* 主题选择器 */}
                <TopicSelector
                    visible={conversation.status === "disconnected"}
                    onSelect={(topic) => setSelectedTopic(topic)}
                />
                {conversation.status === "disconnected" ? (
                    <View className="flex-row items-center gap-4">
                        {/* 情绪追踪入口 */}
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                router.push('/user/emotions');
                            }}
                            className="h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10"
                        >
                            <MaterialCommunityIcons name="chart-line" size={24} color="#8b5cf6" />
                        </TouchableOpacity>

                        {/* 成长报告入口 */}
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                router.push('/user/growth-report');
                            }}
                            className="h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10"
                        >
                            <MaterialCommunityIcons name="chart-arc" size={24} color="#10b981" />
                        </TouchableOpacity>

                        {/* VoiceMark 入口 */}
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                router.push({
                                    pathname: '/motivation',
                                    params: { agentId: activeAgent?._id }
                                });
                            }}
                            className="h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10"
                        >
                            <MaterialCommunityIcons name="auto-fix" size={24} color="#06b6d4" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={!activeAgent ? () => setShowConfig(true) : handleStart}
                            style={{ overflow: 'hidden' }}
                            className="flex-1 h-16 rounded-2xl flex-row items-center justify-center space-x-3 bg-white/5 border border-[#06b6d4]/30"
                        >
                            <LinearGradient
                                colors={['#06b6d415', 'transparent']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={StyleSheet.absoluteFill}
                            />
                            <MaterialCommunityIcons name={!activeAgent ? "plus-circle" : "power"} size={22} color="#06b6d4" />
                            <Text className="text-[#06b6d4] font-light text-lg tracking-[4px] uppercase">
                                {!activeAgent ? t('agent.goToCreate') : (isStarting ? t('agent.connecting') : t('agent.startConversation'))}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <BlurView intensity={30} tint="dark" className="rounded-[40px] border border-white/10 overflow-hidden p-4 flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={toggleMute}
                            className={`h-14 w-14 items-center justify-center rounded-full ${isMicMuted ? 'bg-[#ef4444]/20 border border-[#ef4444]/50' : 'bg-white/5 border border-white/10'}`}
                        >
                            <Ionicons name={isMicMuted ? "mic-off" : "mic"} size={24} color={isMicMuted ? "#ef4444" : "white"} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={async () => {
                                try {
                                    await conversation.endSession();
                                } finally {
                                    setIsStarting(false);
                                }
                            }}
                            className="h-16 w-16 items-center justify-center rounded-full bg-[#ef4444] shadow-lg shadow-[#ef4444]/40"
                        >
                            <Ionicons name="close" size={32} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowTextInput(true)} className="h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10">
                            <Ionicons name="chatbubble-ellipses" size={22} color="white" />
                        </TouchableOpacity>
                    </BlurView>
                )}
            </View>

            <ConfigModal
                visible={showConfig}
                onClose={() => setShowConfig(false)}
                activeAgent={activeAgent}
                setActiveAgent={setActiveAgent}
                activeScene={activeScene}
                setActiveScene={setActiveScene}
            />

            <MessageModal
                visible={showTextInput}
                onClose={() => setShowTextInput(false)}
                textInput={textInput}
                setTextInput={setTextInput}
                onSendMessage={(text) => conversation.sendUserMessage(text)}
            />

            {/* 咨询结束情绪快照 */}
            <ConsultationSummary
                visible={showSummary}
                onClose={() => setShowSummary(false)}
                emotion={selectedTopic?.label || '平静'}
                trigger={selectedTopic?.label || '未检测到明确触发因素'}
                suggestion="继续保持当前状态，每天抽时间关注自己的情绪变化"
                daysCount={1}
            />

            {interactionMode === 'cartesia' && activeAgent && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
                    <CartesiaCallView
                        agentId={activeAgent._id}
                        onClose={() => setInteractionMode('elevenlabs')}
                    />
                </View>
            )}

            {interactionMode === 'livekit' && activeAgent && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
                    <LiveKitCallView
                        agentId={activeAgent._id}
                        onClose={() => setInteractionMode('elevenlabs')}
                    />
                </View>
            )}
        </ScreenContainer >
    );
};

export default function App() {
    return (
        <ElevenLabsProvider>
            <ConversationScreen />
        </ElevenLabsProvider>
    );
}

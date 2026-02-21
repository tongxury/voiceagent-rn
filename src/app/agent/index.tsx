import { listAgents, listScenes, sendMessage, listTopics, getAgent, createAgent, getPersona } from "@/api/voiceagent";
import useTailwindVars from "@/hooks/useTailwindVars";
import { useTranslation } from "@/i18n/translation";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { Agent, VoiceScene, Topic } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
// import { useRouter } from "expo-router";
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { LiveKitCallView } from "./components/LiveCall/LiveKitCallView";
import { ConfigModal } from "./components/Settings/ConfigModal";
import { MessageModal } from "./components/Messaging/MessageModal";
import { CreditView } from "@/components/CreditView";

const ConversationScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTailwindVars();
    const params = useLocalSearchParams();
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });

    const { data: agentsData, isSuccess: isAgentsLoaded, isError: isAgentsError, error: agentsError, refetch: refetchAgents, isLoading: isLoadingAgents } = useQueryData({
        queryKey: ['agents'],
        queryFn: () => listAgents(),
    });

    useEffect(() => {
        console.log("[Aura] Agents Query Status:", { isAgentsLoaded, isAgentsError, isLoadingAgents, total: agentsData?.list?.length || 0 });
    }, [isAgentsLoaded, isAgentsError, isLoadingAgents, agentsData]);

    const { data: scenesData } = useQueryData({
        queryKey: ['scenes'],
        queryFn: () => listScenes(),
    });

    const { data: topicsData } = useQueryData({
        queryKey: ['topics'],
        queryFn: () => listTopics(),
    });

    const agents = useMemo(() => agentsData?.list || [], [agentsData?.list]);
    const scenes = useMemo(() => scenesData?.list || [], [scenesData?.list]);

    const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
    const [activeScene, setActiveScene] = useState<VoiceScene | null>(null);
    const [textInput, setTextInput] = useState("");

    const activeTopic = useMemo(() => {
        if (!params.topic || !topicsData?.list) return undefined;
        return topicsData.list.find((t: Topic) => t.id === params.topic);
    }, [params.topic, topicsData?.list]);

    // Track the currently selected agent ID separately to drive the full data fetch
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

    // Initial selection from list
    useEffect(() => {
        if (agents.length > 0 && !selectedAgentId) {
            const init = async () => {
                const onboardingPersonaId = await AsyncStorage.getItem("onboarding_selected_persona_id");
                const savedId = await AsyncStorage.getItem("last_agent_id");
                let targetId = (params.agentId as string) || savedId;

                // Priority 1: Onboarding Selection
                if (onboardingPersonaId && onboardingPersonaId.length > 10) { // Safety check for real Mongo IDs vs hardcoded placeholders
                    const matchedAgent = agents.find((a: Agent) => a.persona?._id === onboardingPersonaId);
                    if (matchedAgent) {
                        targetId = matchedAgent._id;
                        await AsyncStorage.removeItem("onboarding_selected_persona_id");
                    } else {
                        // Priority 1.5: Dynamic Creation if onboarding persona has no agent yet
                        try {
                            const { data: persona } = await getPersona(onboardingPersonaId);
                            if (persona) {
                                const { data: newAgent } = await createAgent({
                                    name: persona.displayName || persona.name,
                                    personaId: onboardingPersonaId,
                                });
                                if (newAgent?._id) {
                                    targetId = newAgent._id;
                                    refetchAgents();
                                }
                            }
                        } catch (err) {
                            console.error("Failed to auto-create agent from onboarding:", err);
                        } finally {
                            await AsyncStorage.removeItem("onboarding_selected_persona_id");
                        }
                    }
                }

                const initialAgent = targetId
                    ? agents.find((p: Agent) => p._id === targetId) || agents[0]
                    : agents[0];
                
                if (initialAgent?._id) {
                    setSelectedAgentId(initialAgent._id);
                    await AsyncStorage.setItem("last_agent_id", initialAgent._id);
                }
            };
            init();
        }
    }, [agents, params.agentId, selectedAgentId, refetchAgents]);

    // Fetch full agent details whenever selectedAgentId changes
    const { data: fullAgentData, isLoading: isLoadingFullAgent } = useQueryData<any>({
        queryKey: ["agent", selectedAgentId],
        queryFn: () => getAgent(selectedAgentId!),
        enabled: !!selectedAgentId,
    });

    // Sync active agent state with full data
    useEffect(() => {
        if (fullAgentData) {
            console.log("[Aura] Full agent data loaded:", fullAgentData.displayName || fullAgentData.name);
            setActiveAgent(fullAgentData);
        }
    }, [fullAgentData]);

    // If selectedAgentId is cleared (e.g., by forceStart), clear activeAgent
    useEffect(() => {
        if (!selectedAgentId) {
            setActiveAgent(null);
        }
    }, [selectedAgentId]);

    const onSendMessage = async (text: string) => {
        if (!activeAgent) return;
        try {
            // Here we could handle text-to-speech if not in LiveKit mode, 
            // but for now we just log it or send to backend.
            console.log("Sending text message:", text);
            // Example: await sendMessage({ agentId: activeAgent._id, message: text });
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const [isLongLoading, setIsLongLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!activeAgent && !isAgentsLoaded) {
                setIsLongLoading(true);
            }
        }, 8000); // 8 seconds timeout
        return () => clearTimeout(timer);
    }, [activeAgent, isAgentsLoaded]);

    if (isAgentsError || isLongLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#020210] px-6">
                <Ionicons name={isAgentsError ? "alert-circle-outline" : "timer-outline"} size={48} color={isAgentsError ? "#ef4444" : "#f59e0b"} />
                <Text className="text-white text-lg font-bold mt-4 text-center">
                    {isAgentsError ? t('common.errorLoadingAgents') : t('common.slowNetwork')}
                </Text>
                <Text className="text-white/60 mt-2 text-center mb-6">
                    {isAgentsError
                        ? ((agentsError as any)?.message || t('agent.errorLoadingDesc'))
                        : t('common.longLoadingDesc')}
                </Text>
                <View className="flex-row space-x-4">
                    <TouchableOpacity
                        onPress={() => {
                            setIsLongLoading(false);
                            refetchAgents();
                        }}
                        className="bg-primary px-6 py-3 rounded-full"
                    >
                        <Text className="text-primary-foreground font-bold">{t('common.retry')}</Text>
                    </TouchableOpacity>

                    {/* Fallback to Enter if we have any data (cache) */}
                    {(agents.length > 0 && !activeAgent) && (
                        <TouchableOpacity
                            onPress={() => {
                                const fallback = agents[0];
                                setActiveAgent(fallback);
                                setIsLongLoading(false);
                            }}
                            className="bg-white/10 px-6 py-3 rounded-full ml-4"
                        >
                            <Text className="text-white font-bold">{t('common.forceStart')}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {(isLongLoading && !isAgentsError) && (
                    <TouchableOpacity
                        onPress={async () => {
                            // Clearing cache might help if stuck
                            await AsyncStorage.removeItem("last_agent_id");
                            setIsLongLoading(false);
                            refetchAgents();
                        }}
                        className="mt-8"
                    >
                        <Text className="text-white/40 text-xs">{t('common.resetCacheAndRetry')}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    // Relaxed check: if we have agents, we shouldn't show loading indefinitely
    // even if isAgentsLoaded is false (e.g. stale data)
    if (!activeAgent && (isLoadingFullAgent || agents.length === 0)) {
        return (
            <View className="flex-1 items-center justify-center bg-[#020210]">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="text-white/60 mt-4">{t('common.loadingAura')}</Text>
            </View>
        );
    }

    return (
        <ScreenContainer edges={['top']}>
            <View style={StyleSheet.absoluteFill}>
                {activeAgent && (
                    <LiveKitCallView
                        onClose={() => {}}
                        activeAgent={activeAgent}
                        setActiveAgent={setActiveAgent}
                        topic={activeTopic}
                    />
                )}
            </View>
        </ScreenContainer>
    );
};

export default ConversationScreen;

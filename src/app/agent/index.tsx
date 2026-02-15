import { listAgents, listScenes, sendMessage, listTopics } from "@/api/voiceagent";
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

const ConversationScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTailwindVars();
    const params = useLocalSearchParams();
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });

    const { data: agentsData, isSuccess: isAgentsLoaded, isError: isAgentsError, error: agentsError, refetch: refetchAgents } = useQueryData({
        queryKey: ['agents'],
        queryFn: () => listAgents(),
    });

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
    // const [showConfig, setShowConfig] = useState(false); // Unused
    // const [showMessages, setShowMessages] = useState(false); // Unused
    const [textInput, setTextInput] = useState("");
    const [isInCall, setIsInCall] = useState(true); // Default to in call as requested previously

    const activeTopic = useMemo(() => {
        if (!params.topic || !topicsData?.list) return undefined;
        return topicsData.list.find((t: Topic) => t.id === params.topic);
    }, [params.topic, topicsData?.list]);

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
    }, [agents, params.agentId, activeAgent]);

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
                    {isAgentsError ? (t('common.error') || "Error Loading Agents") : (t('common.slowNetwork') || "Connecting...")}
                </Text>
                <Text className="text-white/60 mt-2 text-center mb-6">
                    {isAgentsError 
                        ? ((agentsError as any)?.message || "Failed to load agent configuration.") 
                        : "Taking longer than expected to connect to AURA."}
                </Text>
                <View className="flex-row space-x-4">
                    <TouchableOpacity 
                        onPress={() => {
                            setIsLongLoading(false);
                            refetchAgents();
                        }}
                        className="bg-primary px-6 py-3 rounded-full"
                    >
                        <Text className="text-primary-foreground font-bold">{t('common.retry') || "Retry"}</Text>
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
                            <Text className="text-white font-bold">Force Start</Text>
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
                        <Text className="text-white/40 text-xs">Reset Cache & Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    // Relaxed check: if we have agents, we shouldn't show loading indefinitely
    // even if isAgentsLoaded is false (e.g. stale data)
    if (!activeAgent && agents.length === 0) {
        return (
            <View className="flex-1 items-center justify-center bg-[#020210]">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="text-white/60 mt-4">Loading AURA...</Text>
            </View>
        );
    }

    return (
        <ScreenContainer edges={['top']}>
            <View style={StyleSheet.absoluteFill}>
                {activeAgent && (
                    <LiveKitCallView
                        agentId={activeAgent._id}
                        agentName={activeAgent.persona?.name}
                        onClose={() => setIsInCall(false)}
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

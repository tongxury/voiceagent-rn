import { listAgents, listScenes, sendMessage } from "@/api/voiceagent";
import useTailwindVars from "@/hooks/useTailwindVars";
import { useTranslation } from "@/i18n/translation";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { Agent, VoiceScene } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
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
    const router = useRouter();

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
    const [showConfig, setShowConfig] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [isInCall, setIsInCall] = useState(true); // Default to in call as requested previously

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

    if (!activeAgent && !isAgentsLoaded) {
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
                        topic={params.topic as string}
                    />
                )}
            </View>
        </ScreenContainer>
    );
};

export default ConversationScreen;

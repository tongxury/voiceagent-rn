import { listAgents, listScenes } from "@/api/voiceagent";
import { useQueryData } from "@/shared/hooks/useQueryData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Text,
    View,
    ActivityIndicator
} from "react-native";
import { Agent, VoiceScene } from "../../types";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { LiveKitCallView } from "./components/LiveCall/LiveKitCallView";

const ConversationScreen = () => {
    const params = useLocalSearchParams();

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

    return (
        <ScreenContainer edges={['top']} style={{ backgroundColor: '#020210' }}>
            {activeAgent ? (
                <LiveKitCallView
                    agentId={activeAgent._id}
                    onClose={() => { }}
                />
            ) : (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text className="text-white/60 mt-4">Initializing AURA...</Text>
                </View>
            )}
        </ScreenContainer>
    );
};

export default ConversationScreen;

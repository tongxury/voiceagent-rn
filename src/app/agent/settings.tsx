import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useTranslation } from "@/i18n/translation";
import { useTailwindVars } from "@/hooks/useTailwindVars";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { AgentTab } from "./components/Settings/AgentTab";
import { VoiceTab } from "./components/Settings/VoiceTab";
import { SceneTab } from "./components/Settings/SceneTab";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { useQueryClient } from "@tanstack/react-query";
import { getAgent, listScenes } from "@/api/voiceagent";
import { Agent, VoiceScene } from "@/types";

const SettingsScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTailwindVars();
    const router = useRouter();
    const { agentId } = useLocalSearchParams<{ agentId: string }>();
    const [activeTab, setActiveTab] = useState<'agent' | 'voice' | 'scene'>('voice');
    const [activeScene, setActiveScene] = useState<VoiceScene | null>(null);

    const { data: agentData, isLoading: isLoadingAgent } = useQueryData<any>({
        queryKey: ['agent', agentId],
        queryFn: () => getAgent(agentId!),
        enabled: !!agentId,
    });

    const activeAgent = (agentData?.data || agentData) as Agent | null;

    const queryClient = useQueryClient();

    const handleSetActiveAgent = async (agent: Agent) => {
        // Optimistically update the cache
        queryClient.setQueryData(['agent', agentId], (oldData: any) => {
            if (oldData?.data) {
                return { ...oldData, data: agent };
            }
            return agent;
        });
        // Invalidate to ensure consistency
        await queryClient.invalidateQueries({ queryKey: ['agent', agentId] });
    };

    if (isLoadingAgent) {
         return (
             <View className="flex-1 items-center justify-center bg-background">
                 <ActivityIndicator size="large" color={colors.primary} />
             </View>
         );
    }

    return (
        <ScreenContainer edges={['top']} className="bg-background">
            <View className="flex-1 px-6">
                {/* Header */}
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center rounded-full bg-muted"
                    >
                        <Feather name="arrow-left" size={20} color={colors.foreground} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-foreground">{t('agent.settings')}</Text>
                    <View className="w-10" />
                </View>

                {/* Tabs */}
                <View className="flex-row mb-8 mt-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {['voice'].map((tab) => (
                            <TouchableOpacity 
                                key={tab}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setActiveTab(tab as any);
                                }}
                                className={`mr-4 px-6 py-3 rounded-full border ${activeTab === tab ? 'bg-primary border-primary' : 'bg-muted border-border'}`}
                            >
                                <Text className={`font-bold capitalize ${activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                    {t(`agent.${tab}` as any)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Content */}
                <View className="flex-1">
                    {activeTab === 'agent' && (
                        <AgentTab activeAgent={activeAgent} setActiveAgent={handleSetActiveAgent} />
                    )}
                    {activeTab === 'voice' && (
                        <VoiceTab activeAgent={activeAgent} setActiveAgent={handleSetActiveAgent} />
                    )}
                    {activeTab === 'scene' && (
                        <SceneTab activeScene={activeScene} setActiveScene={setActiveScene} />
                    )}
                </View>
            </View>
        </ScreenContainer>
    );
};

export default SettingsScreen;

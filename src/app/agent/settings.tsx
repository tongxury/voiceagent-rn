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
import { VoiceTab } from "./components/Settings/VoiceTab";
import { PersonaTab } from "./components/Settings/PersonaTab";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { useQueryClient } from "@tanstack/react-query";
import { getAgent } from "@/api/voiceagent";
import { Agent } from "@/types";

const SettingsScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTailwindVars();
    const router = useRouter();
    const { agentId } = useLocalSearchParams<{ agentId: string }>();

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
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center rounded-full bg-muted"
                    >
                        <Feather name="arrow-left" size={20} color={colors.foreground} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-foreground">{t('agent.settings')}</Text>
                    <View className="w-10" />
                </View>

                {/* Content - Module Sections */}
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {/* Voice Module */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-foreground mb-4">
                            {t('agent.voiceSettings')}
                        </Text>
                        <VoiceTab activeAgent={activeAgent} setActiveAgent={handleSetActiveAgent} />
                    </View>

                    {/* Persona Module */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-foreground mb-4">
                            {t('agent.personaSettings')}
                        </Text>
                        <PersonaTab activeAgent={activeAgent} setActiveAgent={handleSetActiveAgent} />
                    </View>
                </ScrollView>
            </View>
        </ScreenContainer>
    );
};

export default SettingsScreen;

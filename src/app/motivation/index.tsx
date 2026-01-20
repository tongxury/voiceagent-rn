import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "@/i18n/translation";
import useTailwindVars from "@/hooks/useTailwindVars";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { getAgent } from "@/api/voiceagent";
import { MotivationCreator } from "./components/MotivationCreator";

export default function MotivationPage() {
    const { agentId } = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();
    const { colors } = useTailwindVars();

    const { data: agent } = useQueryData({
        queryKey: ['agent', agentId],
        queryFn: () => getAgent(agentId as string),
        enabled: !!agentId
    });

    return (
        <ScreenContainer>
            <View className="flex-1">
                <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="h-12 w-12 bg-muted rounded-2xl items-center justify-center border border-border"
                        >
                            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text className="text-2xl font-bold text-foreground">{t('agent.motivation')}</Text>
                        <Text className="text-muted-foreground mt-1">{t('agent.motivationSubtitle')}</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                            onPress={() => router.push('/motivation/list')}
                            className="h-12 w-12 bg-muted rounded-2xl items-center justify-center border border-border"
                        >
                            <MaterialCommunityIcons name="history" size={24} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-1">
                    <MotivationCreator activeAgent={agent as any} />
                </View>
            </View>
        </ScreenContainer>
    );
}

import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    Modal,
    SafeAreaView
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTailwindVars } from "@/hooks/useTailwindVars";
import { useTranslation } from "@/i18n/translation";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listPersonas, updateAgent } from "@/api/voiceagent";
import { Persona, Agent } from "@/types";

interface PersonaTabProps {
    activeAgent: Agent | null;
    setActiveAgent: (agent: Agent) => void;
}

export const PersonaTab = ({ activeAgent, setActiveAgent }: PersonaTabProps) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [showPersonaList, setShowPersonaList] = useState(false);

    // Fetch counselor personas
    const { data: personasData, isLoading: isLoadingPersonas } = useQueryData<{ list: Persona[] }>({
        queryKey: ["personas", "counselor"],
        queryFn: () => listPersonas({ category: "counselor" }),
    });

    const personas = personasData?.data?.list || personasData?.list || [];

    // Update agent persona mutation
    const updatePersonaMutation = useMutation({
        mutationFn: async (personaId: string) => {
            if (!activeAgent) throw new Error("No active agent");
            const response = await updateAgent(activeAgent._id, { personaId });
            return response;
        },
        onSuccess: (response) => {
            const updatedAgent = (response.data as any).data || response.data;
            setActiveAgent(updatedAgent);
            queryClient.invalidateQueries({ queryKey: ["agent", activeAgent?._id] });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowPersonaList(false);
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            console.error("Failed to update persona", error);
        },
    });

    const handleSelectPersona = (persona: Persona) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        updatePersonaMutation.mutate(persona._id);
    };

    const currentPersonaId = activeAgent?.persona?._id;
    const currentPersona = personas.find(p => p._id === currentPersonaId) || activeAgent?.persona;

    if (isLoadingPersonas) {
        return (
            <View className="h-24 items-center justify-center">
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    }

    return (
        <View>
            <TouchableOpacity
                onPress={() => setShowPersonaList(true)}
                activeOpacity={0.8}
                className="rounded-3xl overflow-hidden border border-border bg-card"
            >
                <View className="p-4 flex-row items-center gap-4">
                    {/* Avatar */}
                    <View className="w-14 h-14 rounded-full overflow-hidden border border-border">
                        {currentPersona?.avatar ? (
                            <Image
                                source={{ uri: currentPersona.avatar }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-full bg-muted items-center justify-center">
                                <Ionicons
                                    name="person"
                                    size={28}
                                    color={colors.mutedForeground}
                                />
                            </View>
                        )}
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                        <Text className="text-base font-bold text-foreground mb-1">
                            {currentPersona?.displayName || t("agent.selectPersona")}
                        </Text>
                        <Text
                            numberOfLines={1}
                            className="text-xs text-muted-foreground bg-muted self-start px-2 py-0.5 rounded-md overflow-hidden"
                        >
                            {currentPersona?.description || t("agent.tapToSelect")}
                        </Text>
                    </View>

                    {/* Chevron */}
                    <View className="bg-muted w-8 h-8 rounded-full items-center justify-center">
                        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                    </View>
                </View>
            </TouchableOpacity>

            <Modal
                visible={showPersonaList}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowPersonaList(false)}
            >
                <SafeAreaView className="flex-1 bg-background">
                    {/* Header */}
                    <View className="px-6 py-4 flex-row items-center justify-between border-b border-border">
                        <Text className="text-lg font-bold text-foreground">
                            {t("selectYourCounselor")}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowPersonaList(false)}
                            className="w-8 h-8 items-center justify-center rounded-full bg-muted"
                        >
                            <Feather name="x" size={18} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
                    >
                        {personas.map((persona: Persona) => {
                            const isSelected = currentPersonaId === persona._id;

                            return (
                                <TouchableOpacity
                                    key={persona._id}
                                    activeOpacity={0.8}
                                    onPress={() => handleSelectPersona(persona)}
                                    disabled={updatePersonaMutation.isPending}
                                    className={`mb-4 rounded-3xl overflow-hidden border-2 ${
                                        isSelected ? "border-primary" : "border-border"
                                    }`}
                                >
                                    <LinearGradient
                                        colors={
                                            isSelected
                                                ? ["#6366f1", "#8b5cf6"]
                                                : ["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        className="p-4"
                                        style={{ padding: 16 }}
                                    >
                                        <View className="flex-row items-center gap-4">
                                            {/* Avatar */}
                                            <View
                                                className={`w-14 h-14 rounded-full overflow-hidden ${
                                                    isSelected ? "border-2 border-white" : "border border-border"
                                                }`}
                                            >
                                                {persona.avatar ? (
                                                    <Image
                                                        source={{ uri: persona.avatar }}
                                                        className="w-full h-full"
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <View className="w-full h-full bg-muted items-center justify-center">
                                                        <Ionicons
                                                            name="person"
                                                            size={28}
                                                            color={colors.mutedForeground}
                                                        />
                                                    </View>
                                                )}
                                            </View>

                                            {/* Info */}
                                            <View className="flex-1">
                                                <View className="flex-row items-center gap-2 mb-1">
                                                    <Text
                                                        className={`text-base font-bold ${
                                                            isSelected ? "text-white" : "text-foreground"
                                                        }`}
                                                    >
                                                        {persona.displayName}
                                                    </Text>
                                                    {isSelected && (
                                                        <View className="px-2 py-0.5 bg-white/20 rounded-full">
                                                            <Text className="text-[10px] text-white font-medium">
                                                                {t("currentPersona")}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text
                                                    numberOfLines={2}
                                                    className={`text-xs ${
                                                        isSelected ? "text-white/80" : "text-muted-foreground"
                                                    }`}
                                                >
                                                    {persona.description}
                                                </Text>
                                            </View>

                                            {/* Selection Indicator */}
                                            <View
                                                className={`w-7 h-7 rounded-full items-center justify-center ${
                                                    isSelected ? "bg-white" : "bg-muted"
                                                }`}
                                            >
                                                {isSelected ? (
                                                    <Feather name="check" size={16} color="#6366f1" />
                                                ) : (
                                                    <View className="w-3.5 h-3.5 rounded-full border-2 border-border" />
                                                )}
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

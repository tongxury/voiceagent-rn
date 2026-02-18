import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTailwindVars } from "@/hooks/useTailwindVars";
import { useTranslation } from "@/i18n/translation";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { listPersonas, updateAgent } from "@/api/voiceagent";
import { Persona, Agent } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PersonaTabProps {
    activeAgent: Agent | null;
    setActiveAgent: (agent: Agent) => void;
}

export const PersonaTab = ({ activeAgent, setActiveAgent }: PersonaTabProps) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

    // Fetch counselor personas
    const { data: personasData, isLoading: isLoadingPersonas } = useQueryData<any>({
        queryKey: ["personas", "counselor"],
        queryFn: () => listPersonas({ category: "counselor" }),
    });

    const personas = (personasData?.list || []) as Persona[];

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
        },
        onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            console.error("Failed to update persona", error);
        },
    });

    const handleSelectPersona = (persona: Persona) => {
        if (persona._id === activeAgent?.persona?._id) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedPersonaId(persona._id);
        updatePersonaMutation.mutate(persona._id);
    };

    const currentPersonaId = activeAgent?.persona?._id;

    if (isLoadingPersonas) {
        return (
            <View className="h-24 items-center justify-center">
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    }

    return (
        <View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 20 }}
            >
                {personas.map((persona: Persona) => {
                    const isSelected = currentPersonaId === persona._id;
                    
                    return (
                        <TouchableOpacity
                            key={persona._id}
                            activeOpacity={0.8}
                            onPress={() => handleSelectPersona(persona)}
                            disabled={updatePersonaMutation.isPending}
                            className={`w-56 h-80 rounded-[32px] overflow-hidden border-2 relative ${
                                isSelected ? "border-primary" : "border-border"
                            }`}
                        >
                            {/* 1. Background Gradient */}
                            <LinearGradient
                                colors={
                                    isSelected
                                        ? ["#6366f1", "#8b5cf6"]
                                        : ["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                            />

                            {/* 2. Avatar / Content */}
                            <View className="flex-1 p-5">
                                <View className="flex-row items-center mb-4">
                                    <View className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                                        isSelected ? "border-white/40" : "border-border"
                                    }`}>
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
                                                    size={24} 
                                                    color={isSelected ? "white" : colors.mutedForeground} 
                                                />
                                            </View>
                                        )}
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text
                                            numberOfLines={1}
                                            className={`text-base font-bold ${
                                                isSelected ? "text-white" : "text-foreground"
                                            }`}
                                        >
                                            {persona.displayName}
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            className={`text-xs ${
                                                isSelected ? "text-white/60" : "text-muted-foreground"
                                            }`}
                                        >
                                            {persona.name}
                                        </Text>
                                </View>
                            </View>

                            {/* Persona Personality Badge */}
                                {persona.personality && (
                                    <View className="mb-2">
                                        <View className={`px-2 py-0.5 rounded-md self-start ${isSelected ? 'bg-white/20' : 'bg-primary/10'}`}>
                                            <Text className={`text-[9px] font-bold tracking-wider ${isSelected ? 'text-white' : 'text-primary'}`}>
                                                {t('persona.personality').toUpperCase()}
                                            </Text>
                                        </View>
                                        <Text
                                            numberOfLines={2}
                                            className={`text-[11px] mt-1 leading-4 font-medium ${
                                                isSelected ? "text-white/90" : "text-foreground/80"
                                            }`}
                                        >
                                            {persona.personality}
                                        </Text>
                                    </View>
                                )}

                                {/* Persona Background Section */}
                                {persona.background && (
                                    <View>
                                        <View className={`px-2 py-0.5 rounded-md self-start ${isSelected ? 'bg-white/10' : 'bg-muted/50'} mb-1`}>
                                            <Text className={`text-[9px] font-bold tracking-wider ${isSelected ? 'text-white/60' : 'text-muted-foreground'}`}>
                                                {t('persona.background').toUpperCase()}
                                            </Text>
                                        </View>
                                        <Text
                                            numberOfLines={5}
                                            className={`text-[11px] leading-4 ${
                                                isSelected ? "text-white/70" : "text-muted-foreground"
                                            }`}
                                        >
                                            {persona.background}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Selection Checkmark */}
                            {isSelected && (
                                <View className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white items-center justify-center shadow-sm">
                                    <Feather name="check" size={14} color="#6366f1" />
                                </View>
                            )}

                            {/* Loading State */}
                            {updatePersonaMutation.isPending && selectedPersonaId === persona._id && (
                                <View className="absolute inset-0 bg-black/20 items-center justify-center">
                                    <ActivityIndicator size="small" color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

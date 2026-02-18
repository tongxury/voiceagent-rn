import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { listVoices, updateAgentVoice } from "@/api/voiceagent";
import { useTailwindVars } from "@/hooks/useTailwindVars";
import { Voice, Agent } from "@/types";
import { useTranslation } from "@/i18n/translation";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { useQueryClient } from "@tanstack/react-query";
import { AudioPlayer, toggleAudioPlayback } from "@/shared/components/AudioPlayer";

interface VoiceTabProps {
    activeAgent: Agent | null;
    setActiveAgent: (agent: Agent) => void;
}

export const VoiceTab = ({ activeAgent, setActiveAgent }: VoiceTabProps) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();
    const [isUpdatingAgent, setIsUpdatingAgent] = useState(false);

    const queryClient = useQueryClient();
    const { data: voicesData, isLoading } = useQueryData<any>({
        queryKey: ['voices'],
        queryFn: () => listVoices(),
    });

    const voices = (voicesData?.list || []) as Voice[];
    const currentVoiceId = activeAgent?.voice?._id;

    const handleSelectVoice = async (voice: Voice) => {
        if (!activeAgent || isUpdatingAgent) return;

        // Automatically play preview if available
        const audioUrl = voice.sampleUrl || (voice as any).previewUrl;
        if (audioUrl) {
            toggleAudioPlayback(voice._id, audioUrl).catch(console.error);
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsUpdatingAgent(true);
        try {
            const response = await updateAgentVoice(activeAgent._id, voice._id);
            // Unwrap AxiosResponse.data and ServerPayload.data
            const updatedAgent = (response.data as any).data || response.data;
            setActiveAgent(updatedAgent);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            
            // Invalidate queries
            await queryClient.invalidateQueries({ queryKey: ["agent", activeAgent._id] });
        } catch (error) {
            console.error("Failed to update agent voice", error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsUpdatingAgent(false);
        }
    };

    if (isLoading) {
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
                {voices.map((voice: Voice) => {
                    const isSelected = currentVoiceId === voice._id;
                    
                    return (
                        <View
                            key={voice._id}
                            className={`w-40 h-44 rounded-3xl overflow-hidden border-2 relative ${
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

                            {/* 2. Selection Handler (Behind content) */}
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                <TouchableOpacity 
                                    activeOpacity={0.8}
                                    onPress={() => handleSelectVoice(voice)}
                                    style={{ flex: 1 }}
                                    disabled={isUpdatingAgent}
                                />
                            </View>

                            {/* 3. Content Layer */}
                            <View pointerEvents="box-none" className="p-3 flex-1 items-center justify-between" style={{ padding: 12 }}> 
                                {/* Top: Checkmark or empty space */}
                                <View className="w-full flex-row justify-end h-6" pointerEvents="none">
                                    {isSelected && (
                                        <View className="w-6 h-6 rounded-full items-center justify-center bg-white">
                                            <Feather name="check" size={14} color="#6366f1" />
                                        </View>
                                    )}
                                </View>

                                {/* Middle: Icon & Name */}
                                <View className="items-center gap-2" pointerEvents="none">
                                    <View
                                        className={`w-10 h-10 rounded-full items-center justify-center ${
                                            isSelected ? "bg-white/20" : "bg-muted"
                                        }`}
                                    >
                                        <Ionicons name="mic" size={20} color={isSelected ? "white" : colors.mutedForeground} />
                                    </View>
                                    <Text
                                        numberOfLines={1}
                                        className={`text-sm font-bold text-center ${
                                            isSelected ? "text-white" : "text-foreground"
                                        }`}
                                    >
                                        {voice.name}
                                    </Text>
                                </View>

                                {/* Bottom: Audio Player or Language Badge */}
                                <View className="w-full items-center h-10 justify-center" pointerEvents="box-none"> 
                                    {/* Audio Player Preview - Handles its own touches */}
                                    { (voice.sampleUrl || (voice as any).previewUrl) ? (
                                        <View pointerEvents="auto">
                                            <AudioPlayer 
                                                url={voice.sampleUrl || (voice as any).previewUrl} 
                                                id={voice._id}
                                                showLabel={false}
                                                className="w-10 h-10 rounded-full"
                                                activeClassName="bg-white/20"
                                                inactiveClassName="bg-muted"
                                                iconSize={18}
                                                iconColor={colors.foreground}
                                                activeIconColor="white"
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                            />
                                        </View>
                                    ) : (
                                        <View 
                                            className="px-2 py-1 rounded-md bg-muted" 
                                            pointerEvents="none"
                                        >
                                            <Text className="text-[10px] text-muted-foreground">
                                                {voice.language || 'Unk'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

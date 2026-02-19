import { Agent, VoiceScene } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { useTranslation } from "@/i18n/translation";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { AgentTab } from "./AgentTab";
import { SceneTab } from "./SceneTab";
import useTailwindVars from "@/hooks/useTailwindVars";

interface ConfigModalProps {
    visible: boolean;
    onClose: () => void;
    activeAgent: Agent | null;
    setActiveAgent: (agent: Agent) => void;
    activeScene: VoiceScene | null;
    setActiveScene: (scene: VoiceScene) => void;
}

export const ConfigModal = ({ 
    visible, 
    onClose, 
    activeAgent, 
    setActiveAgent, 
    activeScene, 
    setActiveScene 
}: ConfigModalProps) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'agent' | 'scene'>('agent');

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 justify-end">
                <TouchableOpacity className="flex-1" onPress={onClose} />
                <BlurView intensity={95} className="h-[75%] rounded-t-[50px] bg-card border-t border-border overflow-hidden">
                    <View className="p-8 pb-0">
                        <View className="flex-row items-center justify-between mb-8">
                            <Text className="text-3xl font-bold text-foreground">{t('agent.settings')}</Text>
                            <TouchableOpacity onPress={onClose} className="h-10 w-10 bg-muted rounded-full items-center justify-center">
                                <Ionicons name="close" size={24} color={colors.foreground} />
                            </TouchableOpacity>
                        </View>

                        {/* Tabs */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-8">
                            {['agent', 'scene'].map((tab) => (
                                <TouchableOpacity 
                                    key={tab}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setActiveTab(tab as any);
                                    }}
                                    className={`mr-4 px-6 py-3 rounded-full border ${activeTab === tab ? 'bg-primary border-primary' : 'bg-muted border-border'}`}
                                >
                                    <Text className={`font-bold capitalize ${activeTab === tab ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{t(`agent.${tab}` as any)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View className="flex-1 px-8">
                        {activeTab === 'agent' && (
                            <AgentTab activeAgent={activeAgent} setActiveAgent={setActiveAgent} />
                        )}
                        {activeTab === 'scene' && (
                            <SceneTab activeScene={activeScene} setActiveScene={setActiveScene} />
                        )}
                    </View>
                </BlurView>
            </View>
        </Modal>
    );
};

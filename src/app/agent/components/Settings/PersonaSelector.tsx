import React from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Persona } from "@/types";
import { useTranslation } from "@/i18n/translation";
import useTailwindVars from "@/hooks/useTailwindVars";

interface PersonaSelectorProps {
    personas: Persona[];
    selectedPersonaId: string;
    onSelect: (persona: Persona) => void;
}

export const PersonaSelector = ({ personas, selectedPersonaId, onSelect }: PersonaSelectorProps) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();

    return (
        <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4 ml-1 pr-1">
                <Text className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
                    {t('agent.selectPersona')}
                </Text>
                <View className="flex-row items-center opacity-30">
                    <Text className="text-muted-foreground font-bold text-[8px] mr-1 uppercase">
                        {t('common.swipeHint')}
                    </Text>
                    <MaterialCommunityIcons name="gesture-swipe-horizontal" size={12} color={colors.mutedForeground} />
                </View>
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                className="flex-row"
                contentContainerStyle={{ paddingRight: 20 }}
            >
                {personas.map((persona: Persona) => (
                    <TouchableOpacity 
                        key={persona._id}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onSelect(persona);
                        }}
                        className={`mr-3 p-4 rounded-3xl border w-48 ${selectedPersonaId === persona._id ? 'bg-primary/20 border-primary' : 'bg-muted border-border'}`}
                        style={selectedPersonaId === persona._id ? {
                            shadowColor: colors.primary,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                            elevation: 4
                        } : {}}
                    >
                        <View className="flex-row items-center mb-3">
                            <Image source={{ uri: persona.avatar }} className={`h-10 w-10 rounded-xl bg-card ${selectedPersonaId === persona._id ? 'border border-primary/30' : ''}`} />
                            <View className="ml-3 flex-1">
                                <Text className={`font-black text-sm ${selectedPersonaId === persona._id ? 'text-primary' : 'text-foreground'}`} numberOfLines={1}>
                                    {persona.displayName}
                                </Text>
                                <Text className={`text-[8px] uppercase tracking-tighter font-bold ${selectedPersonaId === persona._id ? 'text-primary/80' : 'text-muted-foreground'}`} numberOfLines={1}>
                                    {persona.category || t('agent.personaCharacter')}
                                </Text>
                            </View>
                        </View>
                        <Text className={`text-[10px] leading-4 h-12 ${selectedPersonaId === persona._id ? 'text-foreground/90' : 'text-muted-foreground'}`} numberOfLines={3}>
                            {persona.description}
                        </Text>
                        
                        <View className="mt-3 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <MaterialCommunityIcons name="microphone" size={12} color={selectedPersonaId === persona._id ? colors.primary : colors.mutedForeground} />
                                <Text className={`text-[9px] ml-1 font-bold ${selectedPersonaId === persona._id ? 'text-primary' : 'text-muted-foreground'}`}>{t('agent.voiceReady')}</Text>
                            </View>
                            {selectedPersonaId === persona._id && <Ionicons name="checkmark-circle" size={16} color={colors.primary} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, ScrollView, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from "@/i18n/translation";
import { Persona } from '@/types';
import { Orb } from '../../agent/components/LiveCall/Orb';
import { useQueryData } from '@/shared/hooks/useQueryData';
import { listPersonas } from '@/api/voiceagent';

const { width } = Dimensions.get('window');

interface PersonaStepProps {
    isMatching: boolean;
    orbScale: Animated.Value;
    selectedPersonaId: string | null;
    playingId: string | null;
    handleSelectPersona: (p: Persona) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function PersonaStep({ 
    isMatching, 
    orbScale, 
    selectedPersonaId, 
    playingId, 
    handleSelectPersona, 
    onNext, 
    onBack 
}: PersonaStepProps) {
    const { t } = useTranslation();

    const { data: personasData, isLoading: isLoadingPersonas } = useQueryData({
        queryKey: ['personas'],
        queryFn: () => listPersonas(),
    });

    const personas = personasData?.list || [];

    if (isMatching) {
        return (
            <View className="flex-1 items-center justify-center px-10">
                <Animated.View style={{ transform: [{ scale: orbScale }] }}>
                    <Orb isActive={true} isSpeaking={true} />
                </Animated.View>
                <Text className="text-white/90 text-xl font-light mt-16 tracking-widest text-center">{t('onboarding.matching_persona', { defaultValue: '为你唤醒专属伴侣...' })}</Text>
                <Text className="text-violet-300/60 text-sm mt-4 font-light text-center">{t('onboarding.matching_subtitle', { defaultValue: '建立精神链接' })}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="px-10 mb-6">
                <Text className="text-white text-4xl font-light mb-4">{t('onboarding.persona_title', { defaultValue: '聆听他们的声音' })}</Text>
                <Text className="text-white/50 text-base font-light">{t('onboarding.persona_subtitle', { defaultValue: '点击卡片播放语音，选择最让你安心的人' })}</Text>
            </View>
            <View style={{ height: 480 }}>
                {isLoadingPersonas ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#a78bfa" />
                    </View>
                ) : (
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        snapToInterval={width * 0.75 + 24}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: width * 0.125, paddingVertical: 10 }}
                        style={{ flex: 1 }}
                    >
                        {personas.map((p: Persona) => {
                            const isSelected = selectedPersonaId === p._id;
                            const isPlaying = playingId === p._id;
                            return (
                                <TouchableOpacity 
                                    key={p._id} 
                                    onPress={() => handleSelectPersona(p)} 
                                    activeOpacity={0.9} 
                                    style={{ 
                                        width: width * 0.75, 
                                        height: 460, 
                                        marginRight: 24,
                                        borderRadius: 40,
                                        overflow: 'hidden',
                                        borderWidth: 1.5,
                                        borderColor: isSelected ? '#a78bfa' : 'rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <View className={`absolute inset-0 ${isSelected ? 'bg-violet-950/40' : 'bg-white/5'}`} />
                                    {p.avatar ? (
                                        <View className="absolute inset-0 bg-white/10">
                                            <View className="absolute inset-0 bg-white/5" />
                                        </View>
                                    ) : null}
                                    <View className="absolute top-0 w-full h-[60%] items-center justify-center bg-black/20 overflow-hidden">
                                         {p.avatar ? (
                                             <Animated.Image 
                                                source={{ uri: p.avatar }} 
                                                style={{ width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.7 }} 
                                             />
                                         ) : (
                                            <MaterialCommunityIcons name="face-man-profile" size={120} color={isSelected ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)"} />
                                         )}
                                    </View>

                                    <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.95)']} className="absolute inset-0 z-10 pointer-events-none" />

                                    <View className="flex-1 justify-end p-8 z-20">
                                        <View className="flex-row items-center justify-between mb-2">
                                            <Text className="text-white text-3xl font-light">{p.displayName}</Text>
                                            <View className={`h-12 w-12 rounded-full items-center justify-center ${isPlaying ? 'bg-violet-500' : isSelected ? 'bg-violet-500/50' : 'bg-white/20'}`}>
                                                <Ionicons name={isPlaying ? "volume-high" : "play"} size={24} color="white" style={isPlaying ? undefined : {marginLeft: 3}} />
                                            </View>
                                        </View>
                                        {/* <Text className="text-violet-400 text-xs font-bold uppercase tracking-[4px] mb-6">{p.category || 'AI COMPANION'}</Text> */}
                                        <Text className="text-white/70 text-sm leading-6 font-light" numberOfLines={3}>{p.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}
            </View>
            <View className="absolute bottom-12 left-10 right-10 flex-row gap-4">
                <TouchableOpacity onPress={onBack} className="h-16 w-16 rounded-full border border-white/10 items-center justify-center bg-white/5">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onNext} disabled={!selectedPersonaId} className={`flex-1 h-16 rounded-full items-center justify-center overflow-hidden ${selectedPersonaId ? 'bg-violet-600/80 border border-violet-400' : 'bg-white/5 border border-white/5 opacity-50'}`}>
                    {selectedPersonaId ? <BlurView intensity={30} tint="dark" className="absolute inset-0" /> : null}
                    <Text className="text-white text-base font-medium tracking-widest">{t('onboarding.start_connection', { defaultValue: '开始连线' })}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

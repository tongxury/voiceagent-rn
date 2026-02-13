import React, { forwardRef } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useTailwindVars from "@/hooks/useTailwindVars";
import { useTranslation } from "@/i18n/translation";

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.9;
const POSTER_HEIGHT = POSTER_WIDTH * 1.6; // 9:16 aspect ratio

interface MotivationPosterProps {
    data: any;
}

export const MotivationPoster = forwardRef<ViewShot, MotivationPosterProps>(({ data }, ref) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();

    // 根据情绪选择颜色
    const getEmotionColors = () => {
        switch (data.emotionTag) {
            case 'encouraging':
                return ['#9333ea', '#7c3aed'];
            case 'comfort':
                return ['#3b82f6', '#2563eb'];
            case 'energetic':
                return ['#f59e0b', '#d97706'];
            default:
                return [colors.primary || '#8b5cf6', '#6d28d9'];
        }
    };

    const emotionColors = getEmotionColors();

    return (
        <ViewShot
            ref={ref}
            options={{ format: 'jpg', quality: 0.9 }}
            style={{
                width: POSTER_WIDTH,
                height: POSTER_HEIGHT,
                backgroundColor: 'white',
            }}
        >
            <LinearGradient
                colors={emotionColors as any}
                style={{ flex: 1, padding: 24, justifyContent: 'space-between' } as any}
            >
                {/* Header: User & Agent Info */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Image
                            source={{ uri: data.agent?.persona?.avatar || 'https://via.placeholder.com/100' }}
                            style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' }}
                        />
                        <View className="ml-3">
                            <Text className="text-white font-bold text-lg">{data.agent?.persona?.displayName}</Text>
                            <Text className="text-white/70 text-xs">{t('agent.digitalPersona')}</Text>
                        </View>
                    </View>
                    <View className="bg-white/20 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold uppercase tracking-widest">{t('agent.motivation')}</Text>
                    </View>
                </View>

                {/* Content: The Quote */}
                <View>
                    <MaterialCommunityIcons name="format-quote-open" size={48} color="rgba(255,255,255,0.3)" />
                    <Text
                        className="text-white font-bold text-3xl leading-tight mt-2"
                        style={{ textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
                    >
                        {data.text}
                    </Text>
                    <View className="h-1 w-12 bg-white/50 mt-6 rounded-full" />
                </View>

                {/* Footer: Waveform, QR Code, and Branding */}
                <View>
                    {/* Waveform Visualization */}
                    <View className="flex-row items-end justify-center h-16 mb-8 space-x-1">
                        {(data.waveform || Array.from({ length: 40 }, () => Math.random())).map((val: any, i: number) => (
                            <View
                                key={i}
                                style={{
                                    width: 4,
                                    height: Math.max(4, val * 60),
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    borderRadius: 2
                                }}
                            />
                        ))}
                    </View>

                    <View className="flex-row items-center justify-between bg-white/10 p-4 rounded-3xl border border-white/20">
                        <View className="flex-row items-center flex-1 mr-4">
                            <Image
                                source={{ uri: data.user?.avatar || 'https://via.placeholder.com/100' }}
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                            />
                            <View className="ml-3">
                                <Text className="text-white font-bold text-sm">{data.user?.name || 'User'}</Text>
                                <Text className="text-white/60 text-[10px]">{t('motivation.shareMessagePrefix')}</Text>
                            </View>
                        </View>

                        <View className="bg-white p-1 rounded-xl">
                            {data.qrCodeUrl ? (
                                <Image
                                    source={{ uri: data.qrCodeUrl }}
                                    style={{ width: 60, height: 60 }}
                                />
                            ) : (
                                <View style={{ width: 60, height: 60, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name="qrcode" size={30} color="#ccc" />
                                </View>
                            )}
                        </View>
                    </View>

                    <Text className="text-white/40 text-[10px] text-center mt-4 tracking-tighter">
                        Scan to listen the emotional voice by VoiceAgent AI
                    </Text>
                </View>
            </LinearGradient>
        </ViewShot>
    );
});

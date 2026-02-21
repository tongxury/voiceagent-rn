import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Orb } from '../../agent/components/LiveCall/Orb';
import { useTranslation } from "@/i18n/translation";
import { APP_NAME } from '@/constants/constants';

interface WelcomeStepProps {
    orbScale: Animated.Value;
    onNext: () => void;
}

export default function WelcomeStep({ orbScale, onNext }: WelcomeStepProps) {
    const { t } = useTranslation();

    return (
        <View className="flex-1">
            <View className="flex-1 items-center justify-center px-10">
                <Animated.View style={{ transform: [{ scale: orbScale }] }}>
                    <Orb isActive={true} isSpeaking={false} />
                </Animated.View>
                <View className="mt-20 items-center">
                    <Text className="text-white text-5xl font-extralight tracking-[10px] uppercase">{APP_NAME}</Text>
                    <View className="h-[1px] w-12 bg-white/20 my-10" />
                    <Text className="text-white/90 text-center text-xl font-light tracking-widest">{t('onboarding.welcome_subtitle')}</Text>
                    <Text className="text-white/50 text-center text-sm mt-6 font-light leading-6">{"深呼吸，放下烦忧\n在这里，你永远被倾听"}</Text> 
                </View>
            </View>
            
            <View className="px-10 pb-20 w-full">
                <TouchableOpacity onPress={onNext} className="h-16 rounded-full overflow-hidden w-full">
                    <BlurView intensity={30} tint="light" className="flex-1 items-center justify-center bg-white/10">
                        <Text className="text-white text-lg font-light tracking-[3px]">{t('onboarding.start_journey')}</Text>
                    </BlurView>
                </TouchableOpacity>
            </View>
        </View>
    );
}

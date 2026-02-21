import React from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "@/i18n/translation";

interface NameStepProps {
    userName: string;
    setUserName: (name: string) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function NameStep({ userName, setUserName, onNext, onBack }: NameStepProps) {
    const { t } = useTranslation();

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 pt-32 px-10">
            <View className="mb-12">
                <Text className="text-white text-4xl font-light mb-4">{t('onboarding.name_title', { defaultValue: '相遇的第一步' })}</Text>
                <Text className="text-white/50 text-base font-light">{t('onboarding.name_subtitle', { defaultValue: '我们该如何称呼你？' })}</Text>
            </View>
            
            <View className="h-16 border-b border-white/20 mb-8 justify-center">
                <TextInput
                    value={userName}
                    onChangeText={setUserName}
                    placeholder={t('onboarding.name_placeholder', { defaultValue: '输入你的昵称...' })}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    className="text-white text-2xl font-light tracking-wider"
                    autoFocus
                    maxLength={12}
                    selectionColor="#a78bfa"
                />
            </View>
            
            <View className="absolute bottom-12 left-10 right-10 flex-row gap-4">
                <TouchableOpacity onPress={onBack} className="h-16 w-16 rounded-full border border-white/10 items-center justify-center bg-white/5">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onNext} disabled={!userName.trim()} className={`flex-1 h-16 rounded-full items-center justify-center overflow-hidden ${userName.trim() ? 'bg-white/20 border border-white/30' : 'bg-white/5 border border-white/5 opacity-50'}`}>
                    {userName.trim() ? <BlurView intensity={20} tint="dark" className="absolute inset-0" /> : null}
                    <Text className="text-white text-base font-light tracking-widest">{t('onboarding.continue', { defaultValue: '继续' })}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

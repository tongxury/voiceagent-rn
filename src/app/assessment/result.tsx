import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
// import { useRouter } from 'expo-router';
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import ScreenContainer from '@/shared/components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/i18n/translation';
import { LinearGradient } from 'expo-linear-gradient';
import { createAssessment } from '@/api/voiceagent';
import { useEffect, useState } from 'react';

export default function AssessmentResult() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const score = Number(params.score) || 0;
    const type = params.type as string;

    const result = useMemo(() => {
        if (score <= 4) return { level: 'none', color: '#4ADE80' };
        if (score <= 9) return { level: 'mild', color: '#FACC15' };
        if (score <= 14) return { level: 'moderate', color: '#FB923C' };
        if (score <= 19) return { level: 'moderately_severe', color: '#F87171' };
        return { level: 'severe', color: '#EF4444' };
    }, [score]);

    useEffect(() => {
        const saveResult = async () => {
            if (score === undefined || !type) return;
            try {
                await createAssessment({
                    type: type || 'phq9',
                    score,
                    level: result.level,
                    details: JSON.stringify(params),
                });
            } catch (error) {
                console.error('Failed to save assessment', error);
            }
        };
        saveResult();
    }, [score, type, result.level]);

    return (
        <ScreenContainer>
            <View className="flex-1 px-6 pt-8">
                <View className="items-center mb-10">
                    <Text className="text-white/60 text-sm mb-2 uppercase tracking-wide">
                        {t('assessment.resultTitle')}
                    </Text>
                    <Text className="text-white text-6xl font-bold mb-4">{score}</Text>
                    <View className="px-4 py-1 rounded-full bg-white/10" style={{ backgroundColor: `${result.color}20` }}>
                        <Text className="font-medium" style={{ color: result.color }}>
                            {t(`assessment.levels.${result.level}`)}
                        </Text>
                    </View>
                </View>

                <View className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-6">
                    <Text className="text-white text-lg font-bold mb-2">
                        {t('assessment.interpretationTitle')}
                    </Text>
                    <Text className="text-white/70 leading-6">
                        {t(`assessment.interpretations.${result.level}`)}
                    </Text>
                </View>

                <View className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-6">
                    <Text className="text-white text-lg font-bold mb-2">
                        {t('assessment.recommendationTitle')}
                    </Text>
                    <Text className="text-white/70 leading-6">
                        {t(`assessment.recommendations.${result.level}`)}
                    </Text>
                </View>

                {/* Call to Action */}
                <TouchableOpacity
                    className="bg-indigo-600 w-full py-4 rounded-full items-center mb-4"
                    onPress={() => router.push('/agent?topic=depression_help')}
                >
                    <Text className="text-white font-bold text-lg">
                        {t('assessment.talkToAgent')}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full py-4 rounded-full items-center"
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Text className="text-white/60 font-medium">
                        {t('assessment.backToHome')}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
}

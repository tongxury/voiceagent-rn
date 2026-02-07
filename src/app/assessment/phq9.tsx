import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
// import { useRouter } from 'expo-router';
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import ScreenContainer from '@/shared/components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/i18n/translation';
import { LinearGradient } from 'expo-linear-gradient';

const QUESTIONS = [
    'phq9_q1', // "做事提不起劲或没有兴趣"
    'phq9_q2', // "感到心情低落、沮丧或绝望"
    'phq9_q3', // "入睡困难、睡不安稳或睡眠过多"
    'phq9_q4', // "感觉疲倦或没有活力"
    'phq9_q5', // "食欲不振或吃太多"
    'phq9_q6', // "觉得自己很糟或觉得自己很失败，或让自己、家人失望"
    'phq9_q7', // "对事物专注有困难，例如阅读报纸或看电视"
    'phq9_q8', // "行动或说话速度缓慢到别人已经察觉？或相反─焦躁不安、动来动去"
    'phq9_q9', // "有不如死掉或用某种方式伤害自己的念头"
];

const OPTIONS = [
    { value: 0, label: 'not_at_all' }, // "完全没有"
    { value: 1, label: 'several_days' }, // "有几天"
    { value: 2, label: 'more_than_half' }, // "一半以上天数"
    { value: 3, label: 'nearly_every_day' }, // "几乎每天"
];

export default function PHQ9Assessment() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(-1));
    const progress = new Animated.Value(0);

    const handleSelect = (value: number) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = value;
        setAnswers(newAnswers);

        if (currentIndex < QUESTIONS.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 300);
        } else {
            // Calculate score and navigate to result
            const totalScore = newAnswers.reduce((a, b) => a + b, 0);
            router.push({
                pathname: '/assessment/result',
                params: { score: totalScore, type: 'phq9' }
            });
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            router.back();
        }
    };

    const currentProgress = ((currentIndex + 1) / QUESTIONS.length) * 100;

    return (
        <ScreenContainer>
            <View className="flex-1 px-6 pt-4">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-8">
                    <TouchableOpacity onPress={handleBack} className="w-10 h-10 items-center justify-center rounded-full bg-white/10">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white/80 text-sm font-medium">PHQ-9 抑郁症筛查量表</Text>
                    <View className="w-10" />
                </View>

                {/* Progress Bar */}
                <View className="h-1 bg-white/10 rounded-full mb-10 overflow-hidden">
                    <View
                        style={{ width: `${currentProgress}%` }}
                        className="h-full bg-indigo-500 rounded-full"
                    />
                </View>

                {/* Question */}
                <View className="flex-1">
                    <Text className="text-white/60 text-lg mb-2">
                        问题 {currentIndex + 1} / {QUESTIONS.length}
                    </Text>
                    <Text className="text-white text-2xl font-bold leading-9 mb-10">
                        {t(`assessment.${QUESTIONS[currentIndex]}` as any)}
                    </Text>

                    {/* Options */}
                    <View className="space-y-4">
                        {OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => handleSelect(option.value)}
                                className={`p-5 rounded-2xl border ${answers[currentIndex] === option.value
                                    ? 'bg-indigo-500/20 border-indigo-500'
                                    : 'bg-white/5 border-white/10'
                                    }`}
                            >
                                <Text className={`text-lg font-medium ${answers[currentIndex] === option.value ? 'text-white' : 'text-white/80'
                                    }`}>
                                    {t(`assessment.options.${option.label}` as any)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <Text className="text-white/30 text-center text-xs mb-8">
                    过去两周，您是否有以下症状？
                </Text>
            </View>
        </ScreenContainer>
    );
}

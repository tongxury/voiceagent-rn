import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from "@/i18n/translation";
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useQuery } from '@tanstack/react-query';
import { listTopics } from '@/api/voiceagent';

// Fallback topics for the assessment step
const DEFAULT_TOPICS = [
    { id: 'anxiety', title: '焦虑缓解', icon: 'head-question', color: '#f59e0b' },
    { id: 'stress', title: '压力管理', icon: 'lightning-bolt', color: '#ef4444' },
    { id: 'relationship', title: '人际关系', icon: 'account-group', color: '#06b6d4' },
    { id: 'mood', title: '情绪低落', icon: 'emoticon-sad', color: '#6366f1' },
    { id: 'career', title: '职场困扰', icon: 'briefcase', color: '#10b981' },
    { id: 'intimate', title: '亲密关系', icon: 'heart', color: '#ec4899' },
    { id: 'growth', title: '自我成长', icon: 'sprout', color: '#84cc16' },
    { id: 'free', title: '自由聊聊', icon: 'chat', color: '#8b5cf6' },
];

import ScreenContainer from '@/shared/components/ScreenContainer';
import { Orb } from '../agent/components/LiveCall/Orb';

export default function OnboardingScreen() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [isMatching, setIsMatching] = useState(false);
    const { t } = useTranslation();

    const { data: topicsRes, isLoading: isTopicsLoading } = useQuery({
        queryKey: ['topics'],
        queryFn: listTopics,
    });

    const TOPICS = topicsRes?.data?.list && topicsRes.data.list.length > 0
        ? topicsRes.data.list
        : DEFAULT_TOPICS;

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const orbScale = useRef(new Animated.Value(1)).current;

    // Orb 呼吸动画
    useEffect(() => {
        if (currentStep === 0) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(orbScale, {
                        toValue: 1.1,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(orbScale, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [currentStep]);

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (currentStep === 1) {
            // 进入匹配状态
            setIsMatching(true);
            setTimeout(() => {
                handleComplete();
            }, 1500); // 模拟匹配耗时缩短至 1.5s
            return;
        }

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setCurrentStep(prev => prev + 1);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleTopicSelect = (topicId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedTopics(prev => {
            if (prev.includes(topicId)) {
                return prev.filter(id => id !== topicId);
            }
            if (prev.length >= 2) {
                return [...prev.slice(1), topicId];
            }
            return [...prev, topicId];
        });
    };

    const handleComplete = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // 保存已完成引导
        await AsyncStorage.setItem('onboarding_completed', 'true');
        await AsyncStorage.setItem('selected_topics', JSON.stringify(selectedTopics));

        // 跳转到首页开始咨询
        router.replace('/');
    };

    // 第1屏: 欢迎页
    const renderWelcome = () => (
        <View className="flex-1 items-center justify-center px-8">
            <Animated.View style={{ transform: [{ scale: orbScale }] }}>
                <Orb isActive={true} isSpeaking={false} />
            </Animated.View>

            <View className="mt-16 items-center">
                <Animated.View className="items-center">
                    <Text className="text-white text-6xl font-extralight tracking-[16px] pl-[16px]">
                        AURA
                    </Text>
                </Animated.View>

                <View className="h-[1px] w-12 bg-white/10 my-8" />

                <Text className="text-white/70 text-center text-lg font-light tracking-wide leading-8">
                    {t('onboarding.welcome_title')}
                </Text>
                <Text className="text-white/40 text-center text-sm mt-3 font-light">
                    {t('onboarding.welcome_subtitle')}
                </Text>
            </View>

            <TouchableOpacity
                onPress={handleNext}
                activeOpacity={0.8}
                className="absolute bottom-20 left-8 right-8 h-16 rounded-[32px] overflow-hidden border border-white/10"
            >
                <BlurView intensity={30} tint="dark" style={{ flex: 1 }}>
                    <LinearGradient
                        colors={['#8b5cf640', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text className="text-white text-base font-medium tracking-[2px]">
                            {t('onboarding.start_journey')}
                        </Text>
                    </LinearGradient>
                </BlurView>
            </TouchableOpacity>
        </View >
    );

    // 第2屏: 情绪测评
    const renderAssessment = () => (
        <View className="flex-1 px-6 pt-20">
            {isMatching ? (
                <View className="flex-1 items-center justify-center">
                    <Orb isActive={true} isSpeaking={true} />
                    <Text className="text-white/80 text-lg font-light mt-12 tracking-widest text-center px-8">
                        {t('onboarding.matching')}
                    </Text>
                </View>
            ) : (
                <>
                    <View className="items-center mb-10">
                        <View className="h-16 w-16 rounded-[24px] bg-violet-500/10 items-center justify-center mb-6 border border-violet-500/20">
                            <MaterialCommunityIcons name="heart-pulse" size={32} color="#a78bfa" />
                        </View>
                        <Text className="text-white text-2xl font-light tracking-wider text-center">
                            {t('onboarding.assessment_title')}
                        </Text>
                        <Text className="text-white/40 text-sm mt-3 tracking-wide">
                            {t('onboarding.assessment_subtitle')}
                        </Text>
                    </View>

                    {isTopicsLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-white/20 text-sm animate-pulse">Loading Topics...</Text>
                        </View>
                    ) : (
                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                            <View className="flex-row flex-wrap justify-between pb-10">
                                {TOPICS.map((topic, index) => {
                                    const isSelected = selectedTopics.includes(topic.id);
                                    return (
                                        <TouchableOpacity
                                            key={topic.id}
                                            onPress={() => handleTopicSelect(topic.id)}
                                            activeOpacity={0.7}
                                            className="w-[48%] mb-4"
                                        >
                                            <BlurView
                                                intensity={isSelected ? 40 : 15}
                                                tint="dark"
                                                className={`rounded-[24px] overflow-hidden border ${isSelected ? 'border-violet-400/50' : 'border-white/5'
                                                    }`}
                                            >
                                                <View
                                                    className="p-6 items-center"
                                                    style={{
                                                        backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'transparent'
                                                    }}
                                                >
                                                    <View
                                                        className="w-12 h-12 rounded-full items-center justify-center mb-3"
                                                        style={{ backgroundColor: isSelected ? `${topic.color}20` : 'rgba(255,255,255,0.03)' }}
                                                    >
                                                        <MaterialCommunityIcons
                                                            name={topic.icon as any}
                                                            size={24}
                                                            color={isSelected ? topic.color : '#ffffff30'}
                                                        />
                                                    </View>
                                                    <Text
                                                        className={`text-[15px] font-light tracking-wide ${isSelected ? 'text-white' : 'text-white/50'
                                                            }`}
                                                    >
                                                        {t(`dashboard.topics.${topic.id}.title`, topic.title)}
                                                    </Text>
                                                </View>
                                            </BlurView>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    )}

                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={selectedTopics.length === 0}
                        activeOpacity={0.8}
                        className={`h-16 rounded-[28px] overflow-hidden border mb-12 ${selectedTopics.length > 0 ? 'border-violet-400/40' : 'border-white/5'
                            }`}
                    >
                        <BlurView
                            intensity={selectedTopics.length > 0 ? 40 : 10}
                            tint="dark"
                            style={{ flex: 1 }}
                        >
                            <LinearGradient
                                colors={selectedTopics.length > 0 ? ['#8b5cf650', '#8b5cf610'] : ['transparent', 'transparent']}
                                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text className={`text-base font-medium tracking-[2px] ${selectedTopics.length > 0 ? 'text-violet-200' : 'text-white/20'
                                    }`}>
                                    {t('onboarding.generate_plan')}
                                </Text>
                            </LinearGradient>
                        </BlurView>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );

    const steps = [renderWelcome, renderAssessment];

    return (
        <ScreenContainer edges={['top']} style={{ backgroundColor: 'transparent' }}>
            {/* 背景 */}
            <View className="absolute inset-0 bg-[#020210]" />
            <LinearGradient
                colors={['#1e1b4b', '#2e1065', '#020617']}
                className="absolute inset-0 opacity-80"
            />

            {/* 进度指示器 */}
            <View className="flex-row justify-center pt-10 gap-3">
                {[0, 1].map((step) => (
                    <View
                        key={step}
                        className={`h-[3px] w-6 rounded-full ${step === currentStep ? 'bg-white' :
                            step < currentStep ? 'bg-emerald-500/60' : 'bg-white/10'
                            }`}
                    />
                ))}
            </View>

            {/* 内容 */}
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                {steps[currentStep]()}
            </Animated.View>
        </ScreenContainer>
    );
}

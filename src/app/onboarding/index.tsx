import React, { useState, useRef } from 'react';
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
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import ScreenContainer from '@/shared/components/ScreenContainer';
import { Orb } from '../agent/components/LiveCall/Orb';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 咨询主题配置
const TOPICS = [
    { id: 'anxiety', label: '焦虑缓解', icon: 'head-question', color: '#f59e0b' },
    { id: 'stress', label: '压力管理', icon: 'lightning-bolt', color: '#ef4444' },
    { id: 'relationship', label: '人际关系', icon: 'account-group', color: '#06b6d4' },
    { id: 'mood', label: '情绪低落', icon: 'emoticon-sad', color: '#6366f1' },
    { id: 'work', label: '职场困扰', icon: 'briefcase', color: '#10b981' },
    { id: 'love', label: '亲密关系', icon: 'heart', color: '#ec4899' },
    { id: 'growth', label: '自我成长', icon: 'sprout', color: '#84cc16' },
    { id: 'other', label: '自由聊聊', icon: 'chat', color: '#8b5cf6' },
];

export default function OnboardingScreen() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const handleNext = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
            <Orb isActive={true} isSpeaking={false} />

            <View className="mt-16 items-center">
                <Text className="text-white/40 text-xs tracking-[6px] uppercase mb-4">
                    WELCOME TO
                </Text>
                <Text className="text-white text-5xl font-extralight tracking-[12px]">
                    AURA
                </Text>
                <View className="h-[1px] w-16 bg-white/20 my-6" />
                <Text className="text-white/60 text-center text-base leading-7">
                    每个人都值得被倾听
                </Text>
                <Text className="text-white/40 text-center text-sm mt-2">
                    你的 AI 心理咨询师
                </Text>
                <Text className="text-white/30 text-center text-xs mt-1">
                    24小时在线 · 完全隐私 · 专业支持
                </Text>
            </View>

            <TouchableOpacity
                onPress={handleNext}
                className="absolute bottom-24 w-full"
            >
                <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden border border-white/10">
                    <LinearGradient
                        colors={['#06b6d420', 'transparent']}
                        className="py-4 items-center"
                    >
                        <Text className="text-[#06b6d4] text-base tracking-wider">
                            开始体验 →
                        </Text>
                    </LinearGradient>
                </BlurView>
            </TouchableOpacity>
        </View>
    );

    // 第2屏: 情绪测评
    const renderAssessment = () => (
        <View className="flex-1 px-6 pt-20">
            <View className="items-center mb-8">
                <View className="h-12 w-12 rounded-2xl bg-violet-500/20 items-center justify-center mb-4">
                    <MaterialCommunityIcons name="clipboard-pulse" size={24} color="#8b5cf6" />
                </View>
                <Text className="text-white text-xl font-light tracking-wider text-center">
                    最近一周，你是否有以下感受？
                </Text>
                <Text className="text-white/40 text-sm mt-2">
                    选择最符合的 1-2 项
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap justify-between">
                    {TOPICS.map((topic) => {
                        const isSelected = selectedTopics.includes(topic.id);
                        return (
                            <TouchableOpacity
                                key={topic.id}
                                onPress={() => handleTopicSelect(topic.id)}
                                className="w-[48%] mb-3"
                            >
                                <BlurView
                                    intensity={20}
                                    tint="dark"
                                    className={`rounded-2xl overflow-hidden border ${isSelected ? 'border-violet-500/50' : 'border-white/10'
                                        }`}
                                >
                                    <View
                                        className="p-4 items-center"
                                        style={{
                                            backgroundColor: isSelected ? `${topic.color}20` : 'transparent'
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name={topic.icon as any}
                                            size={28}
                                            color={isSelected ? topic.color : '#ffffff60'}
                                        />
                                        <Text
                                            className={`mt-2 text-sm ${isSelected ? 'text-white' : 'text-white/60'
                                                }`}
                                        >
                                            {topic.label}
                                        </Text>
                                    </View>
                                </BlurView>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={handleNext}
                disabled={selectedTopics.length === 0}
                className="mb-8"
            >
                <BlurView
                    intensity={20}
                    tint="dark"
                    className={`rounded-2xl overflow-hidden border ${selectedTopics.length > 0 ? 'border-violet-500/50' : 'border-white/10'
                        }`}
                >
                    <View className={`py-4 items-center ${selectedTopics.length > 0 ? 'bg-violet-500/20' : ''
                        }`}>
                        <Text className={`text-base tracking-wider ${selectedTopics.length > 0 ? 'text-violet-400' : 'text-white/30'
                            }`}>
                            下一步
                        </Text>
                    </View>
                </BlurView>
            </TouchableOpacity>
        </View>
    );

    // 第3屏: 个性化匹配
    const renderMatching = () => {
        const selectedLabels = selectedTopics.map(
            id => TOPICS.find(t => t.id === id)?.label
        ).filter(Boolean);

        return (
            <View className="flex-1 px-6 pt-20 items-center">
                <View className="h-16 w-16 rounded-3xl bg-emerald-500/20 items-center justify-center mb-6">
                    <MaterialCommunityIcons name="check-circle" size={32} color="#10b981" />
                </View>

                <Text className="text-white text-xl font-light tracking-wider text-center mb-2">
                    了解了！
                </Text>
                <Text className="text-white/60 text-center text-base leading-7 mb-8">
                    我会用专业的心理咨询方法{'\n'}帮助你
                    <Text className="text-violet-400"> {selectedLabels.join('、')} </Text>
                </Text>

                <BlurView intensity={20} tint="dark" className="w-full rounded-2xl overflow-hidden border border-white/10 mb-8">
                    <View className="p-6">
                        <Text className="text-white/40 text-sm mb-4">在 AURA，你可以：</Text>

                        {[
                            { icon: 'microphone', text: '随时倾诉，获得专业回应' },
                            { icon: 'chart-line', text: '追踪情绪变化，看见自己的进步' },
                            { icon: 'lightbulb', text: '获得个性化的心理健康建议' },
                        ].map((item, index) => (
                            <View key={index} className="flex-row items-center mb-3 last:mb-0">
                                <View className="h-8 w-8 rounded-xl bg-emerald-500/20 items-center justify-center mr-3">
                                    <MaterialCommunityIcons name={item.icon as any} size={16} color="#10b981" />
                                </View>
                                <Text className="text-white/70 flex-1">{item.text}</Text>
                            </View>
                        ))}
                    </View>
                </BlurView>

                <Text className="text-white/30 text-sm text-center mb-8">
                    每天只需 3 分钟，开始改变
                </Text>

                <TouchableOpacity
                    onPress={handleComplete}
                    className="w-full"
                >
                    <LinearGradient
                        colors={['#10b981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="rounded-2xl py-4 items-center"
                    >
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name="microphone" size={20} color="white" />
                            <Text className="text-white text-base font-medium ml-2">
                                开始第一次咨询
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    };

    const steps = [renderWelcome, renderAssessment, renderMatching];

    return (
        <ScreenContainer edges={['top']} style={{ backgroundColor: 'transparent' }}>
            {/* 背景 */}
            <View className="absolute inset-0 bg-[#020210]" />
            <LinearGradient
                colors={['#1e1b4b', '#2e1065', '#020617']}
                className="absolute inset-0 opacity-80"
            />

            {/* 进度指示器 */}
            <View className="flex-row justify-center pt-6 gap-2">
                {[0, 1, 2].map((step) => (
                    <View
                        key={step}
                        className={`h-1 w-8 rounded-full ${step === currentStep ? 'bg-white/60' :
                            step < currentStep ? 'bg-white/30' : 'bg-white/10'
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

import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import { TopicCard } from "@/app/dashboard/components/TopicCard";
import { useTranslation } from "@/i18n/translation";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { clearAuthToken } from "@/utils";
import { DevSettings } from "react-native";

import { listTopics } from "@/api/voiceagent";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { Topic } from "@/types";

const Screen = () => {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const { t } = useTranslation();

    const { data: topicsData } = useQueryData({
        queryKey: ['topics'],
        queryFn: listTopics,
    });

    // Sort topics: 'free' should be last or specific order
    const TOPICS = useMemo(() => {
        return topicsData?.list || [];
    }, [topicsData]);

    const handleTopicPress = (topic: string) => {
        router.push({
            pathname: "/agent",
            params: { topic }
        });
    };

    return (
        <View className="flex-1 bg-[#020210]">
            <SafeAreaView className="flex-1" edges={['top']}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Header Section */}
                    <View className="px-6 pt-4 pb-8">
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text className="text-white text-2xl font-bold">
                                    {t('dashboard.greeting', { name: t('dashboard.defaultUser') })}
                                </Text>
                            </View>
                            {/* <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center border border-white/20">
                                <Ionicons name="person" size={20} color="white" />
                            </View> */}
                        </View>

                        {/* Interactive Greeting Card */}
                        <View className="bg-white/5 rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                            <LinearGradient
                                colors={['rgba(99, 102, 241, 0.1)', 'rgba(168, 85, 247, 0.1)']}
                                style={StyleSheet.absoluteFill}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                            <Text className="text-white text-lg font-medium mb-2">
                                {t('dashboard.whatToChat')}
                            </Text>
                            <Text className="text-white/60 leading-5 text-sm">
                                {t('dashboard.listeningDesc')}
                            </Text>

                            <TouchableOpacity
                                className="mt-4 bg-white/10 self-start px-4 py-2 rounded-full flex-row items-center space-x-2"
                                onPress={() => handleTopicPress('free')}
                            >
                                <Ionicons name="mic" size={16} color="white" style={{ marginRight: 6 }} />
                                <Text className="text-white text-sm font-medium">{t('dashboard.startInstantChat')}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Assessment Entry */}
                        <TouchableOpacity
                            className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center justify-between"
                            onPress={() => router.push('/assessment/history')}
                        >
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 rounded-full bg-indigo-500/20 items-center justify-center mr-4">
                                    <Ionicons name="clipboard-outline" size={20} color="#818CF8" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-1">
                                        {t('dashboard.assessment')}
                                    </Text>
                                    <Text className="text-white/60 text-xs">
                                        {t('dashboard.startAssessment')}
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="white" style={{ opacity: 0.5 }} />
                        </TouchableOpacity>
                    </View>

                    {/* Topics Grid */}
                    <View className="px-6">
                        <Text className="text-white/80 font-semibold mb-4 text-base">
                            {t('dashboard.selectTopic')}
                        </Text>
                        <View className="flex-row flex-wrap justify-between">
                            {TOPICS.map((topic: Topic) => (
                                <View key={topic.id} style={{ width: '48%', marginBottom: 16 }}>
                                    <TopicCard
                                        title={topic.title}
                                        icon={topic.icon as any}
                                        color={topic.color}
                                        description={topic.desc}
                                        onPress={() => handleTopicPress(topic.id)}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>


                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

export default Screen;
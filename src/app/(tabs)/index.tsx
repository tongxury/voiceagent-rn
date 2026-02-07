import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TopicCard } from "@/app/dashboard/components/TopicCard";
import { useTranslation } from "@/i18n/translation";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const Screen = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const TOPICS = useMemo(() => [
        { id: 'anxiety', title: t('dashboard.topics.anxiety.title'), icon: 'leaf-outline', color: '#4ADE80', desc: t('dashboard.topics.anxiety.desc') },
        { id: 'stress', title: t('dashboard.topics.stress.title'), icon: 'barbell-outline', color: '#F87171', desc: t('dashboard.topics.stress.desc') },
        { id: 'relationship', title: t('dashboard.topics.relationship.title'), icon: 'people-outline', color: '#60A5FA', desc: t('dashboard.topics.relationship.desc') },
        { id: 'mood', title: t('dashboard.topics.mood.title'), icon: 'rainy-outline', color: '#818CF8', desc: t('dashboard.topics.mood.desc') },
        { id: 'career', title: t('dashboard.topics.career.title'), icon: 'briefcase-outline', color: '#FBBF24', desc: t('dashboard.topics.career.desc') },
        { id: 'intimate', title: t('dashboard.topics.intimate.title'), icon: 'heart-outline', color: '#EC4899', desc: t('dashboard.topics.intimate.desc') },
        { id: 'growth', title: t('dashboard.topics.growth.title'), icon: 'bulb-outline', color: '#34D399', desc: t('dashboard.topics.growth.desc') },
        { id: 'free', title: t('dashboard.topics.free.title'), icon: 'chatbubbles-outline', color: '#A78BFA', desc: t('dashboard.topics.free.desc') },
    ], [t]);

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
                    </View>

                    {/* Topics Grid */}
                    <View className="px-6">
                        <Text className="text-white/80 font-semibold mb-4 text-base">
                            {t('dashboard.selectTopic')}
                        </Text>
                        <View className="flex-row flex-wrap justify-between">
                            {TOPICS.map((topic) => (
                                <View key={topic.id} style={{ width: '48%', marginBottom: 16 }}>
                                    <TopicCard
                                        title={topic.title}
                                        icon={topic.icon as any}
                                        color={topic.color}
                                        description={topic.desc}
                                        onPress={() => handleTopicPress(topic.title)}
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
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/i18n/translation';
import { UserProfile } from '@/types';

interface IncompleteProfileCardProps {
    profile?: UserProfile;
}

export const IncompleteProfileCard: React.FC<IncompleteProfileCardProps> = ({ profile }) => {
    const router = useRouter();
    const { t } = useTranslation();

    // Check if profile is complete
    // We consider it incomplete if nickname, birthday, or bio is missing/empty
    // You can adjust this logic based on your requirements
    // const isComplete = React.useMemo(() => {
    //     if (!profile) return false;

    //     const hasNickname = !!profile.nickname;
    //     const hasBirthday = !!profile.birthday;
    //     const hasInterests = profile.interests && profile.interests.length > 0;

    //     return hasNickname && hasBirthday && hasInterests;
    // }, [profile]);

    return (
        <View className="flex-1">
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/user/profile')}
                className="h-full"
            >
                <View className="rounded-3xl overflow-hidden relative border border-white/10 h-full">
                    <LinearGradient
                        colors={['rgba(244, 114, 182, 0.15)', 'rgba(34, 211, 238, 0.15)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />

                    <View className="p-4 h-full justify-between">
                        <View>
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-row items-center">
                                    <Ionicons name="person-add-outline" size={18} color="#22d3ee" style={{ marginRight: 6 }} />
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="white" style={{ opacity: 0.5 }} />
                            </View>
                            <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>
                                {t('dashboard.completeProfileTitle')}
                            </Text>
                            <Text className="text-white/60 text-xs leading-4" numberOfLines={2}>
                                {t('dashboard.completeProfileDesc')}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

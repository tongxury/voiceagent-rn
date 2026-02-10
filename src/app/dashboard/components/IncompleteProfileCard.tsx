import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/i18n/translation';
import { UserProfile } from '@/types';
import useProtectedRoute from '@/shared/hooks/useProtectedRoute';
import protectedRoutes from '@/constants/protected_routes';

interface IncompleteProfileCardProps {
    profile?: UserProfile;
}

export const IncompleteProfileCard: React.FC<IncompleteProfileCardProps> = ({ profile }) => {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const { t } = useTranslation();

    // Check for completion status
    const completionStats = React.useMemo(() => {
        if (!profile) return { isComplete: false, percent: 0, personality: '' };

        const fields = ['nickname', 'birthday', 'bio', 'personality', 'interests', 'goals'];
        const filled = fields.filter(f => {
            const val = profile[f as keyof UserProfile];
            return Array.isArray(val) ? val.length > 0 : !!val;
        });
        const percent = Math.round((filled.length / fields.length) * 100);
        return {
            isComplete: percent >= 80,
            percent,
            personality: profile.personality
        };
    }, [profile]);

    const { isComplete, percent, personality } = completionStats;

    return (
        <View className="flex-1">
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/user/profile')}
                className="h-full"
            >
                <View className="rounded-3xl overflow-hidden relative border border-white/10 h-full">
                    {isComplete ? (
                        <LinearGradient
                            colors={['rgba(99, 102, 241, 0.2)', 'rgba(34, 211, 238, 0.2)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                    ) : (
                        <LinearGradient
                            colors={['rgba(244, 114, 182, 0.15)', 'rgba(34, 211, 238, 0.15)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                        />
                    )}

                    <View className="p-4 h-full justify-between">
                        <View>
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-row items-center">
                                    <Ionicons
                                        name={isComplete ? "sparkles-outline" : "person-add-outline"}
                                        size={18}
                                        color={isComplete ? "#818CF8" : "#22d3ee"}
                                        style={{ marginRight: 6 }}
                                    />
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="white" style={{ opacity: 0.5 }} />
                            </View>

                            <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>
                                {isComplete
                                    ? personality || t('dashboard.profileCompleteTitle', { defaultValue: '已填写个人资料' })
                                    : t('dashboard.completeProfileTitle')}
                            </Text>

                            <Text className="text-white/60 text-xs leading-4" numberOfLines={2}>
                                {isComplete
                                    ? t('dashboard.viewPersonaDesc', { defaultValue: '查看你的 AI 个性报告' })
                                    : t('dashboard.completeProfileDesc')}
                            </Text>
                        </View>

                        {!isComplete && (
                            <View className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
                                <View
                                    className="bg-cyan-400 h-full"
                                    style={{ width: `${percent}%` }}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

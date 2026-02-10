import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Image, Animated } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';

import ScreenContainer from '@/shared/components/ScreenContainer';
import { useQueryData } from '@/shared/hooks/useQueryData';
import { getUserProfile, updateUserProfile, getEmotionStats } from '@/api/voiceagent';
import { UserProfile, EmotionStats } from '@/types';
import useTailwindVars from '@/hooks/useTailwindVars';
import { useTranslation } from '@/i18n/translation';

// 情绪颜色映射
const EMOTION_COLORS: Record<string, string> = {
    happy: '#10b981',
    excited: '#f59e0b',
    calm: '#06b6d4',
    neutral: '#9ca3af',
    sad: '#3b82f6',
    anxious: '#8b5cf6',
    angry: '#ef4444',
};

const EMOTION_ICONS: Record<string, string> = {
    happy: 'emoticon-happy-outline',
    excited: 'emoticon-excited-outline',
    calm: 'emoticon-neutral-outline',
    neutral: 'emoticon-neutral-outline',
    sad: 'emoticon-sad-outline',
    anxious: 'emoticon-confused-outline',
    angry: 'emoticon-angry-outline',
};

export default function ProfilePage() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const { colors } = useTailwindVars();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    // Unified Form State
    const [form, setForm] = useState<Partial<UserProfile>>({});
    const [hasChanges, setHasChanges] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // 获取用户档案
    const { data: profileData } = useQueryData({
        queryKey: ['userProfile'],
        queryFn: () => getUserProfile(),
    });
    const profile = profileData as UserProfile | undefined;

    // Sync form with profile data when loaded
    useEffect(() => {
        if (profile) {
            setForm({
                nickname: profile.nickname || '',
                birthday: profile.birthday || '',
                bio: profile.bio || '',
                interests: profile.interests || [],
                goals: profile.goals || [],
                personality: profile.personality || '',
            });
        }
    }, [profile]);

    // 获取情绪统计
    const { data: emotionStatsData } = useQueryData({
        queryKey: ['emotionStats'],
        queryFn: () => getEmotionStats({ days: 30 }),
    });
    const emotionStats = emotionStatsData as EmotionStats | undefined;

    const handleSave = useCallback(async () => {
        try {
            await updateUserProfile(form);
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setHasChanges(false);
        } catch (error) {
            Alert.alert(t('profileDetail.saveFailed'), t('profileDetail.tryAgain'));
        }
    }, [form, queryClient, t]);

    const updateField = (field: keyof UserProfile, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const toggleSelection = (field: 'interests' | 'goals', value: string) => {
        setForm(prev => {
            const current = (prev[field] as string[]) || [];
            const newValues = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: newValues };
        });
        setHasChanges(true);
    };

    const handleDateSelect = (dateString: string) => {
        updateField('birthday', dateString);
    };

    // Components
    const SectionTitle = ({ title }: { title: string }) => (
        <Text className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4 ml-1">
            {title}
        </Text>
    );

    const ChipGroup = ({
        field,
        options,
        translationPrefix,
        colorClass = 'indigo'
    }: {
        field: 'interests' | 'goals',
        options: string[],
        translationPrefix: string,
        colorClass?: string
    }) => {
        const currentValues = (form[field] as string[]) || [];

        return (
            <View className="flex-row flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = currentValues.includes(option);
                    const label = t(`${translationPrefix}.${option}`, { defaultValue: option });

                    const bgClass = isSelected
                        ? (colorClass === 'cyan' ? 'bg-cyan-500/20' : 'bg-indigo-500/20')
                        : 'bg-white/5';
                    const borderClass = isSelected
                        ? (colorClass === 'cyan' ? 'border-cyan-500/50' : 'border-indigo-500/50')
                        : 'border-white/10';
                    const textClass = isSelected ? 'text-white' : 'text-white/60';

                    return (
                        <TouchableOpacity
                            key={option}
                            onPress={() => toggleSelection(field, option)}
                            className={`px-3 py-2 rounded-xl border ${bgClass} ${borderClass}`}
                        >
                            <Text className={`${textClass} text-xs font-medium`}>{label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <ScreenContainer edges={['top']} style={{ backgroundColor: '#020617' }}>
            {/* Simple Background */}
            <View className="absolute top-0 left-0 right-0 h-[400px]">
                <LinearGradient
                    colors={['#1e1b4b', '#020617']}
                    style={{ flex: 1 }}
                />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-medium text-base">{t('profileDetail.title')}</Text>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={!hasChanges}
                    className={`px-4 py-2 rounded-full ${hasChanges ? 'bg-indigo-500' : 'bg-white/5'}`}
                >
                    <Text className={`font-medium text-xs ${hasChanges ? 'text-white' : 'text-white/30'}`}>
                        {hasChanges ? t('profileDetail.save') : t('profileDetail.save')}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="pb-32 px-6">

                    {/* 1. Profile Card (Avatar + Basic Info) */}
                    <View className="flex-row items-center bg-white/5 p-4 rounded-3xl border border-white/5 mb-8">
                        <View className="h-20 w-20 rounded-full bg-indigo-500 items-center justify-center mr-4">
                            <Text className="text-white text-3xl font-medium">
                                {(form.nickname || 'U')[0]}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <TextInput
                                value={form.nickname}
                                onChangeText={(text) => updateField('nickname', text)}
                                placeholder={t('profileDetail.nicknamePlaceholder')}
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                className="text-white text-xl font-bold mb-1"
                            />
                            <TextInput
                                value={form.bio}
                                onChangeText={(text) => updateField('bio', text)}
                                placeholder={t('profileDetail.bioPlaceholder')}
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                multiline
                                className="text-white/60 text-sm leading-5"
                            />
                        </View>
                    </View>

                    {/* 2. Basic Info Grid */}
                    <View className="flex-row gap-4 mb-8">
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5"
                        >
                            <Text className="text-white/40 text-xs mb-1">{t('profileDetail.birthday')}</Text>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-white font-medium">{form.birthday || 'YYYY-MM-DD'}</Text>
                                <Feather name="calendar" size={14} color="rgba(255,255,255,0.3)" />
                            </View>
                        </TouchableOpacity>
                        <View className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <Text className="text-white/40 text-xs mb-1">{t('profileDetail.joinDate')}</Text>
                            <Text className="text-white font-medium">2024</Text>
                        </View>
                    </View>

                    {/* 3. Personality Pulse */}
                    <View className="mb-8">
                        <SectionTitle title={t('profileDetail.personalityType')} />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                            <View className="flex-row gap-3">
                                {["INFP", "ENFP", "INFJ", "INTJ", "ENTP", "ISFJ", "Optimistic", "Calm", "Sensitive"].map((p) => {
                                    const isSelected = form.personality === p;
                                    const label = t(`profileDetail.personality.${p}`, { defaultValue: p });
                                    return (
                                        <TouchableOpacity
                                            key={p}
                                            onPress={() => updateField('personality', p)}
                                            className={`h-24 w-24 rounded-2xl items-center justify-center border ${isSelected ? 'bg-purple-500 border-purple-400' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                                {p.length <= 4 ? p : p.slice(0, 2)}
                                            </Text>
                                            <Text className={`text-[10px] mt-1 ${isSelected ? 'text-white/80' : 'text-white/40'}`}>
                                                {label}
                                            </Text>
                                            {isSelected && (
                                                <View className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>

                    {/* 4. Focus Areas */}
                    <View className="mb-8">
                        <SectionTitle title={t('profileDetail.currentGoals')} />
                        <ChipGroup
                            field="goals"
                            options={["sleep", "focus", "social", "emotion", "confidence", "energy"]}
                            translationPrefix="profileDetail.goals"
                            colorClass="cyan"
                        />
                    </View>

                    {/* 5. Topics */}
                    <View className="mb-8">
                        <SectionTitle title={t('profileDetail.interestsTopics')} />
                        <ChipGroup
                            field="interests"
                            options={["anxiety", "stress", "relationship", "mood", "career", "intimate", "growth", "free"]}
                            translationPrefix="profileDetail.interests"
                            colorClass="indigo"
                        />
                    </View>


                </KeyboardAvoidingView>
            </ScrollView>

            {/* Date Picker Modal */}
            <Modal visible={showDatePicker} onClose={() => setShowDatePicker(false)}>
                <View className="p-8 pb-16">
                    <View className="flex-row justify-between items-center mb-10">
                        <View>
                            <Text className="text-white font-black text-2xl tracking-tight">{t('profileDetail.birthday')}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(false)}
                            activeOpacity={0.8}
                            className="bg-indigo-500 h-10 px-6 rounded-2xl items-center justify-center shadow-lg shadow-indigo-500/40"
                        >
                            <Text className="text-white font-bold text-sm">{t('agent.done', { defaultValue: '完成' })}</Text>
                        </TouchableOpacity>
                    </View>

                    <DateWheelPicker
                        initialValue={form.birthday || '1995-01-01'}
                        onSelect={(val) => {
                            handleDateSelect(val);
                        }}
                    />
                </View>
            </Modal>
        </ScreenContainer>
    );
}

// --- Custom JS Wheel Picker Components ---

interface WheelPickerColumnProps {
    data: string[];
    value: string;
    onValueChange: (value: string) => void;
    width: number;
}

const ITEM_HEIGHT = 44;

const WheelPickerColumn = ({ data, value, onValueChange, width }: WheelPickerColumnProps) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<any>(null);
    const selectedIndex = data.indexOf(value);

    // Add empty items for top/bottom padding
    const items = ['', '', ...data, '', ''];

    useEffect(() => {
        if (selectedIndex !== -1) {
            flatListRef.current?.scrollToOffset({
                offset: selectedIndex * ITEM_HEIGHT,
                animated: false
            });
        }
    }, [data.length]);

    const onMomentumScrollEnd = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        if (index >= 0 && index < data.length) {
            onValueChange(data[index]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    return (
        <View style={{ width, height: ITEM_HEIGHT * 5 }}>
            <View
                style={{
                    position: 'absolute',
                    top: ITEM_HEIGHT * 2,
                    left: 10,
                    right: 10,
                    height: ITEM_HEIGHT,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)'
                }}
            />
            <Animated.FlatList
                ref={flatListRef}
                data={items}
                keyExtractor={(_, i) => i.toString()}
                snapToInterval={ITEM_HEIGHT}
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                onMomentumScrollEnd={onMomentumScrollEnd}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                renderItem={({ item, index }) => {
                    const position = Animated.subtract(index - 2, Animated.divide(scrollY, ITEM_HEIGHT));
                    const scale = position.interpolate({
                        inputRange: [-2, -1, 0, 1, 2],
                        outputRange: [0.8, 0.9, 1.1, 0.9, 0.8],
                        extrapolate: 'clamp'
                    });
                    const opacity = position.interpolate({
                        inputRange: [-2, -1, 0, 1, 2],
                        outputRange: [0.2, 0.4, 1, 0.4, 0.2],
                        extrapolate: 'clamp'
                    });

                    return (
                        <View style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
                            <Animated.Text
                                style={{
                                    color: 'white',
                                    fontSize: index === selectedIndex + 2 ? 18 : 16,
                                    fontWeight: 'bold',
                                    opacity,
                                    transform: [{ scale }]
                                }}
                            >
                                {item}
                            </Animated.Text>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const DateWheelPicker = ({ initialValue, onSelect }: { initialValue: string, onSelect: (val: string) => void }) => {
    const [year, month, day] = (initialValue || '1995-01-01').split('-');

    // Data generation
    const years = useMemo(() => Array.from({ length: 80 }, (_, i) => (2025 - i).toString()), []);
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')), []);
    const days = useMemo(() => {
        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        return Array.from({ length: lastDay }, (_, i) => (i + 1).toString().padStart(2, '0'));
    }, [year, month]);

    const handleValueChange = (type: 'year' | 'month' | 'day', val: string) => {
        let newYear = year;
        let newMonth = month;
        let newDay = day;

        if (type === 'year') newYear = val;
        if (type === 'month') newMonth = val;
        if (type === 'day') newDay = val;

        // Validation for day count
        const maxDays = new Date(parseInt(newYear), parseInt(newMonth), 0).getDate();
        if (parseInt(newDay) > maxDays) newDay = maxDays.toString().padStart(2, '0');

        onSelect(`${newYear}-${newMonth}-${newDay}`);
    };

    return (
        <View className="flex-row justify-center items-center bg-white/5 rounded-[40px] py-4 border border-white/5">
            <WheelPickerColumn
                width={100}
                data={years}
                value={year}
                onValueChange={(val) => handleValueChange('year', val)}
            />
            <View className="w-[1px] h-20 bg-white/10 mx-2" />
            <WheelPickerColumn
                width={60}
                data={months}
                value={month}
                onValueChange={(val) => handleValueChange('month', val)}
            />
            <View className="w-[1px] h-20 bg-white/10 mx-2" />
            <WheelPickerColumn
                width={60}
                data={days}
                value={day}
                onValueChange={(val) => handleValueChange('day', val)}
            />
        </View>
    );
};

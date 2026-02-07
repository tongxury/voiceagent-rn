import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import * as Haptics from 'expo-haptics';
import { useQueryClient } from '@tanstack/react-query';

import ScreenContainer from '@/shared/components/ScreenContainer';
import { useQueryData } from '@/shared/hooks/useQueryData';
import { listEvents, createEvent, updateEvent, deleteEvent, getUpcomingEvents } from '@/api/voiceagent';
import { ImportantEvent } from '@/types';

// 事件类型配置
const EVENT_TYPES = [
    { value: 'birthday', label: '生日', icon: 'cake-variant', color: '#ec4899' },
    { value: 'anniversary', label: '纪念日', icon: 'heart', color: '#ef4444' },
    { value: 'reminder', label: '提醒', icon: 'bell', color: '#f59e0b' },
    { value: 'goal', label: '目标', icon: 'target', color: '#10b981' },
    { value: 'custom', label: '其他', icon: 'calendar', color: '#6b7280' },
];

export default function EventsPage() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const queryClient = useQueryClient();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ImportantEvent | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'birthday',
        date: '',
        isRecurring: true,
        note: '',
        relatedPerson: '',
        reminderDays: 1,
    });

    // 获取事件列表
    const { data: eventsData, refetch } = useQueryData({
        queryKey: ['events'],
        queryFn: () => listEvents({ size: 100 }),
    });
    const events = ((eventsData as any)?.data?.list || []) as ImportantEvent[];

    // 获取即将到来的事件
    const { data: upcomingData } = useQueryData({
        queryKey: ['upcomingEvents'],
        queryFn: () => getUpcomingEvents({ days: 7 }),
    });
    const upcomingEvents = ((upcomingData as any)?.data?.list || []) as ImportantEvent[];

    const resetForm = () => {
        setFormData({
            title: '',
            type: 'birthday',
            date: '',
            isRecurring: true,
            note: '',
            relatedPerson: '',
            reminderDays: 1,
        });
        setEditingEvent(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setShowAddModal(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleOpenEdit = (event: ImportantEvent) => {
        setFormData({
            title: event.title,
            type: event.type,
            date: event.date,
            isRecurring: event.isRecurring,
            note: event.note || '',
            relatedPerson: event.relatedPerson || '',
            reminderDays: event.reminderDays || 1,
        });
        setEditingEvent(event);
        setShowAddModal(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.date) {
            Alert.alert('提示', '请填写事件名称和日期');
            return;
        }

        try {
            if (editingEvent) {
                await updateEvent(editingEvent._id, formData);
            } else {
                await createEvent(formData);
            }
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            Alert.alert('保存失败', '请稍后重试');
        }
    };

    const handleDelete = (event: ImportantEvent) => {
        Alert.alert(
            '确认删除',
            `确定要删除"${event.title}"吗？`,
            [
                { text: '取消', style: 'cancel' },
                {
                    text: '删除',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteEvent(event._id);
                            queryClient.invalidateQueries({ queryKey: ['events'] });
                            queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        } catch (error) {
                            Alert.alert('删除失败', '请稍后重试');
                        }
                    },
                },
            ]
        );
    };

    const getEventType = (type: string) => EVENT_TYPES.find(t => t.value === type) || EVENT_TYPES[4];

    return (
        <ScreenContainer edges={['top']} style={{ backgroundColor: 'transparent' }}>
            {/* 背景 */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#020210' }} />
            <LinearGradient
                colors={['#1e1b4b', '#2e1065', '#020617']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.8 }}
            />

            {/* 头部 */}
            <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-light tracking-wider">重要日子</Text>
                <TouchableOpacity
                    onPress={handleOpenAdd}
                    className="h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20"
                >
                    <Feather name="plus" size={20} color="#06b6d4" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* 即将到来 */}
                {upcomingEvents.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-white/60 text-sm mb-3 tracking-wider">即将到来</Text>
                        {upcomingEvents.map((event) => {
                            const typeConfig = getEventType(event.type);
                            return (
                                <TouchableOpacity
                                    key={event._id}
                                    onPress={() => handleOpenEdit(event)}
                                    activeOpacity={0.8}
                                >
                                    <BlurView intensity={25} tint="dark" className="rounded-2xl overflow-hidden mb-3">
                                        <LinearGradient
                                            colors={[typeConfig.color + '20', 'transparent']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            className="absolute top-0 left-0 right-0 bottom-0"
                                        />
                                        <View className="p-4 flex-row items-center">
                                            <View
                                                className="h-12 w-12 rounded-2xl items-center justify-center"
                                                style={{ backgroundColor: typeConfig.color + '30' }}
                                            >
                                                <MaterialCommunityIcons
                                                    name={typeConfig.icon as any}
                                                    size={24}
                                                    color={typeConfig.color}
                                                />
                                            </View>
                                            <View className="flex-1 ml-4">
                                                <Text className="text-white font-medium">{event.title}</Text>
                                                <Text className="text-white/40 text-sm">{event.date}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => handleDelete(event)}>
                                                <Feather name="trash-2" size={18} color="#ef4444" />
                                            </TouchableOpacity>
                                        </View>
                                    </BlurView>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* 全部事件 */}
                <View className="mb-6">
                    <Text className="text-white/60 text-sm mb-3 tracking-wider">全部事件</Text>
                    {events.length === 0 ? (
                        <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden p-8">
                            <View className="items-center">
                                <MaterialCommunityIcons name="calendar-blank" size={48} color="#6b7280" />
                                <Text className="text-white/40 mt-4 text-center">
                                    还没有重要日子{'\n'}点击右上角添加
                                </Text>
                            </View>
                        </BlurView>
                    ) : (
                        events.map((event) => {
                            const typeConfig = getEventType(event.type);
                            return (
                                <TouchableOpacity
                                    key={event._id}
                                    onPress={() => handleOpenEdit(event)}
                                    onLongPress={() => handleDelete(event)}
                                    activeOpacity={0.8}
                                >
                                    <BlurView intensity={15} tint="dark" className="rounded-2xl overflow-hidden mb-3">
                                        <View className="p-4 flex-row items-center">
                                            <View
                                                className="h-10 w-10 rounded-xl items-center justify-center"
                                                style={{ backgroundColor: typeConfig.color + '20' }}
                                            >
                                                <MaterialCommunityIcons
                                                    name={typeConfig.icon as any}
                                                    size={20}
                                                    color={typeConfig.color}
                                                />
                                            </View>
                                            <View className="flex-1 ml-3">
                                                <Text className="text-white/90">{event.title}</Text>
                                                <Text className="text-white/40 text-xs">
                                                    {event.date} {event.isRecurring ? '· 每年' : ''}
                                                </Text>
                                            </View>
                                            <Feather name="chevron-right" size={18} color="#6b7280" />
                                        </View>
                                    </BlurView>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>

                <View className="h-20" />
            </ScrollView>

            {/* 添加/编辑弹窗 */}
            <Modal visible={showAddModal} animationType="slide" transparent>
                <View className="flex-1 bg-black/60 justify-end">
                    <BlurView intensity={40} tint="dark" className="rounded-t-3xl overflow-hidden">
                        <View className="p-6">
                            <View className="flex-row items-center justify-between mb-6">
                                <Text className="text-white text-lg">
                                    {editingEvent ? '编辑事件' : '添加事件'}
                                </Text>
                                <TouchableOpacity onPress={() => { setShowAddModal(false); resetForm(); }}>
                                    <Feather name="x" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* 事件类型选择 */}
                            <Text className="text-white/60 text-sm mb-2">类型</Text>
                            <View className="flex-row flex-wrap gap-2 mb-4">
                                {EVENT_TYPES.map((type) => (
                                    <TouchableOpacity
                                        key={type.value}
                                        onPress={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                        className={`px-4 py-2 rounded-full flex-row items-center ${formData.type === type.value ? 'border-2' : 'bg-white/10'
                                            }`}
                                        style={formData.type === type.value ? { borderColor: type.color } : {}}
                                    >
                                        <MaterialCommunityIcons
                                            name={type.icon as any}
                                            size={16}
                                            color={formData.type === type.value ? type.color : '#999'}
                                        />
                                        <Text
                                            className="ml-2"
                                            style={{ color: formData.type === type.value ? type.color : '#999' }}
                                        >
                                            {type.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* 事件名称 */}
                            <Text className="text-white/60 text-sm mb-2">名称</Text>
                            <TextInput
                                value={formData.title}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                                placeholder="例如：妈妈的生日"
                                placeholderTextColor="#666"
                                className="bg-white/10 rounded-xl px-4 py-3 text-white mb-4"
                            />

                            {/* 日期 */}
                            <Text className="text-white/60 text-sm mb-2">日期 (格式: YYYY-MM-DD 或 MM-DD)</Text>
                            <TextInput
                                value={formData.date}
                                onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
                                placeholder="例如：03-15 或 2025-03-15"
                                placeholderTextColor="#666"
                                className="bg-white/10 rounded-xl px-4 py-3 text-white mb-4"
                            />

                            {/* 每年重复 */}
                            <TouchableOpacity
                                onPress={() => setFormData(prev => ({ ...prev, isRecurring: !prev.isRecurring }))}
                                className="flex-row items-center mb-6"
                            >
                                <View className={`h-6 w-6 rounded-md items-center justify-center ${formData.isRecurring ? 'bg-cyan-500' : 'bg-white/20'
                                    }`}>
                                    {formData.isRecurring && <Feather name="check" size={16} color="white" />}
                                </View>
                                <Text className="text-white/80 ml-3">每年重复</Text>
                            </TouchableOpacity>

                            {/* 保存按钮 */}
                            <TouchableOpacity
                                onPress={handleSave}
                                className="bg-cyan-500 rounded-xl py-4 items-center"
                            >
                                <Text className="text-white font-medium">保存</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                </View>
            </Modal>
        </ScreenContainer>
    );
}

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

import ScreenContainer from '@/shared/components/ScreenContainer';
import { useAuthUser } from '@/shared/hooks/useAuthUser';

export default function DebugPage() {
    const router = useRouter();
    const { user, token } = useAuthUser();
    const [storageKeys, setStorageKeys] = useState<string[]>([]);
    const [storageValues, setStorageValues] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = async () => {
        setIsLoading(true);
        try {
            const keys = await AsyncStorage.getAllKeys();
            const pairs = await AsyncStorage.multiGet(keys);
            const values: Record<string, string> = {};
            pairs.forEach(([key, value]) => {
                values[key] = value || 'null';
            });
            setStorageKeys(keys.sort());
            setStorageValues(values);
        } catch (error) {
            console.error('Failed to load storage:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearOnboarding = async () => {
        await AsyncStorage.removeItem('onboarding_completed');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Onboarding state cleared. Restart app to see it.');
    };

    const handleClearAllStorage = () => {
        Alert.alert(
            'Clear All Storage',
            'This will logout and reset all settings. Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                        Alert.alert('Reset Complete', 'App storage has been wiped.');
                        loadStorageData();
                    }
                }
            ]
        );
    };

    const handleExportLogs = async () => {
        const data = {
            device: {
                brand: Device.brand,
                modelName: Device.modelName,
                osVersion: Device.osVersion,
                expoVersion: Constants.expoVersion,
            },
            user: {
                id: user?.id,
                nickname: user?.nickname,
                hasToken: !!token,
            },
            storage: storageValues,
        };

        try {
            await Share.share({
                message: JSON.stringify(data, null, 2),
                title: 'AURA Debug Logs'
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share logs');
        }
    };

    const Section = ({ title, children, rightAction }: { title: string, children: React.ReactNode, rightAction?: React.ReactNode }) => (
        <View className="mb-8 px-6">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white/40 text-xs font-bold uppercase tracking-widest">{title}</Text>
                {rightAction}
            </View>
            <View className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                {children}
            </View>
        </View>
    );

    const InfoRow = ({ label, value, isLast = false }: { label: string, value: string, isLast?: boolean }) => (
        <View className={`flex-row justify-between items-center p-4 ${!isLast ? 'border-b border-white/5' : ''}`}>
            <Text className="text-white/60 text-sm">{label}</Text>
            <Text className="text-white text-sm font-medium flex-1 text-right ml-4" numberOfLines={1}>{value}</Text>
        </View>
    );

    return (
        <ScreenContainer edges={['top']} style={{ backgroundColor: '#020617' }}>
            <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <Feather name="arrow-left" size={20} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-medium text-base">Developer Debug</Text>
                <TouchableOpacity
                    onPress={handleExportLogs}
                    className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
                >
                    <Feather name="share" size={18} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="py-6">

                    {/* Quick Actions */}
                    <Section title="Quick Actions">
                        <TouchableOpacity
                            onPress={handleClearOnboarding}
                            className="flex-row items-center p-4 border-b border-white/5"
                        >
                            <View className="h-8 w-8 rounded-full bg-blue-500/20 items-center justify-center mr-3">
                                <MaterialCommunityIcons name="restart" size={18} color="#3b82f6" />
                            </View>
                            <Text className="text-white text-sm flex-1">Reset Onboarding Flow</Text>
                            <Feather name="chevron-right" size={16} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleClearAllStorage}
                            className="flex-row items-center p-4"
                        >
                            <View className="h-8 w-8 rounded-full bg-red-500/20 items-center justify-center mr-3">
                                <MaterialCommunityIcons name="trash-can-outline" size={18} color="#ef4444" />
                            </View>
                            <Text className="text-red-400 text-sm flex-1">Wipe All App Data</Text>
                            <Feather name="chevron-right" size={16} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                    </Section>

                    {/* App & Device Info */}
                    <Section title="Device & Session">
                        <InfoRow label="User ID" value={user?.id || 'Not logged in'} />
                        <InfoRow label="Auth Token" value={token ? `${token.slice(0, 10)}...${token.slice(-10)}` : 'None'} />
                        <InfoRow label="OS Version" value={`${Device.osName} ${Device.osVersion}`} />
                        <InfoRow label="Device Model" value={Device.modelName || 'Unknown'} />
                        <InfoRow label="Expo Version" value={Constants.expoVersion || 'N/A'} isLast />
                    </Section>

                    {/* Storage Inspector */}
                    <Section
                        title="Storage Inspector"
                        rightAction={
                            <TouchableOpacity onPress={loadStorageData}>
                                <Feather name="refresh-cw" size={12} color="rgba(255,255,255,0.4)" />
                            </TouchableOpacity>
                        }
                    >
                        {isLoading ? (
                            <View className="p-8 items-center"><Text className="text-white/20">Loading...</Text></View>
                        ) : storageKeys.length === 0 ? (
                            <View className="p-8 items-center"><Text className="text-white/20">No keys found</Text></View>
                        ) : (
                            storageKeys.map((key, index) => (
                                <View key={key} className={`p-4 ${index !== storageKeys.length - 1 ? 'border-b border-white/5' : ''}`}>
                                    <Text className="text-white/40 text-[10px] font-bold uppercase mb-1">{key}</Text>
                                    <Text className="text-white/80 text-xs font-mono" numberOfLines={2}>
                                        {storageValues[key]}
                                    </Text>
                                </View>
                            ))
                        )}
                    </Section>

                    <View className="items-center mt-4">
                        <Text className="text-white/10 text-[10px]">INTERNAL USE ONLY</Text>
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

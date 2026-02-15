import { getUser } from "@/api/auth";
import { fetchCreditState } from "@/api/payment";
import LetterAvatar from "@/components/LatterAvatar";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { FlashIcon } from "@/constants/scene_icons";
import useTailwindVars from "../../hooks/useTailwindVars";
import useAppUpdate from "@/hooks/useAppUpdate";
import { useTranslation } from "@/i18n/translation";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import { useAuthUser } from "@/shared/hooks/useAuthUser";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";
import { HStack, Stack } from "react-native-flex-layout";
import { useThemeMode } from "@/hooks/useThemeMode";
import { CreditView } from "@/components/CreditView";


export default function MyScreen() {
    const { colors } = useTailwindVars();
    const { themeMode, changeTheme, getThemeOptions } = useThemeMode();
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });


    const { user: authUser, isLoading: authLoading } = useAuthUser();

    const { data: ur, refetch, isLoading: userLoading } = useQuery({
        queryKey: ["myself"],
        queryFn: getUser,
        staleTime: 60 * 60 * 1000,
        enabled: !!authUser,
    });

    const { data: cs, refetch: refetchCs, isLoading: csLoading } = useQuery({
        queryKey: ["fetchCreditState"],
        queryFn: fetchCreditState,
        staleTime: 60 * 60 * 1000,
        enabled: !!authUser,
    });

    const user = ur?.data?.data;
    const creditState = cs?.data?.data;
    // Only show loading if we are still checking auth, or if we have auth and are loading user data
    const isLoading = authLoading || (!!authUser && userLoading);

    const { creditSummary, email, id, phone } = user || {};

    const { currentVersion, checkAndUpdate } = useAppUpdate()

    const { t, } = useTranslation();

    useFocusEffect(
        useCallback(() => {
            refetch().then();
            refetchCs().then();
            return () => {
            };
        }, [])
    );



    const menuItems: any[][] = [
        [
            {
                title: "assistantStudio",
                onPress: () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/agent");
                },
                icon: (size: number, color: string) =>
                    <MaterialCommunityIcons name="robot-outline" size={size} color={color} />,
            },
            {
                title: "userProfile",
                onPress: () => {
                    router.push("/user/profile");
                },
                icon: (size: number, color: string) =>
                    <Ionicons name="person-outline" size={size} color={color} />,
            },
            {
                title: "contactUs",
                onPress: () => {
                    router.push("/contact");
                },
                icon: (size: number, color: string) =>
                    <MaterialIcons name="headset-mic" size={size} color={color} />,
            },
            {
                title: "faq",
                onPress: () => {
                    router.push("/problem");
                },
                icon: (size: number, color: string) =>
                    <MaterialIcons name="help-outline" size={size} color={color} />,
            },
        ],
        [
            {
                title: "privacyPolicy",
                onPress: () => {
                    router.push("/privacy");
                },
                icon: (size: number, color: string) =>
                    <MaterialCommunityIcons name="shield-account-variant-outline" size={size} color={color} />,
            },
            {
                title: "serviceTerms",
                onPress: () => {
                    router.push("/terms");
                },
                icon: (size: number, color: string) =>
                    <AntDesign name="profile" size={size} color={color} />,
            },
            {
                title: "aboutUs",
                onPress: () => {
                    router.push("/about");
                },
                icon: (size: number, color: string) =>
                    <MaterialIcons name="info-outline" size={size} color={color} />,
            },
            {
                title: "currentVersion",
                onPress: () => {
                    checkAndUpdate()
                },
                icon: (size: number, color: string) =>
                    <MaterialCommunityIcons name="information-outline" size={size} color={color} />,
                right: <Text className={'text-sm text-muted-foreground'}>{currentVersion}</Text>
            },
        ],
        ...(authUser ? [[
            {
                title: "accountAndSecure",
                onPress: () => {
                    router.push("/accountAndSecure");
                },
                icon: (size: number, color: string) =>
                    <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />,
            },
        ]] : []),
    ];

    return (
        <ScreenContainer edges={['top']}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* 用户信息区域 */}
                {!isLoading ? (
                    <View className="p-8 pt-12">
                        {authUser ? (
                            <View className="flex-row items-center gap-6">
                                <TouchableOpacity activeOpacity={0.9}
                                    className="p-1 rounded-full bg-white/10 border border-white/20"
                                >
                                    <LetterAvatar name={email || phone} size={64} />
                                </TouchableOpacity>

                                <View className="flex-1">
                                    <View className="flex-row items-center justify-between">
                                        <Text
                                            numberOfLines={1}
                                            className="text-2xl font-light text-white text-bold">
                                            {user?.nickname || '用户' + user?._id?.substring(0, 8)}
                                        </Text>

                                        <CreditView />
                                    </View>
                                    <Text className="text-[10px] text-white/40 mt-1">
                                        ID: {user?._id?.substring(0, 12)}...
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => router.push('/login')}
                                className="flex-row items-center gap-6"
                            >
                                <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center border border-white/20">
                                    <Ionicons name="person" size={32} color="rgba(255,255,255,0.5)" />
                                </View>
                                <View>
                                    <Text className="text-2xl font-light text-white tracking-wider">
                                        {t('loginOrSignUp')}
                                    </Text>
                                    <Text className="text-xs text-white/40 mt-1">
                                        {t('loginToSyncData')}
                                    </Text>
                                </View>
                                <View className="flex-1 items-end">
                                    <AntDesign name="right" size={16} color="rgba(255,255,255,0.3)" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <View className="p-8 pt-12">
                        <View className="flex-row items-center gap-6">
                            <SkeletonLoader circle width={64} height={64} />
                            <View className="flex-1 gap-2">
                                <SkeletonLoader width={150} height={20} />
                                <SkeletonLoader width={100} height={12} />
                            </View>
                        </View>
                    </View>
                )}

                {/* 菜单列表 */}
                <View className="px-6 space-y-6">
                    {menuItems.map((section, index) => (
                        <View
                            key={index}
                            className="rounded-3xl border border-white/10 overflow-hidden mb-3"
                        >
                            {section.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={itemIndex}
                                    activeOpacity={0.7}
                                    onPress={item?.onPress}
                                    className={`px-6 py-5 flex-row items-center justify-between ${itemIndex !== section.length - 1 ? 'border-b border-white/5' : ''
                                        }`}
                                >
                                    <View className="flex-row gap-4 items-center">
                                        <View className="w-8 h-8 items-center justify-center rounded-xl bg-white/5">
                                            {item.icon(18, index === 0 ? "#06b6d4" : "rgba(255,255,255,0.7)")}
                                        </View>
                                        <Text
                                            className={`text-white/80 text-[13px] font-medium tracking-wide ${item.isDanger ? "text-red-400" : ""
                                                }`}
                                        >
                                            {t(item.title)}
                                        </Text>
                                    </View>

                                    <View className={'flex-row items-center gap-2'}>
                                        {item.right}
                                        {item.onPress && (
                                            <AntDesign name="right" size={12} color="rgba(255,255,255,0.3)" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Theme Toggle or Footer could go here */}
                <View className="p-12 items-center opacity-30">
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            const now = Date.now();
                            const lastTap = (global as any).lastVersionTap || 0;
                            const tapCount = (global as any).versionTapCount || 0;

                            if (now - lastTap < 500) {
                                (global as any).versionTapCount = tapCount + 1;
                            } else {
                                (global as any).versionTapCount = 1;
                            }
                            (global as any).lastVersionTap = now;

                            if ((global as any).versionTapCount === 7) {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                router.push('/(other)/debug');
                                (global as any).versionTapCount = 0;
                            } else if ((global as any).versionTapCount > 3) {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }
                        }}
                    >
                        <Text className="text-white text-[10px] ">{currentVersion}</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </ScreenContainer>
    );
}

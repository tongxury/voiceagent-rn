import React, { useCallback } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import { clearAuthToken } from "@/utils";
import { Stack } from "react-native-flex-layout";
import { useTranslation } from "@/i18n/translation";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/auth";
import ScreenContainer from "@/shared/components/ScreenContainer";
import useTailwindVars from "@/hooks/useTailwindVars";


export default function Screen() {
    const { colors } = useTailwindVars();
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });

    const { t } = useTranslation()

    const { data: ur, refetch, isLoading } = useQuery({
        queryKey: ["myself"],
        queryFn: getUser,
        staleTime: 60 * 60 * 1000,

    });

    const data = ur?.data?.data

    useFocusEffect(useCallback(() => {
        void refetch()
    }, []))


    const menuItems: any[][] = [
        [
            {
                title: "user.avatar",
                component: <View>
                    <Image style={{ width: 50, height: 50 }} className={'rounded-full border-border border-[1px]'}
                        source={require("@/assets/images/app_icon.png")} />
                </View>,
            },
            {
                title: "user.nickname",
                component: <View>
                    <Text className={'text-foreground'}>{JSON.stringify(data)}</Text>
                </View>,
            },
            {
                title: "user.gender",
                component: <View>

                </View>,
            },
            {
                title: "user.sign",
                component: <View>

                </View>,
            },
        ],
    ];

    const handleMenuPress = async (item: any) => {
        Alert.alert(t(item.title), "", [
            {
                text: t('cancel'), onPress: async () => {
                }
            },
            {
                text: t('confirm'), style: 'destructive', onPress: async () => {
                    await clearAuthToken();
                    router.replace("/");
                }
            }
        ]);


    };

    return (
        <ScreenContainer edges={['top']}>
            <ScrollView
                className="flex-1 bg-background"
                showsVerticalScrollIndicator={false}
            // style={{overflow: "hidden"}}
            // contentContainerStyle={{overflow: "visible"}}
            >
                {/* 菜单列表 */}
                <Stack ph={15} spacing={10} mt={15}>
                    {menuItems.map((section, index) => (
                        <View
                            key={index}
                            className="bg-card/70 rounded-xl"
                        // style={{overflow: "visible"}}
                        >
                            {section.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={itemIndex}
                                    activeOpacity={0.9}
                                    onPress={() => handleMenuPress(item)}
                                    className={`px-4 py-5 flex-row items-center justify-between active:opacity-10`}
                                >
                                    <View className="flex-row gap-[8px] items-center">
                                        {item.icon?.(20, colors.foreground)}
                                        <Text
                                            className={`text-base text-sm ${item.isDanger ? "text-error" : "text-foreground"
                                                }`}
                                        >
                                            {t(item.title)}
                                        </Text>
                                    </View>
                                    {item.component}
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}
                </Stack>

            </ScrollView>
        </ScreenContainer>
    );
}

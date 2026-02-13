import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
// import {router} from "expo-router";
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
// import { clearAuthToken } from "@/utils";
import { Stack } from "react-native-flex-layout";
import { useTranslation } from "@/i18n/translation";
import { useTailwindVars } from "@/hooks/useTailwindVars";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { useAuthUser } from "@/shared/hooks/useAuthUser";


export default function Screen() {
    const { colors } = useTailwindVars();
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const { logout } = useAuthUser();


    const { t } = useTranslation()

    const menuItems: any[][] = [
        [
            {
                title: "deleteAccount",
                route: "deleteAccount",
            },
            {
                title: "logout",
                key: "logout",
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
                    await logout();
                    router.replace("/");
                }
            }
        ]);


    };

    return (
        <ScreenContainer edges={['top']} stackScreenProps={{ headerShown: true, title: t('common.accountAndSecureTitle') }}>
            {/* 菜单列表 */}
            <Stack ph={15} spacing={10} mt={15}>
                {menuItems.map((section, index) => (
                    <View
                        key={index}
                        className="bg-card/70 rounded-xl"
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
                                {item.route && (
                                    <AntDesign name="right" size={16} color={colors.mutedForeground} />
                                )}
                                {item.right}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </Stack>

        </ScreenContainer>
    );
}

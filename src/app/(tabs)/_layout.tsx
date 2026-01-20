import React, { useEffect, useState } from "react";
import { router, Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../../global.css";
import { getAuthToken } from "@/utils";
import { useTranslation } from "@/i18n/translation";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import useAppUpdate from "@/hooks/useAppUpdate";
import { MaterialIcons } from "@expo/vector-icons";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { useTailwindVars } from "@/hooks/useTailwindVars";


import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

const barHeight = 70;

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    return (
        <BlurView
            intensity={30}
            tint="dark"
            style={[
                styles.tabBar,
                { height: barHeight + insets.bottom, paddingBottom: insets.bottom }
            ]}
        >
            {state?.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = async () => {
                    const token = await getAuthToken();
                    if (!token) {
                        router.navigate("/login");
                        return;
                    }
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <Pressable
                        key={route.key}
                        className="flex-1 items-center justify-center h-full"
                        onPress={onPress}
                    >
                        <View className={`px-5 py-1.5 rounded-full ${isFocused ? 'bg-primary/15' : ''}`}>
                            <Text
                                style={{
                                    fontWeight: isFocused ? '600' : '300',
                                    letterSpacing: 3
                                }}
                                className={`text-[15px] uppercase ${isFocused ? "text-primary" : "text-white/30"}`}
                            >
                                {t(`tab.${route.name}`)}
                            </Text>
                        </View>
                    </Pressable>
                );
            })}
        </BlurView>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(255,255,255,0.1)',
    }
});

export default function TabLayout() {
    const { t } = useTranslation();

    useAppUpdate()

    return (
        <ScreenContainer edges={[]}>
            <Tabs
                tabBar={(props) => <CustomTabBar {...props} />}
                screenOptions={{
                    tabBarStyle: {
                        display: "none", // Hide default tab bar
                    },
                    headerShown: useClientOnlyValue(false, false),
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <FontAwesome6 name="house-fire" size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="conversation"
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <FontAwesome5 name="user-alt" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="my"
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <FontAwesome5 name="user-alt" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </ScreenContainer>
    );
}

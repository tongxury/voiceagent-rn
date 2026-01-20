
import useTailwindVars from "@/hooks/useTailwindVars";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Platform, StatusBarStyle, StyleProp, TouchableOpacity, ViewStyle, View } from 'react-native';
import { Edge, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

interface ScreenContainerProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    edges?: Edge[];
    className?: string; // For NativeWind support if needed, though usually handled via style or View wrapping
    barStyle?: StatusBarStyle;
    statusBarColor?: string;
    translucent?: boolean;
    stackScreenProps?: NativeStackNavigationOptions;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    style,
    edges = ['left', 'right', 'top', 'bottom'] as Edge[],
    className,
    barStyle,
    statusBarColor = 'transparent',
    translucent = true,
    stackScreenProps,
}) => {

    const { colors } = useTailwindVars();
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const insets = useSafeAreaInsets();
    const isHeaderShown = stackScreenProps?.headerShown;
    const effectiveEdges = isHeaderShown
        ? edges.filter(e => e !== 'top')
        : edges;

    return (
        <View style={{ flex: 1, backgroundColor: '#020210' }}>
            <LinearGradient
                colors={['#1e1b4b', '#2e1065', '#020617']}
                style={[StyleSheet.absoluteFill, { opacity: 0.8 }]}
            />
            <SafeAreaView
                edges={effectiveEdges}
                style={[
                    {
                        flex: 1,
                        backgroundColor: 'transparent',
                    },
                    style,
                ]}
            >
                <Stack.Screen
                    options={{
                        headerShown: false,
                        headerStyle: { backgroundColor: colors.background }, // Optional: customizable
                        headerTransparent: !stackScreenProps?.headerShown, // Optional: useful for full screen
                        headerLeft: ({ canGoBack }) =>
                            canGoBack ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        router.back();
                                    }}
                                    style={{
                                        // width: 20,
                                        // height: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginLeft: Platform.OS === "ios" ? 0 : 8,
                                    }}
                                // hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Feather name="arrow-left" size={24} color={colors.foreground} />
                                </TouchableOpacity>
                            ) : null,
                        ...stackScreenProps,
                    }}
                />

                <StatusBar
                    style={barStyle === 'light-content' ? 'light' : barStyle === 'dark-content' ? 'dark' : (isDarkMode ? 'light' : 'dark')}
                    backgroundColor={statusBarColor}
                    translucent={translucent}
                />
                {children}
            </SafeAreaView>
        </View>
    );
};

export default ScreenContainer;

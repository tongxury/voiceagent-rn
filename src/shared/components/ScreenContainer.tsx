
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
        <View style={{ flex: 1, backgroundColor: '#010108' }}>
            {/* Deep Cosmic Foundation */}
            <LinearGradient
                colors={['#0c0a2e', '#160833', '#000000']}
                style={StyleSheet.absoluteFill}
            />

            {/* Subtle Aurora Ethereal Streaks */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={['transparent', 'rgba(6, 182, 212, 0.08)', 'transparent']}
                    start={{ x: 0, y: 0.2 }}
                    end={{ x: 1, y: 0.8 }}
                    style={{ position: 'absolute', top: -100, left: -200, width: '150%', height: '150%', transform: [{ rotate: '-15deg' }] }}
                />
                <LinearGradient
                    colors={['transparent', 'rgba(139, 92, 246, 0.05)', 'transparent']}
                    start={{ x: 1, y: 0.1 }}
                    end={{ x: 0, y: 0.9 }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '120%', height: '120%', transform: [{ rotate: '10deg' }] }}
                />
            </View>

            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'black', opacity: 0.1 }]} />
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
                    // style={barStyle === 'light-content' ? 'light' : barStyle === 'dark-content' ? 'dark' : (isDarkMode ? 'light' : 'dark')}
                    style={'light'}
                    backgroundColor={statusBarColor}
                    translucent={translucent}
                />
                {children}
            </SafeAreaView>
        </View>
    );
};

export default ScreenContainer;

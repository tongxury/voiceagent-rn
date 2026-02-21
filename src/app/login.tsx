import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
// import { router } from "expo-router";
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile } from "@/api/voiceagent";
import protectedRoutes from "@/constants/protected_routes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Error from "@/components/RormValidationError";
import {
    useLoginWithPhone,
    useSendCodeWithPhone,
} from "@/reactQuery/user";
import { Toast } from "react-native-toast-notifications";
import AppleLogin from "@/components/AppleLogin";
import { useTranslation } from "@/i18n/translation";
import { useTailwindVars } from "@/hooks/useTailwindVars";
import { Feather } from "@expo/vector-icons";

import ScreenContainer from "@/shared/components/ScreenContainer";
import { useAuthUser } from "@/shared/hooks/useAuthUser";

export default function LoginScreen() {
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });
    const insets = useSafeAreaInsets();
    const [countdown, setCountdown] = useState(0);
    const [isAgreed, setIsAgreed] = useState(false);
    const { colors } = useTailwindVars();

    const { refreshUser } = useAuthUser()

    const { t } = useTranslation();

    const loginSchema = z.object({
        code: z.string().length(6, t("codeFormatError")),
        phone: z.string().min(1, t("phoneFormatError")),
    });

    const {
        mutate: loginWithPhone,
        isPending: isLoginPending,
        isSuccess: isLoginSuccess,
        isError: isLoginError,
    } = useLoginWithPhone();

    const {
        mutate: sendPhoneCode,
        isPending: isSendCodePending,
        isSuccess: isSendCodeSuccess,
        isError: isSendCodeError,
    } = useSendCodeWithPhone();

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            code: "",
            phone: "",
        },
    });

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [countdown]);

    // 监听发送验证码的状态
    useEffect(() => {
        if (isSendCodeSuccess) {
            setCountdown(60);
            Toast.show(t("codeSentSuccess"));
        }
        if (isSendCodeError) {
            Toast.show(t("codeSentFail"));
        }
        if (isLoginError) {
            Toast.show(t("loginFail"));
        }
    }, [isSendCodeSuccess, isSendCodeError, isLoginError]);

    useEffect(() => {
        if (isLoginSuccess) {
            onLoginSuccess()
        }
    }, [isLoginSuccess]);

    const onLoginSuccess = async () => {
        await refreshUser();

        try {
            const savedName = await AsyncStorage.getItem('user_name');
            if (savedName) {
                await updateUserProfile({ nickname: savedName });
            }
        } catch (error) {
            console.error("Failed to sync onboarding name to profile after login:", error);
        }

        if (router.canGoBack()) {
            router.back();
        } else {
            router.dismissTo("/");
        }
    }

    const onClose = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/");
        }
    }


    const handleSendCode = () => {
        // @ts-ignore
        sendPhoneCode({ phone: loginForm.getValues("phone") });
    };

    const isPhoneValid = () => {
        const phone = loginForm.getValues("phone") || "";
        return phone.length === 11;
    };

    const buttonDisabled = () => {
        if (!isAgreed) return false;

        return loginForm.getValues("code").length === 6 && isPhoneValid();
    };

    loginForm.watch();

    const submit = async (val: {
        phone?: string;
        code: string;
    }) => {
        if (!val.phone || !isPhoneValid()) {
            loginForm.setError("phone", { message: t("phoneFormatError") });
            return;
        }
        loginWithPhone({ phone: val.phone, code: val.code });
    };

    return (
        <ScreenContainer edges={['top', 'bottom']} stackScreenProps={{
            animation: "fade_from_bottom",
            animationDuration: 100,
        }}>
            <View className="flex-1 px-8 justify-center">
                <TouchableOpacity
                    onPress={() => onClose()}
                    className="absolute left-6 top-1 w-12 h-12 items-center justify-center rounded-full bg-white/5 border border-white/10"
                >
                    <Feather name="x" size={24} color="white" />
                </TouchableOpacity>

                <View className="mt-20">
                    {/* <Text className="text-white text-[10px] uppercase tracking-[6px] opacity-40 mb-2">Welcome</Text> */}
                    <Text className="text-white text-4xl  tracking-widest mb-12">
                        {t("loginPhone")}
                    </Text>

                    {/* 输入框 */}
                    <Controller
                        name="phone"
                        control={loginForm.control}
                        render={({ field }) => (
                            <View className="flex-row bg-white/5 border border-white/10 rounded-2xl mb-6 items-center px-5 h-14">
                                <Text className="text-white/40 text-sm font-medium tracking-wider">+86</Text>
                                <View className="w-[1px] h-4 bg-white/10 mx-4" />
                                <TextInput
                                    className="flex-1 text-white text-lg tracking-widest"
                                    placeholder={t("inputPhone")}
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    value={field.value}
                                    onChangeText={(e) => field.onChange(e.trim())}
                                    keyboardType="phone-pad"
                                    maxLength={11}
                                />
                            </View>
                        )}
                    />

                    <Controller
                        name="code"
                        control={loginForm.control}
                        render={({ field }) => (
                            <View className="flex-row mb-8">
                                <View className="flex-1 bg-white/5 border border-white/10 rounded-2xl mr-3 h-14 px-5 justify-center">
                                    <TextInput
                                        className="text-white text-lg "
                                        placeholder={t("inputCode")}
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        value={field.value}
                                        onChangeText={(e) => field.onChange(e.trim())}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={{
                                        opacity: !isPhoneValid() || countdown > 0 ? 0.5 : 1,
                                    }}
                                    className="px-6 h-14 rounded-2xl items-center justify-center bg-[#06b6d4]/20 border border-[#06b6d4]/40"
                                    onPress={handleSendCode}
                                    disabled={!isPhoneValid() || countdown > 0}
                                >
                                    {isSendCodePending ? (
                                        <ActivityIndicator color="#06b6d4" size="small" />
                                    ) : (
                                        <Text className="text-[#06b6d4] text-[12px] font-bold tracking-widest uppercase">
                                            {countdown > 0
                                                ? `${countdown}`
                                                : t("getCode")}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    {/* 服务条款 */}
                    <View className="flex-row items-center mb-12 px-2">
                        <TouchableOpacity
                            onPress={() => setIsAgreed(!isAgreed)}
                            className={`w-5 h-5 border border-white/20 rounded-lg mr-3 items-center justify-center ${isAgreed ? 'bg-[#06b6d4] border-[#06b6d4]' : 'bg-white/5'}`}
                        >
                            {isAgreed && (
                                <Feather name="check" size={12} color="white" />
                            )}
                        </TouchableOpacity>
                        <Text className="text-white/40 text-[12px] leading-5">
                            {t("agreeTerms")}
                            <Text onPress={() => router.push('/terms' as any)} className="text-[#06b6d4]"> {t("terms")} </Text>
                            {t("and")}
                            <Text onPress={() => router.push('/privacy' as any)} className="text-[#06b6d4]"> {t("privacy")} </Text>
                        </Text>
                    </View>

                    {/* 下一步按钮 */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        className={`h-16 rounded-3xl items-center justify-center mb-12 bg-[#06b6d4] shadow-lg shadow-[#06b6d4]/40 flex-row ${buttonDisabled() ? "" : "opacity-40"}`}
                        onPress={loginForm.handleSubmit(submit)}
                        disabled={!buttonDisabled()}
                    >
                        {isLoginPending && (
                            <ActivityIndicator color="white" size="small" className="mr-3" />
                        )}
                        <Text className="text-white text-lg font-medium tracking-[4px] uppercase">
                            {t("login")}
                        </Text>
                    </TouchableOpacity>

                    {/* 其他登录方式 */}
                    {Platform.OS === "ios" && (
                        <View className="mt-8">
                            <View className="flex-row items-center mb-8">
                                <View className="flex-1 h-[1px] bg-white/5" />
                                <Text className="text-white/20 text-[10px] uppercase mx-4">{t("otherLogin")}</Text>
                                <View className="flex-1 h-[1px] bg-white/5" />
                            </View>
                            <View className="flex-row justify-center">
                                <AppleLogin 
                                    onSuccess={onLoginSuccess} 
                                    onPress={() => {
                                        if (!isAgreed) {
                                            Alert.alert(t("tip"), t("pleaseAgreeTerms"));
                                            return false;
                                        }
                                        return true;
                                    }}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </ScreenContainer>
    );
}

import React from "react";
import {Alert, TouchableOpacity} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import {useTranslation} from "@/i18n/translation";
import {AntDesign} from "@expo/vector-icons";

interface AppleLoginButtonProps {
    className?: string;
    onLoginError?: (error: any) => void;
}

export default function AppleLoginButton({
                                             className = "",
                                             onLoginError,
                                         }: AppleLoginButtonProps) {
    const {t} = useTranslation();

    const handleAppleLogin = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            console.log(credential);

            // 默认处理逻辑
            if (credential.identityToken) {
                // TODO: 调用后端 API，发送 identityToken 进行验证
                console.log("Apple 登录成功:", credential);

                // 假设这是您的 API 调用
                // const response = await fetch('YOUR_API_ENDPOINT', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //         identityToken: credential.identityToken,
                //         user: credential.user,
                //         fullName: credential.fullName,
                //         email: credential.email,
                //     }),
                // });

                // if (response.ok) {
                //     const data = await response.json();
                //     await AsyncStorage.setItem(TOKEN_KEY, data.token);
                //     router.back();
                // }
            }
        } catch (error: any) {
            if (error.code === "ERR_CANCELED") {
                // 用户取消了登录
                return;
            }

            // 如果提供了错误回调，则调用它
            if (onLoginError) {
                onLoginError(error);
                return;
            }

            // 默认错误处理
            Alert.alert(t("loginFailed"), t("pleaseRetryLater"));
        }
    };

    return (
        <TouchableOpacity
            className={`w-12 h-12 rounded-full bg-grey5 items-center justify-center ${className}`}
            onPress={handleAppleLogin}
        >
            <AntDesign name="apple1" color="#fff" size={24}/>
        </TouchableOpacity>
    );
}

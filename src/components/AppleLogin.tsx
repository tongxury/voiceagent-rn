import React from "react";
import {Alert, TouchableOpacity} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import {getAppleAuthToken} from "@/api/auth";
import {setAuthToken} from "@/utils";   
import {useTranslation} from "@/i18n/translation";
import {AntDesign} from "@expo/vector-icons";

export default function AppleLogin({onSuccess}: { onSuccess: () => void }) {
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

            // 获取到 Apple 登录凭证后，调用后端 API
            if (credential.identityToken) {

                const tr = await getAppleAuthToken({
                    ...credential,
                    nickname:
                        credential.fullName?.givenName ||
                        "" + " " + credential.fullName?.familyName ||
                        "",
                });

                await setAuthToken(tr.data?.data?.token);
                onSuccess()
            }
        } catch (error: any) {
            if (error.code === "ERR_CANCELED") {
                // 用户取消了登录
                return;
            }
            Alert.alert(error.message);
        }
    };

    return (
        <TouchableOpacity
            className="w-12 h-12 rounded-full bg-grey5 items-center justify-center"
            onPress={handleAppleLogin}
        >
            <AntDesign name="apple1" color="#fff" size={24}/>
        </TouchableOpacity>
    );
}

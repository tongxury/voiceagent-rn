import * as Linking from "expo-linking";
import {Alert, Platform} from "react-native";


const useLinking = () => {


    const openXhsProfile = async (id: string) => {
        const xhsUrl = `xhsdiscover://user/${id}`;
        const canOpen = await Linking.canOpenURL(xhsUrl);

        if (canOpen) {
            void Linking.openURL(xhsUrl);
        } else {
            Alert.alert(
                "未检测到小红书App",
                "是否前往应用商店下载安装？",
                [
                    {text: "取消", style: "cancel"},
                    {
                        text: '好的',
                        // onPress: () => Linking.openURL(appStoreUrl),
                    },
                ],
                {cancelable: true}
            );
        }
    }

    const openXhsVideo = async (itemId: string) => {
        const xhsUrl = `xhsdiscover://item/${itemId}?type=video`;
        const canOpen = await Linking.canOpenURL(xhsUrl);

        // const appStoreUrl =
        //     Platform.OS === "ios"
        //         ? "https://apps.apple.com/cn/app/%E5%B0%8F%E7%BA%A2%E4%B9%A6-%E4%BD%A0%E7%9A%84%E7%94%9F%E6%B4%BB%E5%85%B4%E8%B6%A3%E7%A4%BE%E5%8C%BA/id741292507" // 小红书 App Store 链接
        //         : "https://play.google.com/store/apps/details?id=com.xingin.xhs"; // 小红书 Google Play 链接
        //

        if (canOpen) {
            void Linking.openURL(xhsUrl);
        } else {
            Alert.alert(
                "未检测到小红书App",
                "是否前往应用商店下载安装？",
                [
                    {text: "取消", style: "cancel"},
                    {
                        text: '好的',
                        // onPress: () => Linking.openURL(appStoreUrl),
                    },
                ],
                {cancelable: true}
            );
        }
    }

    return {
        openXhsVideo,
        openXhsProfile,
    }
}

export default useLinking

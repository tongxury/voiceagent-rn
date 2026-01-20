import {checkForUpdateAsync, fetchUpdateAsync, reloadAsync, channel, runtimeVersion, manifest} from "expo-updates";
import Constants from "expo-constants";
import {Alert} from "react-native";
import {useEffect, useRef, useState} from "react";

function useAppUpdate() {
    const [isChecking, setIsChecking] = useState(false);
    const currentVersion = Constants.expoConfig?.version || "1.0.0";
    const hasCheckedRef = useRef(false);

    useEffect(() => {
        // 避免多次自动检测
        if (!hasCheckedRef.current) {
            void checkAndUpdateAuto();
            hasCheckedRef.current = true;
        }
    }, []);

    const checkAndUpdateAuto = async () => {
        if (isChecking) return;
        setIsChecking(true);
        try {
            const rsp = await checkForUpdateAsync();
            if (rsp.isAvailable) {
                // 这里可以自定义弹窗内容，比如显示新版本号
                Alert.alert(
                    "发现新版本",
                    `检测到新版本，是否立即更新？\n当前版本：${currentVersion}`,
                    [
                        // {
                        //     text: "下次再说",
                        //     style: "cancel",
                        //     onPress: () => setIsChecking(false),
                        // },
                        {
                            text: "立即更新",
                            onPress: async () => {
                                try {
                                    await fetchUpdateAsync();
                                    Alert.alert("更新完成", "应用将重启以应用新版本", [
                                        {
                                            text: "确定",
                                            onPress: () => reloadAsync(),
                                        },
                                    ]);
                                } catch (e) {
                                    Alert.alert("更新失败", "下载新版本时出错，请稍后重试。");
                                    setIsChecking(false);
                                }
                            },
                        },
                    ]
                );
            } else {
                // 可选：自动检测时不提示“已是最新版本”
                setIsChecking(false);
            }
        } catch (e) {
            // Alert.alert("检查更新失败", "请检查网络连接或稍后重试。");
            setIsChecking(false);
        }
    };

    const checkAndUpdate = async () => {
        setIsChecking(true);
        try {
            const rsp = await checkForUpdateAsync();
            if (rsp.isAvailable) {
                await fetchUpdateAsync();
                void reloadAsync();
            } else {
                Alert.alert("已是最新版本");
            }
        } catch (e) {
            // Alert.alert("检查更新失败", "请检查网络连接或稍后重试。");
        } finally {
            setIsChecking(false);
        }
    };

    return {
        channel,
        runtimeVersion, manifest,
        checkAndUpdate,
        currentVersion,
        isChecking,
    };
}

export default useAppUpdate;

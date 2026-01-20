import { useState } from "react";
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from "expo-updates";
import { Platform, Linking, Alert, AlertButton } from "react-native";
import Constants from "expo-constants";
import { StoreVersion } from "@/types";
import { getAppVersion } from "@/api/api";
import { Toast } from "react-native-toast-notifications";
import { useTranslation } from "@/i18n/translation";

function useAppUpdates() {
  const [updating, setUpdating] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const { t } = useTranslation();

  const currentVersion = Constants.expoConfig?.version || "1.0.0";

  // 检查商店版本
  const checkStoreVersion = async (): Promise<StoreVersion | null> => {
    try {
      const response = await getAppVersion();
      return response.data?.data;
    } catch (error) {
      console.error(t("update.checkStoreFailed"), error);
      return null;
    }
  };

  // 版本号比较，只比对主版本号
  const compareVersions = (v1: string, v2: string): number => {
    // 获取主版本号（第一个数字）
    const majorVersion1 = parseInt(v1.split(".")[0]) || 0;
    const majorVersion2 = parseInt(v2.split(".")[0]) || 0;

    if (majorVersion1 > majorVersion2) return 1;
    if (majorVersion1 < majorVersion2) return -1;
    return 0;
  };

  // 打开应用商店
  const openStore = async (downloadUrl: StoreVersion["downloadUrl"]) => {
    const storeUrl =
      Platform.OS === "ios" ? downloadUrl.ios : downloadUrl.android;
    const fallbackUrl =
      Platform.OS === "ios"
        ? downloadUrl.fallbackIos || downloadUrl.ios
        : downloadUrl.fallbackAndroid || downloadUrl.android;

    try {
      const supported = await Linking.canOpenURL(storeUrl);
      if (supported) {
        await Linking.openURL(storeUrl);
      } else if (fallbackUrl) {
        await Linking.openURL(fallbackUrl);
      }
    } catch (error) {
      Toast.show(t("update.openStoreFailed"));
    }
  };

  // 检查更新（包括商店版本和热更新）
  const checkToUpdate = async () => {
    if (Platform.OS === "web") {
      return;
    }

    try {
      setUpdating(true);
      // 先检查商店版本
      const storeVersion = await checkStoreVersion();
      if (storeVersion && compareVersions(storeVersion.version, currentVersion) > 0) {
        const buttons: AlertButton[] = [
          {
            text: t("update.updateNow"),
            style: "default",
            onPress: () => openStore(storeVersion.downloadUrl),
          },
        ];
        if (!storeVersion.forceUpdate) {
          buttons.unshift({
            text: t("update.later"),
            style: "cancel",
            onPress: () => {},
          });
        }

        // 显示更新提示
        Alert.alert(
          t("update.title"),
          storeVersion.description || t("update.newVersionAvailable"),
          buttons,
          {
            cancelable: false,
          }
        );
        return;
      }

      // 检查热更新
      const update = await checkForUpdateAsync();
      if (update.isAvailable) {
        const buttons: AlertButton[] = [
          {
            text: t("update.updateNow"),
            style: "default",
            onPress: async () => {
              await fetchUpdateAsync();
              Toast.show(t("update.successRestart"));
              setTimeout(async () => {
                try {
                  await reloadAsync();
                } catch (error) {
                  Toast.show(t("update.restartFailed"));
                }
              }, 3000);
            },
          },
        ];
        Alert.alert(
          t("update.title"),
          t("update.newVersionAvailable"),
          buttons,
          {
            cancelable: false,
          }
        );
      }
    } catch (error) {
      console.log(t("update.checkFailed"), error);
    } finally {
      setUpdating(false);
    }
  };

  // 后台检查更新，不显示 Toast
  const checkForUpdates = async () => {
    if (Platform.OS === "web") {
      return;
    }

    try {
      // 先检查商店版本
      const storeVersion = await checkStoreVersion();
      if (
        storeVersion &&
        compareVersions(storeVersion.version, currentVersion) > 0
      ) {
        setUpdateAvailable(true);
        return;
      }

      // 检查热更新
      const update = await checkForUpdateAsync();
      setUpdateAvailable(update.isAvailable);

      if (update.isAvailable) {
        await fetchUpdateAsync();
        await reloadAsync();
      }
    } catch (error) {
      console.error(t("update.backgroundCheckFailed"), error);
    }
  };

  return {
    updating,
    updateAvailable,
    checkForUpdates,
    checkToUpdate,
    currentVersion,
  };
}

export default useAppUpdates;

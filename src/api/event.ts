import instance from "@/shared/providers/api";
import { Platform } from "react-native";

import DeviceInfo from "react-native-device-info";
import ReactNativeIdfaAaid from '@sparkfabrik/react-native-idfa-aaid';
import { requestTrackingPermission } from "react-native-tracking-transparency";

async function getIdfa() {
    if (Platform.OS !== 'ios') {
        return "";
    }

    try {
        const permissionResult = await requestTrackingPermission();

        const ok = permissionResult === 'authorized' || permissionResult === 'unavailable';

        if (ok) {
            const response = await ReactNativeIdfaAaid.getAdvertisingInfoAndCheckAuthorization(true)
            console.log(response)
            return response.id;
        }

        return "";
    } catch (error) {
        console.log('获取IDFA失败:', error);
        return "";
    }
}

import tracker from "@/shared/utils/tracker";

export const addEvent = async (params: {
    name: string,
    params?: { [key: string]: any };
}) => {
    return tracker.track(params.name, params.params);
};

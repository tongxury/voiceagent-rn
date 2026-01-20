import instance from "@/providers/api";
import {Platform} from "react-native";

import DeviceInfo from "react-native-device-info";
import ReactNativeIdfaAaid from '@sparkfabrik/react-native-idfa-aaid';
import {requestTrackingPermission} from "react-native-tracking-transparency";

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

export const addEvent = async (params: {
    name: string,
    params?: { [key: string]: any };
}) => {

    const data = {
        ...params,
        commonParams: {
            deviceId: (await DeviceInfo.getUniqueId()).toLowerCase(),
            platform: Platform.OS,
            idfa: await getIdfa(),
        }
    }

    console.log(data)



    return instance.request({
        url: `/api/bi/events`,
        method: "POST",
        data,
    });
};

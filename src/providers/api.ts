import { getConfig } from "@/config";
import { getAuthToken } from '@/utils';
import axios from 'axios';
import Constants from "expo-constants";
import { router } from 'expo-router';
import { Platform } from 'react-native';
import DeviceInfo from "react-native-device-info";
import { Toast } from 'react-native-toast-notifications';

const instance = axios.create({});

// 这是用法
// instance.request({
//     url: '',
//     params: {},
//     data: {}
// })

instance.interceptors.request.use(
    async function (config) {

        config.baseURL = getConfig().API_URL;

        const token = await getAuthToken();

        config.headers.set('Authorization', token || '');
        config.headers.set('Platform', Platform.OS);
        config.headers.set('Client-Version', Constants.expoConfig?.version || '');
        config.headers.set('Device-Id', (await DeviceInfo.getUniqueId()).toLowerCase());
        // config.headers.set('Client', 'user')
        // config.headers.set('Version', Constants.expoConfig.version ?? '')
        // config.headers.set('U-Version', conf.version)

        if (__DEV__) {
            console.log(`>>> [API Request] ${config.method?.toUpperCase()} ${ config.baseURL + (config.url || '')}`, {
                params: config.params,
                data: config.data,
            });
        }

        return config;
    },
    function (error) {
        if (__DEV__) {
            console.log(`>>> [API Request Error]`, error);
        }
        console.error(error);
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        if (__DEV__) {
            console.log(`<<< [API Response] ${response.config.method?.toUpperCase()} ${response.config.baseURL + (response.config.url || '')}`, response.data);
        }

        if (response.status !== 200) {

            Toast.show('服务器繁忙, 请稍后重试');
        } else {
            switch (response.data?.code) {
                case 'UNAUTHORIZED':
                    router.navigate('/login');
                    return Promise.reject(response.data.message || response.data.code);
                // case 10404:
                //     // nav.navigate('Store')
                //     break;
            }
            // if (response.data.code || response.data.message) {
            //     Toast.show(response.data.message || response.data.code);
            //     // console.error(response.data.error, response);
            //     return Promise.reject(response.data.message || response.data.code);
            // }
        }

        return response;
    },
    function (error) {
        if (__DEV__) {
            console.log(`<<< [API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
        }
        // console.error('provider/api', error);
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    },
);

export default instance;

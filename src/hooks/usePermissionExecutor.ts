import {useState, useEffect, useCallback, useRef} from 'react';
import * as Network from 'expo-network';
import {AppState} from 'react-native';
import {requestTrackingPermission} from "react-native-tracking-transparency";

export const usePermissionExecutor = ({onAllGranted, onElse}: {
    onAllGranted: () => void,
    onElse: () => void
}) => {

    // 检查追踪权限
    const checkTrackingPermission = useCallback(async () => {
        try {
            console.log('检查追踪权限...');
            const trackingStatus = await requestTrackingPermission();
            const hasPermission = trackingStatus === 'authorized' || trackingStatus === 'unavailable';

            if (hasPermission) {
                console.log('追踪权限已获取');
                return true;
            } else {
                console.log('追踪权限未获取');
                return false;
            }
        } catch (error) {
            console.error('检查追踪权限失败:', error);
            return false;
        }
    }, []);


    const checkNetworkPermission = useCallback(async () => {
        try {
            console.log('检查网络权限...');
            const networkState = await Network.getNetworkStateAsync();
            const hasPermission = networkState.isConnected;

            if (hasPermission) {
                console.log('网络权限已获取');
                return true;
            } else {
                console.log('网络权限未获取');
                return false;
            }
        } catch (error) {
            console.error('检查网络权限失败:', error);
            return false;
        }
    }, []);


    const check = async () => {

        const np = await checkNetworkPermission();
        const tp = await checkTrackingPermission();

        if (tp && np) {
            onAllGranted()
        } else {
            onElse()
        }
    }

    useEffect(() => {
        void check()
    }, []);

    return {};
};

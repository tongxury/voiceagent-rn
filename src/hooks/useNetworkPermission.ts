// hooks/useNetworkPermission.js
import {useState, useEffect, useCallback} from 'react';
import * as Network from 'expo-network';
import {AppState} from 'react-native';

export const useNetworkPermission = () => {
    const [networkReady, setNetworkReady] = useState(false);
    const [hasExecutedWithNetwork, setHasExecutedWithNetwork] = useState(false);
    const [networkState, setNetworkState] = useState(null);

    const checkNetworkPermission = useCallback(async () => {
        try {
            console.log('检查网络权限...');

            const networkState = await Network.getNetworkStateAsync();
            const isReachable = await Network.isInternetReachableAsync();

            setNetworkState(networkState);

            const hasPermission = networkState.isConnected && isReachable;

            if (hasPermission && !networkReady) {
                console.log('网络权限已获取');
                setNetworkReady(true);
            } else if (!hasPermission && networkReady) {
                console.log('网络权限丢失');
                setNetworkReady(false);
                setHasExecutedWithNetwork(false);
            }

            return hasPermission;
        } catch (error) {
            console.error('检查网络权限失败:', error);
            return false;
        }
    }, [networkReady]);

    const executeWithNetwork = useCallback(async (callback) => {
        if (networkReady && !hasExecutedWithNetwork) {
            console.log('网络权限已获取，执行回调...');
            try {
                await callback();
                setHasExecutedWithNetwork(true);
                console.log('网络权限获取后的回调执行完成');
            } catch (error) {
                console.error('网络权限获取后执行回调失败:', error);
            }
        }
    }, [networkReady, hasExecutedWithNetwork]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (nextAppState === 'active') {
                await checkNetworkPermission();
            }
        });

        checkNetworkPermission();

        return () => {
            subscription?.remove();
        };
    }, [checkNetworkPermission]);

    return {
        networkReady,
        hasExecutedWithNetwork,
        networkState,
        checkNetworkPermission,
        executeWithNetwork,
    };
};

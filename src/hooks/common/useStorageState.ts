import {useCallback, useEffect, useState, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useGlobal from "@/hooks/useGlobal";

export type UseStorageStateOptions<T> = {
    /**
     * Default value to use if no value is stored
     */
    defaultValue?: T;
    /**
     * Custom serializer function
     */
    serialize?: (value: T) => string;
    /**
     * Custom deserializer function
     */
    deserialize?: (value: string) => T;
};

export function useStorageState<T>(
    key: string,
    options: UseStorageStateOptions<T> = {}
): [T | undefined, (value: T | ((prevValue: T | undefined) => T)) => Promise<void>, boolean] {
    const {
        defaultValue,
        serialize = JSON.stringify,
        deserialize = JSON.parse,
    } = options;

    const [state, setState] = useState<T | undefined>(defaultValue);
    const [isLoading, setIsLoading] = useState(true);

    // 使用 ref 来保存最新的 state 值，避免闭包问题
    const stateRef = useRef<T | undefined>(state);
    stateRef.current = state;

    // Load initial value from storage
    useEffect(() => {
        const loadStoredValue = async () => {
            try {
                const storedValue = await AsyncStorage.getItem(key);
                if (storedValue !== null) {
                    const deserializedValue = deserialize(storedValue);
                    setState(deserializedValue);
                } else if (defaultValue !== undefined) {
                    setState(defaultValue);
                }
            } catch (error) {
                console.error(`Error loading value from storage for key "${key}":`, error);
                if (defaultValue !== undefined) {
                    setState(defaultValue);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredValue();
    }, [key, defaultValue, deserialize]);

    // Update storage and state with functional update support
    const setValue = useCallback(
        async (value: T | ((prevValue: T | undefined) => T)) => {
            try {
                // 使用 ref.current 获取最新的状态值
                const currentValue = stateRef.current;

                // Determine the new value
                const newValue = typeof value === 'function'
                    ? (value as (prevValue: T | undefined) => T)(currentValue)
                    : value;

                if (newValue === undefined || newValue === null) {
                    await AsyncStorage.removeItem(key);
                    setState(undefined);
                } else {
                    const serializedValue = serialize(newValue);
                    await AsyncStorage.setItem(key, serializedValue);
                    setState(newValue);
                }
            } catch (error) {
                console.error(`Error saving value to storage for key "${key}":`, error);
                throw error;
            }
        },
        [key, serialize] // 移除了 state 依赖
    );

    return [state, setValue, isLoading];
}

// Convenience hook for string values
export function useStorageStateString(
    key: string,
    defaultValue?: string
): [string | undefined, (value: string | ((prevValue: string | undefined) => string)) => Promise<void>, boolean] {
    return useStorageState(key, {
        defaultValue,
        serialize: (value: string) => value,
        deserialize: (value: string) => value,
    });
}

// Convenience hook for boolean values
export function useStorageStateBoolean(
    key: string,
    defaultValue?: boolean
): [boolean | undefined, (value: boolean | ((prevValue: boolean | undefined) => boolean)) => Promise<void>, boolean] {
    return useStorageState(key, {
        defaultValue,
        serialize: (value: boolean) => value.toString(),
        deserialize: (value: string) => value === 'true',
    });
}

// Convenience hook for number values
export function useStorageStateNumber(
    key: string,
    defaultValue?: number
): [number | undefined, (value: number | ((prevValue: number | undefined) => number)) => Promise<void>, boolean] {
    return useStorageState(key, {
        defaultValue,
        serialize: (value: number) => value.toString(),
        deserialize: (value: string) => Number(value),
    });
}

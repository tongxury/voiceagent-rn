import { StripeProvider } from "@stripe/stripe-react-native";
import useTailwindVars from "@/hooks/useTailwindVars";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { addEvent } from "@/api/event";
import ErrorFallback from "@/components/ErrorCallback";

import { usePermissionExecutor } from "@/hooks/usePermissionExecutor";
import { useSettings } from "@/hooks/useSettings";
import { useThemeMode } from "@/hooks/useThemeMode";
import AppThemeProvider from "@/providers/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";
import {
  PersistedClient,
  Persister,
  persistQueryClient,
  PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import {
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator
} from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-toast-notifications";

// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;
// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

export default function RootLayout() {
  const createAsyncStoragePersister = (): Persister => {
    return {
      persistClient: async (client: PersistedClient) => {
        try {
          await AsyncStorage.setItem(
            "REACT_QUERY_OFFLINE_CACHE",
            JSON.stringify(client)
          );
        } catch (error) {
          console.error("Error persisting cache:", error);
        }
      },
      restoreClient: async () => {
        try {
          const stringifiedClient = await AsyncStorage.getItem(
            "REACT_QUERY_OFFLINE_CACHE"
          );
          if (stringifiedClient) {
            return JSON.parse(stringifiedClient);
          }
        } catch (error) {
          console.error("Error restoring cache:", error);
        }
        return undefined;
      },
      removeClient: async () => {
        try {
          await AsyncStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
        } catch (error) {
          console.error("Error removing cache:", error);
        }
      },
    };
  };

  const persister = createAsyncStoragePersister();

  const queryClient = new QueryClient();

  persistQueryClient({
    queryClient: queryClient,
    persister,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    buster: "",
    hydrateOptions: undefined,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        // 只持久化特定的查询
        return ["myself", "items"].includes(query.queryKey[0] as string);
      },
    },
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ToastProvider>
        <SafeAreaProvider>
          <StripeProvider
            publishableKey="pk_live_KjsKZTP7GpgdW4PoYATjVfLK"
            merchantIdentifier="com.veogo.app"
          >
            <AppThemeProvider>
              <RootLayoutNav />
            </AppThemeProvider>
          </StripeProvider>
        </SafeAreaProvider>
      </ToastProvider>
    </PersistQueryClientProvider>
  );
}

function RootLayoutNav() {
  const { colors } = useTailwindVars();
  const router = useRouter();
  useThemeMode();

  const { fetchAsync: fetchSettings } = useSettings();

  const [appReady, setAppReady] = useState<boolean>(false);

  usePermissionExecutor({
    onAllGranted: () => {
      console.log("--------------- 权限已获取");
      void addEvent({ name: "visit" });
    },
    onElse: () => {
      void addEvent({ name: "visit" });
    },
  });
  // const {fetchAsync: fetchAccounts} = useAccounts();

  useEffect(() => {
    // SplashScreen.hideAsync();
    // void checkToUpdate();
    void load();
    // void addEvent({name: "visit"})
  }, []);

  const load = async () => {
    try {
      await fetchSettings();
    } catch (err) {
      console.error('fetchSettings error:', err);
    }

    // 检查是否完成引导
    let onboardingCompleted = 'true'; // 默认跳过引导
    try {
      onboardingCompleted = await AsyncStorage.getItem('onboarding_completed') || '';
    } catch (err) {
      console.error('AsyncStorage error:', err);
    }

    setAppReady(true);

    // 新用户跳转引导页
    if (onboardingCompleted !== 'true') {
      setTimeout(() => {
        router.replace('/onboarding');
      }, 100);
    }
  };

  // 显示自定义启动屏幕
  if (!appReady) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <SafeAreaView
          edges={["top", "bottom"]}
          style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View className="items-center justify-center">
            <View
              style={{
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
                elevation: 10,
              }}
              className="bg-card p-6 rounded-[40px] mb-8"
            >
              <Image
                source={require("../assets/images/app_icon.png")}
                style={{ width: 100, height: 100, borderRadius: 24 }}
              />
            </View>

          </View>
        </SafeAreaView>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
      </Stack>
    </ErrorBoundary>
  );
}

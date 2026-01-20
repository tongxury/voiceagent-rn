import { useEffect } from "react";
import { colorScheme } from "nativewind";

export type ThemeMode = "dark";

export const useThemeMode = () => {
  useEffect(() => {
    // 强制设置为暗色模式
    colorScheme.set("dark");
  }, []);

  const getThemeOptions = () => {
    return [
      { value: "dark", label: "darkTheme", icon: "moon" },
    ];
  };

  return {
    themeMode: "dark" as const,
    currentTheme: "dark" as const,
    changeTheme: () => {}, // 禁用切换
    getThemeOptions,
  };
};

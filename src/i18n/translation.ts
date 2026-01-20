import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from ".";
import useGlobal from "@/hooks/useGlobal";

const LANGUAGE_KEY = "@app_language";

export const useTranslation = () => {
    const {locale, setLocale} = useGlobal();

    useEffect(() => {
        loadSavedLanguage();
    }, []);

    const loadSavedLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
            if (savedLanguage) {
                i18n.locale = savedLanguage;
                setLocale(savedLanguage);
            } else {
                // 如果没有保存的语言，使用当前locale并同步到i18n
                i18n.locale = locale;
            }
        } catch (error) {
            console.error("Error loading saved language:", error);
        }
    };

    const changeLanguage = async (newLocale: string) => {
        try {
            // 先更新全局状态，这会触发所有组件重新渲染
            setLocale(newLocale);
            // 再更新i18n实例
            i18n.locale = newLocale;
            await AsyncStorage.setItem(LANGUAGE_KEY, newLocale);
        } catch (error) {
            console.error("Error saving language:", error);
        }
    };

    const t = (key: string, options?: any) => {
        return i18n.t(key, options);
    };

    return {
        t,
        locale,
        changeLanguage,
        availableLanguages: [
            {code: "en", name: "English"},
            {code: "zh", name: "中文"},
        ],

    };
};

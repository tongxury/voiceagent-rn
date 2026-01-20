import {I18n} from 'i18n-js';
import {getLocales} from 'expo-localization';
import en from './en';
import zh from './zh';

// 创建 i18n 实例
const i18n = new I18n({
    en,
    zh,
});

// 设置默认语言和回退语言
i18n.defaultLocale = 'zh';
i18n.locale = getLocales()[0].languageCode || 'zh';

// i18n.locale = Localization.getLocales();
i18n.enableFallback = true;

export default i18n;

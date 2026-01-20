import {dark} from '../tailwind.vars';

export default function useTailwindVars() {
    // 强制使用暗色主题配置
    const themeColors = dark;

    const colors: any = {};
    const fontSizes: any = {};

    const withAlpha = (rgb: string, alpha: number) => {
        if (!rgb) return `rgba(0,0,0,${alpha})`;
        if (rgb.startsWith('rgba')) return rgb;
        if (rgb.startsWith('rgb')) {
            return rgb.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
        }
        return rgb;
    };

    if (themeColors) {
        for (const key in themeColors) {
            if (Object.prototype.hasOwnProperty.call(themeColors, key)) {
                const val = (themeColors as any)[key];
                if (typeof val === 'string') {
                    const newKey = key.replace('--', '');
                    
                    if (val.includes(' ') && !val.includes('px')) {
                        colors[newKey] = `rgb(${val.trim().split(/\s+/).join(',')})`;
                    } else {
                        colors[newKey] = val;
                    }

                    if (val.includes('px')) {
                        fontSizes[newKey] = parseInt(val.replace("px", ""), 10);
                    } else if (val.includes(' ')) {
                        fontSizes[newKey] = parseInt(val.split(' ')[0], 10);
                    }
                }
            }
        }
    }

    // Legacy colors mapping for compatibility
    if (!colors.white) colors.white = 'rgb(255,255,255)';
    if (!colors.black) colors.black = 'rgb(0,0,0)';
    if (!colors.grey0) colors.grey0 = colors.neutral50 || 'rgb(255,255,255)';
    if (!colors.grey1) colors.grey1 = colors.neutral100 || 'rgb(243,244,246)';
    if (!colors.grey2) colors.grey2 = colors.neutral200 || 'rgb(209,213,219)';
    if (!colors.grey3) colors.grey3 = colors.neutral300 || 'rgb(186,190,197)';
    if (!colors.grey4) colors.grey4 = colors.neutral400 || 'rgb(156,163,175)';
    if (!colors.grey5) colors.grey5 = colors.neutral500 || 'rgb(107,114,128)';

    return {colors, fontSizes, withAlpha};
}

export { useTailwindVars };

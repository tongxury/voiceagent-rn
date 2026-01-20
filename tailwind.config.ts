/** @type {import('tailwindcss').Config} */

// 不能是 “@/colors” 打包会失败
import {light, dark} from "./src/tailwind.vars";

module.exports = {
    darkMode: "class",
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        "./src/app/**/*.{js,jsx,ts,tsx}",
        "./src/components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // --- Functional / Semantic Naming (Best Practice) ---
                background: "rgb(var(--background) / <alpha-value>)",
                foreground: "rgb(var(--foreground) / <alpha-value>)",
                
                primary: {
                    DEFAULT: "rgb(var(--primary) / <alpha-value>)",
                    foreground: "rgb(var(--primaryForeground) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
                    foreground: "rgb(var(--secondaryForeground) / <alpha-value>)",
                },
                muted: {
                    DEFAULT: "rgb(var(--muted) / <alpha-value>)",
                    foreground: "rgb(var(--mutedForeground) / <alpha-value>)",
                },
                accent: {
                    DEFAULT: "rgb(var(--accent) / <alpha-value>)",
                    foreground: "rgb(var(--accentForeground) / <alpha-value>)",
                },
                card: {
                    DEFAULT: "rgb(var(--card) / <alpha-value>)",
                    foreground: "rgb(var(--cardForeground) / <alpha-value>)",
                },
                
                border: "rgb(var(--border) / <alpha-value>)",
                input: "rgb(var(--input) / <alpha-value>)",
                ring: "rgb(var(--ring) / <alpha-value>)",
                
                success: "rgb(var(--success) / <alpha-value>)",
                warning: "rgb(var(--warning) / <alpha-value>)",
                error: "rgb(var(--error) / <alpha-value>)",

                // --- Neutral Scale (Design System) ---
                neutral: {
                    50: "rgb(var(--neutral50) / <alpha-value>)",
                    100: "rgb(var(--neutral100) / <alpha-value>)",
                    200: "rgb(var(--neutral200) / <alpha-value>)",
                    300: "rgb(var(--neutral300) / <alpha-value>)",
                    400: "rgb(var(--neutral400) / <alpha-value>)",
                    500: "rgb(var(--neutral500) / <alpha-value>)",
                    600: "rgb(var(--neutral600) / <alpha-value>)",
                    700: "rgb(var(--neutral700) / <alpha-value>)",
                    800: "rgb(var(--neutral800) / <alpha-value>)",
                    900: "rgb(var(--neutral900) / <alpha-value>)",
                    950: "rgb(var(--neutral950) / <alpha-value>)",
                },
            },
            fontWeight: {
                thin: "100",
                extralight: "200",
                light: "300",
                normal: "400",
                medium: "500",
                semibold: "600",
                bold: "700",
                extrabold: "800",
                black: "400",
            },
            fontSize: {
                xxs: "var(--fontSizeXXS)",
                xs: "var(--fontSizeXS)",
                sm: "var(--fontSizeSM)",
                md: "var(--fontSizeMD)",
                lg: "var(--fontSizeLG)",
                xl: "var(--fontSizeXL)",
            },
        },
    },
    plugins: [
        // Set a default value on the `:root` element
        ({addBase}: { addBase: (base: any) => void }) =>
            addBase({
                ":root": dark, // 默认使用暗色
                ".dark": dark,
            }),
    ],
};

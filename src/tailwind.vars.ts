export const light = {
    // --- Functional Colors ---
    "--background": "250 250 250",
    "--foreground": "55 65 81",
    "--primary": "4 120 87",
    "--primaryForeground": "255 255 255",
    "--secondary": "168 85 247",
    "--secondaryForeground": "255 255 255",
    "--muted": "245 245 245",
    "--mutedForeground": "107 114 128",
    "--accent": "240 240 240",
    "--accentForeground": "75 85 99",
    "--card": "255 255 255",
    "--cardForeground": "55 65 81",
    "--border": "209 213 219",
    "--input": "243 244 246",
    "--ring": "4 120 87",

    // --- Status Colors ---
    "--success": "34 197 94",
    "--warning": "245 158 11",
    "--error": "239 68 68",

    // --- Neutral Scale ---
    "--neutral50": "255 255 255",
    "--neutral100": "243 244 246",
    "--neutral200": "209 213 219",
    "--neutral300": "186 190 197",
    "--neutral400": "156 163 175",
    "--neutral500": "107 114 128",
    "--neutral600": "85 92 103",
    "--neutral700": "75 85 99",
    "--neutral800": "65 72 84",
    "--neutral900": "55 65 81",
    "--neutral950": "17 24 39",

    "--fontSizeXXS": "9px",
    "--fontSizeXS": "12px",
    "--fontSizeSM": "14px",
    "--fontSizeMD": "16px",
    "--fontSizeLG": "18px",
    "--fontSizeXL": "20px",
};

export const dark = {
    // --- Functional Colors ---
    "--background": "5 5 15", // Deep Midnight Blue
    "--foreground": "243 244 246",
    "--primary": "6 182 212", // Neon Cyan
    "--primaryForeground": "255 255 255",
    "--secondary": "139 92 246", // Neon Violet
    "--secondaryForeground": "255 255 255",
    "--muted": "20 20 40", // Muted Navy
    "--mutedForeground": "156 163 175",
    "--accent": "236 72 153", // Pink
    "--accentForeground": "255 255 255",
    "--card": "15 15 35", // Deep Card
    "--cardForeground": "243 244 246",
    "--border": "30 30 60",
    "--input": "25 25 50",
    "--ring": "6 182 212",

    // --- Status Colors ---
    "--success": "94 222 128",
    "--warning": "251 191 36",
    "--error": "248 113 113",

    // --- Neutral Scale ---
    "--neutral50": "31 31 31",
    "--neutral100": "31 31 31",
    "--neutral200": "75 85 99",
    "--neutral300": "92 101 114",
    "--neutral400": "107 114 128",
    "--neutral500": "156 163 175",
    "--neutral600": "186 193 202",
    "--neutral700": "209 213 219",
    "--neutral800": "228 232 237",
    "--neutral900": "243 244 246",
    "--neutral950": "255 255 255",

    "--fontSizeXXS": "9px",
    "--fontSizeXS": "12px",
    "--fontSizeSM": "14px",
    "--fontSizeMD": "16px",
    "--fontSizeLG": "18px",
    "--fontSizeXL": "20px",
};

// --- Types ---
type RemoveDashPrefix<T> = {
    [K in keyof T as K extends `--${infer R}` ? R : K]: T[K];
};

export type Theme = RemoveDashPrefix<typeof dark>;

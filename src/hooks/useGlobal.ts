import {create} from "zustand";
import {Account, Question, Settings, User} from "@/types";
import {localScenes} from "@/constants/scene";

interface AppState {
    settings: Settings;
    setSettings: (settings: Settings) => void;

    defaultAccount?: any;
    setDefaultAccount: (account?: any) => void;
    accounts?: Account[];
    setAccounts: (accounts: Account[]) => void;

    ongoingQuestion?: Question;
    setOngoingQuestion: (question?: Question) => void;

    user?: User
    setUser: (user: User) => void
    // 添加语言状态
    locale: string;
    setLocale: (locale: string) => void;

    [key: string]: any;
}


const useGlobal = create<AppState>((set) => ({
    settings: {
        scenes: [],
        titleMaxLength: 50,
        bodyMaxLength: 150,
        // prompts: defaultPromptConfigs,
    },
    setSettings: (settings: Settings) => {
        set({
            settings: {
                ...settings,
                scenes: settings.scenes,
            }
        })
    },
    setAccounts: (accounts: Account[]) => {
        set({defaultAccount: accounts?.filter((x) => x.isDefault)?.[0]});
        set({accounts});
    },

    setDefaultAccount: (account?: Account) => {
        set({defaultAccount: account});
    },
    setOngoingQuestion: (question?: Question) =>
        set({ongoingQuestion: question}),

    setUser: (user?: User) =>
        set({user: user}),

    // 语言状态管理
    locale: "zh", // 默认中文
    setLocale: (locale: string) => set({locale}),
}));

export default useGlobal;

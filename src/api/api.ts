import instance from "@/providers/api";
import {Account} from "@/types";
import {Platform} from "react-native";


export const fetchSignedUrl = (params: { bucket: string, fileKey: string }) => {
    return instance.request<any>({
        url: "/api/ag/oss/signed-url",
        params,
    });
};


export const fetchUploadToken = (params: { bucket: string }) => {
    return instance.request<any>({
        url: "/api/ag/qiniu/upload-token",
        params,
    });
};


export const listItems = ({
                              keyword,
                              category,
                              pageParam = 1,
                          }: {
    keyword?: string;
    category?: string;
    pageParam?: number;
}) => {
    return instance.request<any>({
        url: "/api/ag/v2/items",
        params: {
            cat: category,
            keyword,
            page: pageParam || 1,
        },
    });
};


export const listAccounts = (params: {}) => {
    return instance.request<any>({
        url: "/api/ag/accounts",
        params,
    });
};

export const addAccount = async (params: Account) => {
    return instance.request({
        url: `/api/ag/accounts`,
        method: "POST",
        data: params,
    });
};

export const getResourceByShareLink = async (params: { link: string }) => {
    return instance.request({
        url: `/api/ag/link-resources`,
        params: params,
    });
};

export const updateDefaultAccount = async ({id}: { id: string }) => {
    return instance.request({
        url: `/api/ag/accounts/${id}`,
        method: "PATCH",
        data: {
            action: "setDefault",
        },
    });
};

export const addSessionV2 = async (params: {
    sessionId: string;
    scene: string;
}) => {
    return instance.request({
        url: `/api/ag/v2/sessions`,
        method: "POST",
        data: params,
    });
};

export const addSessionV3 = async (params: {
    sessionId: string;
    scene: string;
    resource?: any;
    resources?: any[];
    version?: string;
}) => {
    return instance.request({
        url: `/api/ag/v3/sessions`,
        method: "POST",
        data: params,
    });
};

export const addQuestion = async (params: {
    sessionId: string;
    prompt: any;
    profile?: any;
    scene: string;
    retry?: boolean;
}) => {
    return instance.request({
        url: `/api/ag/v1/questions`,
        method: "POST",
        data: {
            ...params,
        },
    });
};

export const appendQuestion = async (params: {
    sessionId: string;
    prompt: any;
    profile?: any;
}) => {
    return instance.request({
        url: `/api/ag/v1/append-questions`,
        method: "POST",
        data: {
            ...params,
        },
    });
};


export const retryQuestion = async (params: { questionId: string }) => {
    return instance.request({
        url: `/api/ag/v1/re-questions`,
        method: "POST",
        data: params
    });
};

export const quickSessions = async (params: { itemId: string }) => {
    return instance.request({
        url: `/api/ag/v1/quick-sessions`,
        method: "POST",
        data: params,
    });
};

export const getSession = ({id}: { id: any }) => {
    return instance.request<any>({
        url: `/api/ag/v1/sessions/${id}`,
    });
};

export const getSettings = () => {
    return instance.request<any>({
        url: `/api/v1/app-settings`,
    });
};

// todo peter 添加进入app自动检查更新(开屏页之后)
export const getAppVersion = () => {
    return instance.request<any>({
        url: `/api/v1/app-version`,
    });
};

export const listSessions = (params: { scene?: string; state?: string, page: number, size?: number }) => {
    return instance.request<any>({
        url: `/api/ag/v1/sessions`,
        params: {...params, page: params.page || 1},
    });
};

export const listQuestions = (params: {
    sessionId?: string,
    startTs?: number,
    ongoing?: boolean,
    sort?: string
}) => {
    return instance.request<any>({
        url: `/api/ag/v1/questions`,
        params,
    });
};


// export const listItems = (params: { category: string, page: number }) => {
//     return instance.request<any>({
//         url: '/api/ag/v2/items',
//         params
//     })
// }

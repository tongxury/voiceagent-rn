import instance from "@/providers/api";


export const getPhoneAuthToken = async (params: {
    phone: string;
    code: string;
}) => {
    return instance.request<any>({
        url: "/api/usr/auth-tokens",
        params,
    });
};

export const getUser = () => {
    return instance.request<any>({
        url: `/api/usr/users/me`,
    });
};

export const sendVerifyCode = async (params: { phone: string }) => {
    return instance.request<any>({
        url: "/api/usr/auth-codes",
        method: "POST",
        data: params,
    });
};


export const getEmailAuthToken = (params: { email: string; code: string }) => {
    return instance.request<any>({
        url: `/api/v1/email-auth-tokens`,
        params,
    });
};

export const getAppleAuthToken = (params: { [key: string]: any }) => {
    return instance.request<any>({
        url: `/api/v1/apple-auth-tokens`,
        params,
    });
};

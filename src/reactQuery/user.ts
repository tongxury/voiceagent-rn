import {useMutation, useQuery} from "@tanstack/react-query";
import {
    getEmailAuthToken,
    getPhoneAuthToken,
    sendVerifyCode,
} from "@/api/auth";
import {setAuthToken} from "@/utils";

export const useLoginWithEmail = () => {
    return useMutation({
        mutationFn: getEmailAuthToken,
        onSuccess: async (response) => {
            // 假设登录接口返回的数据中包含 token
            if (response.data.data.token) {
                await setAuthToken(response.data.data.token);
            }
        },
    });
};
export const useLoginWithPhone = () => {
    return useMutation({
        mutationFn: getPhoneAuthToken,
        onSuccess: async (response) => {
            // 假设登录接口返回的数据中包含 token
            if (response.data.data.token) {
                await setAuthToken(response.data.data.token);
            }
        },
    });
};


export const useSendCodeWithPhone = () => {
    return useMutation({
        mutationFn: sendVerifyCode,
    });
};

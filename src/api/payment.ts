import instance from '@/shared/providers/api';

export const fetchCreditState = () => {
    return instance.request<any>({
        url: "/api/crd/credit-states",
    });
};

export const fetchMemberState = () => {
    return instance.request<any>({
        url: "/api/mem/member-states",
    });
};


export const fetchPaymentState = () => {
    return instance.request<any>({
        url: `/api/pa/payment-state`,
    });
};

export const fetchPaymentMetadata = () => {
    return instance.request<any>({
        url: `/api/pa/payment-metadata`,
    });
};


export const fetchPaymentIntent = async (params: {
    planId: string;
}) => {
    return instance.request<any>({
        url: `/api/pa/v1/payment-intents`,
        params: params
    });
};


export const callbackApple = async (params: {
    productId: string;
    transactionId?: string
    transactionReceipt: string
    purchaseToken?: string
}) => {
    return instance.request<any>({
        url: `/api/pa/v1/pay/apple-callback`,
        method: "POST",
        data: params
    });
};

export const callbackAppleBilling = async (params: {
    productId: string;
    transactionReceipt: string
}) => {
    return instance.request<any>({
        url: `/api/bill/apple-callback`,
        method: "POST",
        data: params
    });
};


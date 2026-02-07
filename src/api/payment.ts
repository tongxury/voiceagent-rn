import instance from '@/shared/providers/api';

export const fetchCreditState = () => {
    return instance.request<any>({
        url: "/api/pa/credit-state",
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


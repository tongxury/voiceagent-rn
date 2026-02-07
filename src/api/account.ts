import instance from "@/shared/providers/api";


export const bindAccount = (params: { platform: string, keyword: string }) => {
    return instance.request<any>({
        url: "/api/ag/bind-accounts",
        method: "POST",
        data: params,
    });
};


export const updateAccount = async ({ id }: { id?: string }) => {
    return instance.request({
        url: `/api/ag/accounts/${id}`,
        method: "PATCH",
        data: {
            action: "update",
        },
    });
};


export const deleteAccount = async ({ id }: { id?: string }) => {
    return instance.request({
        url: `/api/ag/accounts/${id}`,
        method: "PATCH",
        data: {
            action: "delete",
        },
    });
};

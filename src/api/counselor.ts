import instance from '@/shared/providers/api';

export const listCounselors = (params: {}) => {
    return instance.request<any>({
        url: "/api/cs/v1/counselors",
        params,
    });
};

export const getCounselor = ({ id }: { id: string }) => {
    return instance.request<any>({
        url: `/api/cs/v1/counselors/${id}`,
    })
}

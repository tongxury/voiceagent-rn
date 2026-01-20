import instance from "@/providers/api";


export const listComments = (params: { expertId?: string, category?: string, page: number }) => {
    return instance.request<any>({
        url: '/api/ep/v1/comments',
        params: params
    })
}


export const listExperts = ({category, page}: { category: string, page: number }) => {
    return instance.request<any>({
        url: '/api/ep/v1/experts',
        params: {
            category: category,
            page,
        }
    })
}

export const getExpert = ({id}: { id: string }) => {
    return instance.request<any>({
        url: `/api/ep/v1/experts/${id}`,
    })
}

export const getMeeting = ({id}: { id: string }) => {
    return instance.request<any>({
        url: `/api/ep/v1/meetings/${id}`,
    })
}

export const addMeeting = (params: { expertId: string, topic: string, by: string }) => {
    return instance.request<any>({
        method: 'POST',
        url: `/api/ep/v1/meetings`,
        data: params
    })
}


export const updateMeetingQuestion = (params: { id: string, question: string }) => {
    return instance.request<any>({
        method: 'PATCH',
        url: `/api/ep/v1/meetings/${params.id}/question`,
        data: params
    })
}


// export const listItems = (params: { category: string, page: number }) => {
//     return instance.request<any>({
//         url: '/api/ag/v2/items',
//         params
//     })
// }

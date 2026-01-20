

export const parse = (data: any) => {
    return data?.pages?.map((page: any) => page?.data?.data?.list || [])
        .flat() || []
}

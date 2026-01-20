import { QueryKey, useInfiniteQuery, UseInfiniteQueryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from 'react';

export function useQueryData<
    TQueryFnData = any,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
    const query = useQuery(options);

    // 自动提取数据：解开 AxiosResponse.data 和 ServerPayload.data
    const data = useMemo(() => {
        const axiosData = (query.data as any)?.data;
        // 自动兼容两种情况：
        // A. 直接返回业务数据
        // B. 返回标准结构 { code, data: { ... } }
        return (axiosData && typeof axiosData === 'object' && 'data' in axiosData) 
            ? axiosData.data 
            : axiosData;
    }, [query.data]);

    // 稳定返回对象，防止触发 React 的死循环
    return useMemo(() => ({
        ...query,
        data
    }), [query, data]);
}

/**
 * 包装 useInfiniteQuery，自动提取分页列表数据并展平
 */
export function useInfiniteQueryData<
    TQueryFnData = any,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(options: UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
    const query = useInfiniteQuery(options as any);

    // 自动展平数据：处理多页数据并提取 list 字段
    const list = useMemo(() => {
        if (!query.data || !query.data.pages) return [];
        
        return query.data.pages.flatMap((page: any) => {
            // 1. 提取 AxiosResponse.data
            const serverPayload = page?.data;
            
            // 2. 提取业务数据 (兼容 { code, data: { list: [] } } 和 { list: [] })
            const businessData = (serverPayload && typeof serverPayload === 'object' && 'data' in serverPayload)
                ? serverPayload.data
                : serverPayload;
                
            // 3. 返回列表，优先取 list 字段，否则取 businessData 本身（假设它就是数组）
            if (businessData && typeof businessData === 'object' && 'list' in businessData) {
                return businessData.list || [];
            }
            return Array.isArray(businessData) ? businessData : [];
        });
    }, [query.data]);

    // 稳定返回对象
    return useMemo(() => ({
        ...query,
        list
    }), [query, list]);
}

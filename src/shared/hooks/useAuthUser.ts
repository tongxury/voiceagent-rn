import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/auth';
import useGlobal from '@/hooks/useGlobal';
import { useEffect } from "react";


export const useAuthUser = (options?: { fetchImmediately?: boolean }) => {

    const { user, setUser } = useGlobal();

    const { isLoading, refetch } = useQuery({
        queryKey: ['authUser'],
        queryFn: () => getUser(),
        // staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: false,
    });

    // useEffect(() => {
    //
    // }, []);

    useEffect(() => {
        if (options?.fetchImmediately) {
            refreshUser()
        }
    }, [])


    const refreshUser = () => {
        return refetch().then((res) => {
            const axiosResponse = res?.data;
            const responseBody = axiosResponse?.data;

            let userData = responseBody;
            // Check if responseBody has a 'data' property (standard API wrapper)
            if (responseBody && typeof responseBody === 'object' && 'data' in responseBody) {
                userData = responseBody.data;
            }

            if (userData) {
                setUser(userData);
            } else {
                setUser(undefined)
            }
            return userData;
        });
    };

    return {
        isLoading,
        user,
        setUser,
        refreshUser,
    };
};

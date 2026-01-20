import {useQuery} from '@tanstack/react-query';
import {listAccounts} from '@/api/api';
import useGlobal from '@/hooks/useGlobal';
import {useStorageState} from "@/hooks/useGlobalStorageState";
import {Account} from "@/types";


export const useAccounts = () => {

    const {accounts, setAccounts, defaultAccount, setDefaultAccount} = useGlobal();

    const [storeValue, setStoreValue,] = useStorageState<any>("defaultAccount");

    const set = (account?: Account) => {
        setDefaultAccount(account);
        void setStoreValue(account);
    }

    const {isLoading, refetch} = useQuery({
        queryKey: ['accounts'],
        queryFn: () => listAccounts({}),
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: false,
    });

    const fetch = () => {
        refetch().then((data) => {
            setAccounts(data?.data?.data?.data?.list || []);
        });
    };

    const fetchAsync = async () => {
        const data = await refetch();
        setAccounts(data?.data?.data?.data?.list || []);
        return data?.data?.data?.data?.list || [];
    };


    return {
        defaultAccount,
        setDefaultAccount: set,
        accounts,
        setAccounts,
        isLoading,
        fetch,
        fetchAsync,
    };
};

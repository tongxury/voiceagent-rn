import {useQuery} from "@tanstack/react-query";
import {getSettings} from "@/api/api";
import useGlobal from "@/hooks/useGlobal";
import {Scene} from "@/types";
import {localScenes} from "@/constants/scene";
import { localPrompts } from "@/constants/prompt";

export const useSettings = () => {
    // const {defaultAccount, accounts, setAccounts} = useGlobal();
    //
    // const {isLoading, refetch} = useQuery({
    //     queryKey: ['accounts'],
    //     queryFn: () => listAccounts({}),
    //     staleTime: 60 * 60 * 1000,
    //     refetchOnWindowFocus: false,
    //     enabled: false,
    // });

    const {settings, setSettings} = useGlobal();

    // const {refetch, isLoading} = useQuery({
    //     queryKey: ["settings"],
    //     queryFn: () => getSettings(),
    //     staleTime: 60 * 60 * 1000,
    //     refetchOnWindowFocus: false,
    //     enabled: false,
    // });

    const fetch = async () => {

        // const data = await refetch()

        // const serverSettings = data?.data?.data?.data;

        // console.log('serverSettings', serverSettings);
        // 合并配置，使用本地的 scenes 配置（包含翻译键）
        const mergedSettings = {
            // ...serverSettings,
            scenes: Object.values(localScenes),
            prompts: Object.values(localPrompts),
            // scenes: serverSettings?.scenes?.map((x: Scene) => ({
            //     ...x, ...localScenes[x.value]
            // })),

        };
        setSettings(mergedSettings);
    };

    //
    // const settings = useMemo(() => sr?.data?.data, [sr]);
    //
    // useEffect(() => {
    //     if (sr?.data?.data) {
    //         setSettings(sr?.data?.data);
    //     }
    // }, [sr]);

    // useEffect(() => {
    //     refetch().then((data) => {
    //         setSettings(data?.data?.data?.data);
    //     });
    // }, []);

    // useFocusEffect(useCallback(() => {
    //     refetch().then((data) => {
    //         setAccounts(data?.data?.data?.data?.list || []);
    //     });
    // }, []));

    // useEffect(() => {
    //     setDefaultAccount(data?.data?.data?.list?.filter((item: Account) => item.isDefault)?.[0]);
    // }, [data]);

    return {
        settings,
        getPromptConfig: (promptId: string) => {
            return settings?.prompts?.filter(
                (x: any) => x.promptId === promptId
            )?.[0];
        },
        // isLoading,
        fetchAsync: fetch,
    };
};

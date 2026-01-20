import {View, Text, ScrollView} from "react-native";
import useAppUpdate from "@/hooks/useAppUpdate";
import ScreenContainer from "@/shared/components/ScreenContainer";


const Debug = () => {

    const {channel, runtimeVersion, currentVersion} = useAppUpdate()

    return (
        <ScreenContainer edges={['top']}>
            <ScrollView className="flex-1 bg-background">
                <Text className={'text-foreground'}>channel: {JSON.stringify(channel)}</Text>
                <Text className={'text-foreground'}>runtimeVersion: {JSON.stringify(runtimeVersion)}</Text>
                <Text className={'text-foreground'}>currentVersion: {JSON.stringify(currentVersion)}</Text>
            </ScrollView>
        </ScreenContainer>
    )
}

export default Debug;

import {isIos} from "@/utils";
import IOS from "./IOS";
// import Android from "@/app/pricing/Android";
import {Text, View} from "react-native";
import {useTranslation} from "@/i18n/translation";

const Pricing = () => {
    const {t} = useTranslation();

    if (!isIos) {
        return <View className="flex-1 items-center justify-center bg-black">
            <Text className="text-white">{t('payment.androidNotSupported')}</Text>
        </View>
    }

    return <IOS/>;
};

export default Pricing;

import React from "react";
import {View, ScrollView, Image, Dimensions} from "react-native";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { useTranslation } from "@/i18n/translation";

export default function CommunityScreen() {
    const { t } = useTranslation();
    const screenWidth = Dimensions.get("window").width;
    const imageSize = screenWidth * 0.8;

    return (
        <ScreenContainer edges={['top']} stackScreenProps={{ headerShown: true, title: t('common.communityTitle') }}>
            <ScrollView className="flex-1 bg-background">
                <View className="p-5 items-center">
                    <View className="items-center mb-8 mt-10">
                        <Image
                            source={{uri: 'https://veogoresources.s3.cn-north-1.amazonaws.com.cn/support/support.jpg'}}
                            style={{
                                width: imageSize,
                                height: imageSize * 2,
                                borderRadius: 12,
                            }}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

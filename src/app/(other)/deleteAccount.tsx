import React from "react";
import {View, Text, ScrollView} from "react-native";
import {useTranslation} from "@/i18n/translation";
import ScreenContainer from "@/shared/components/ScreenContainer";


export default function Screen() {
    const {t} = useTranslation();

    return (
        <ScreenContainer edges={['top']} stackScreenProps={{ headerShown: true, title: t('common.deleteAccountTitle') }}>
            <ScrollView className="flex-1 bg-background">

            </ScrollView>
        </ScreenContainer>
    );
}

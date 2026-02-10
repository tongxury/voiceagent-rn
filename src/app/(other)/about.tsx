import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "@/i18n/translation";
import ScreenContainer from "@/shared/components/ScreenContainer";

interface Feature {
  titleKey: string;
  itemKeys: string[];
}

const features: Feature[] = [
  {
    titleKey: "empathicInteraction",
    itemKeys: [
      "empathicInteractionItem1",
      "empathicInteractionItem2",
      "empathicInteractionItem3",
    ],
  },
  {
    titleKey: "emotionalInsight",
    itemKeys: ["emotionalInsightItem1", "emotionalInsightItem2"],
  },
  {
    titleKey: "techInnovation",
    itemKeys: ["techInnovationContent"],
  },
];

export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <ScreenContainer edges={['top']} stackScreenProps={{ headerShown: true, title: t('common.aboutTitle') }}>
      <ScrollView className="flex-1 bg-background">
        {/* 顶部标题区域 */}
        <View className="items-center py-8">
          <Text className="text-2xl font-bold text-foreground mb-3">
            {t("aboutAppTitle")}
          </Text>
          <Text className="text-base text-muted-foreground">{t("aboutSubtitle")}</Text>
        </View>

        {/* 关于我们 */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-bold text-foreground mb-4">
            {t("aboutUsSection")}
          </Text>
          <Text className="text-muted-foreground text-sm leading-6">
            {t("aboutUsContent")}
          </Text>
        </View>

        {/* 功能特点 */}
        {features.map((feature, index) => (
          <View key={index} className="px-4 mb-8">
            <Text className="text-lg font-bold text-foreground mb-4">
              {t(feature.titleKey)}
            </Text>
            <View className="space-y-3">
              {feature.itemKeys.map((itemKey, itemIndex) => (
                <Text key={itemIndex} className="text-muted-foreground text-sm leading-6">
                  {t(itemKey)}
                </Text>
              ))}
            </View>
          </View>
        ))}

        {/* 使命 */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-bold text-foreground mb-4 text-center">
            {t("ourMission")}
          </Text>
          <Text className="text-base text-muted-foreground text-center mb-3">
            {t("missionTitle")}
          </Text>
          <Text className="text-sm text-muted-foreground leading-6">
            {t("missionContent")}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

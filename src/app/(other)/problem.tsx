import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "@/i18n/translation";
import { useConsecutiveClicks } from "@/hooks/useConsecutiveClicks";
// import {router} from "expo-router";
import useProtectedRoute from "@/shared/hooks/useProtectedRoute";
import protectedRoutes from "@/constants/protected_routes";
import ScreenContainer from "@/shared/components/ScreenContainer";

interface FAQ {
    questionKey: string;
    answerKey: string;
}

const faqs: FAQ[] = [
    {
        questionKey: "faqQuestion1",
        answerKey: "faqAnswer1",
    },
    {
        questionKey: "faqQuestion2",
        answerKey: "faqAnswer2",
    },
    {
        questionKey: "faqQuestion3",
        answerKey: "faqAnswer3",
    },
    {
        questionKey: "faqQuestion4",
        answerKey: "faqAnswer4",
    },
    {
        questionKey: "faqQuestion5",
        answerKey: "faqAnswer5",
    },
];

export default function ProblemScreen() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const { t } = useTranslation();
    const router = useProtectedRoute({ protectedRoutePrefixes: protectedRoutes });

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handlePress = useConsecutiveClicks(7, () => {
        router.navigate({ pathname: "/debug" });
    });

    return (
        <ScreenContainer edges={['top']} stackScreenProps={{ headerShown: true, title: "常见问题" }}>
            <ScrollView className="flex-1 bg-background">
                <View className="p-5">

                    <Pressable onPress={handlePress}>
                        <Text className="text-2xl font-bold text-foreground mb-6">
                            {t("faqTitle")}
                        </Text>
                    </Pressable>

                    {faqs.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => toggleExpand(index)}
                            className="mb-4"
                        >
                            <View className="bg-card/70 rounded-xl p-4">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-foreground text-base flex-1 mr-2">
                                        {t(faq.questionKey)}
                                    </Text>
                                    <AntDesign
                                        name={expandedIndex === index ? "minus" : "plus"}
                                        size={20}
                                        color="#666"
                                    />
                                </View>

                                {expandedIndex === index && (
                                    <View className="mt-3 pt-3 border-t border-border/10">
                                        <Text className="text-muted-foreground text-sm leading-6">
                                            {t(faq.answerKey)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

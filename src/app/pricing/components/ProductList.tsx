import React, { useCallback, useMemo, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView, Modal, SafeAreaView, StyleSheet, Alert } from "react-native";
import { useTranslation } from "@/i18n/translation";
import Button from "@/components/ui/Button";
import { FlashIcon } from "@/constants/scene_icons";
import { useColors } from "@/hooks/useColors";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { fetchCreditState, fetchMemberState } from "@/api/payment";
import { router, useFocusEffect } from "expo-router";
import useDateFormatter from "@/hooks/useDateFormatter";
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenContainer from "@/shared/components/ScreenContainer";
import { BlurView } from "expo-blur";
import { 
    PricingPlan, 
    PricingPackage, 
    PlanChangeType, 
    getPlanChangeInfo,
    MemberState,
    CreditState 
} from "../types/SubscriptionTypes";

// Consolidated pricing data
export const PRICING_DATA = {
    plans: [
        {
            id: "l1_monthly",
            amount: 38,
            mode: "recurring" as const,
            creditPerMonth: 500,
            features: ['standardVoice', 'sessionMemory', 'basicSupport']
        },
        {
            id: "l2_monthly",
            amount: 98,
            mode: "recurring" as const,
            creditPerMonth: 1500,
            tag: "popular" as const,
            features: ['hdVoice', 'proModel', 'customAgent', 'priorityLink']
        },
        {
            id: "l3_monthly",
            amount: 399,
            mode: "recurring" as const,
            creditPerMonth: 7000,
            features: ['ultimateModel', 'unlimitedMemory', 'expertConsultant', 'strategySharing']
        },
    ],
    packages: [
        {
            id: "l1_pkg",
            amount: 48,
            creditPerMonth: 500,
            mode: "addon" as const
        },
        {
            id: "l2_pkg",
            amount: 158,
            creditPerMonth: 2000,
            mode: "addon" as const
        },
        {
            id: "l3_pkg",
            amount: 358,
            creditPerMonth: 5000,
            mode: "addon" as const
        },
        {
            id: "l4_pkg",
            amount: 358,
            creditPerMonth: 5000,
            mode: "addon" as const
        },
    ]
}


export function ProductList({ 
    onSubmit, 
    disabled, 
    loading,
    onPurchaseSuccess
}: { 
    onSubmit: (plan: any) => void,
    disabled?: boolean,
    loading?: boolean,
    onPurchaseSuccess?: () => void
}) {
    const { t } = useTranslation();
    const { formatFromNow } = useDateFormatter()
    const colors = useColors()

    // Fetch member and credit state
    const { data: memberState, isLoading: loadingMember, refetch: refetchMember } = useQueryData({
        queryKey: ['memberState'],
        queryFn: fetchMemberState
    })
    
    const { data: creditState, isLoading: loadingCredit, refetch: refetchCredit } = useQueryData({
        queryKey: ["creditState"],
        queryFn: fetchCreditState,
        staleTime: 60 * 60 * 1000,
    });

    const [showTopUp, setShowTopUp] = useState(false);
    const [showCompare, setShowCompare] = useState(false);
    const [showChangeConfirm, setShowChangeConfirm] = useState(false);

    // Computed states
    const isMember = useMemo(() => memberState?.isActive, [memberState])
    
    const displayPackages = useMemo(() => PRICING_DATA.packages.map(p => ({
        ...p,
        title: t(`payment.${p.id}`),
    })), [t])

    const plans = useMemo(() => PRICING_DATA.plans.map(p => ({
        ...p,
        title: t(`payment.${p.id}`),
    })), [t])

    // Current active plan
    const activePlan = useMemo(() => {
        if (!isMember || !memberState?.planId) return null;
        return plans.find(p => p.id === memberState.planId) || null;
    }, [isMember, memberState?.planId, plans])

    // Selected plan (for purchase/change)
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

    // Auto-select current plan or popular plan on mount
    // 使用 ref 来跟踪是否已经初始化，避免依赖 selectedPlan 导致死循环
    const hasInitialized = React.useRef(false);
    
    React.useEffect(() => {
        if (hasInitialized.current) return;
        
        if (activePlan) {
            setSelectedPlan(activePlan);
            hasInitialized.current = true;
        } else if (plans.length > 1) {
            // Default to popular plan (index 1)
            setSelectedPlan(plans[1]);
            hasInitialized.current = true;
        }
    }, [activePlan, plans]);

    // 购买完成后刷新数据
    const prevLoadingRef = React.useRef(loading);
    React.useEffect(() => {
        // 检测从 loading=true 变为 loading=false (购买流程完成)
        if (prevLoadingRef.current && !loading) {
            console.log('[ProductList] Purchase completed, refreshing data...');
            
            // 刷新会员和积分状态
            refetchMember();
            refetchCredit();
            
            // 调用回调通知父组件
            onPurchaseSuccess?.();
        }
        
        prevLoadingRef.current = loading;
    }, [loading, refetchMember, refetchCredit, onPurchaseSuccess]);

    // Calculate plan change info
    const planChangeInfo = useMemo(() => {
        if (!activePlan || !selectedPlan || activePlan.id === selectedPlan.id) {
            return null;
        }
        return getPlanChangeInfo(activePlan, selectedPlan);
    }, [activePlan, selectedPlan])

    // Refetch on focus
    useFocusEffect(useCallback(() => {
        void refetchCredit()
        void refetchMember()
    }, [refetchCredit, refetchMember]))

    /**
     * 处理提交订阅/变更
     */
    function handleSubmit(item?: any) {
        const plan = item || selectedPlan;
        if (!plan) return;

        // 如果是充值套餐,检查是否已订阅
        if (plan.mode === 'addon' && !isMember) {
            Alert.alert(t('payment.errorTitle'), t('payment.needSubscriptionFirst'));
            return;
        }

        // 如果是计划变更,显示确认对话框
        if (isMember && plan.mode === 'recurring' && plan.id !== activePlan?.id && planChangeInfo) {
            setShowChangeConfirm(true);
            return;
        }

        // 直接提交
        onSubmit(plan);
    }

    /**
     * 确认计划变更
     */
    function confirmPlanChange() {
        setShowChangeConfirm(false);
        if (selectedPlan) {
            onSubmit(selectedPlan);
        }
    }

    /**
     * 使用进度条组件
     */
    function UsageProgress({ remaining, total }: { remaining: number, total: number }) {
        const percentage = total > 0 ? Math.min(100, (remaining / total) * 100) : 0;
        return (
            <View className="mt-4">
                <View className="flex-row justify-between mb-2">
                    <Text className="text-white/40 text-xs">{t('payment.usage')}</Text>
                    <Text className="text-white font-bold text-xs">{percentage.toFixed(0)}%</Text>
                </View>
                <View className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <View className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                </View>
            </View>
        );
    }

    /**
     * 计划卡片组件
     */
    function PlanCard({ plan, isSelected, onPress }: { 
        plan: PricingPlan, 
        isSelected: boolean, 
        onPress: () => void 
    }) {
        const isPopular = plan.tag === 'popular';
        const isActivePlan = activePlan?.id === plan.id;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={onPress}
                style={{ width: 280 }}
            >
                <LinearGradient
                    colors={isSelected
                        ? ['rgba(59, 130, 246, 0.3)', 'rgba(147, 51, 234, 0.3)']
                        : ['#1E293B', '#1E293B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 24, padding: 2 }}
                >
                    <View className="rounded-[22px] p-6 bg-[#0F172A]" style={{ minHeight: 400, justifyContent: 'space-between' }}>
                        <View>
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className={`text-xl font-black ${isSelected ? 'text-primary' : 'text-white'}`}>
                                    {plan.title}
                                </Text>
                                {isPopular && (
                                    <View className="bg-primary px-3 py-1 rounded-full">
                                        <Text className="text-white text-[10px] font-bold uppercase">{t('payment.popular')}</Text>
                                    </View>
                                )}
                            </View>

                            {isActivePlan && (
                                <View className="flex-row items-center gap-1 mb-2">
                                    <MaterialCommunityIcons name="crown" size={14} color="#FBBF24" />
                                    <Text className="text-yellow-400 text-xs font-medium">{t('payment.currentPlan')}</Text>
                                </View>
                            )}

                            <View className="flex-row items-baseline gap-1 mb-6">
                                <Text className="text-white text-4xl font-black">¥{plan.amount}</Text>
                                <Text className="text-white/40 text-sm">/ {t('payment.monthLabel')}</Text>
                            </View>

                            <View className="h-[1px] bg-white/5 mb-6" />
                            <Text className="text-white/80 font-bold mb-4">{plan.creditPerMonth} {t('payment.credits')}</Text>
                            
                            <View className="gap-3">
                                {(plan.features || []).map((feat: string) => (
                                    <View key={feat} className="flex-row items-center gap-2">
                                        <Feather name="check" size={14} color={colors.primary} />
                                        <Text className="text-white/50 text-xs">{t(`payment.features.${feat}`)}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {isSelected ? (
                            <View className="mt-8 flex-row items-center justify-center gap-2 bg-primary/10 py-3 rounded-2xl border border-primary/20">
                                <Feather name="check-circle" size={16} color={colors.primary} />
                                <Text className="text-primary font-bold text-sm">{t('payment.selected')}</Text>
                            </View>
                        ) : (
                            <View className="mt-8 py-3 rounded-2xl border border-white/10 items-center justify-center">
                                <Text className="text-white/40 font-bold text-sm">{t('payment.selectThis')}</Text>
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    /**
     * 渲染计划列表
     */
    function renderPlans() {
        return (
            <View className="gap-6 pb-12">
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 24, gap: 16 }}
                >
                    {plans.map((plan: PricingPlan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            isSelected={selectedPlan?.id === plan.id}
                            onPress={() => setSelectedPlan(plan)}
                        />
                    ))}
                </ScrollView>
                <TouchableOpacity 
                    onPress={() => setShowCompare(true)}
                    className="flex-row items-center justify-center gap-2 bg-white/5 py-4 rounded-2xl border border-white/10"
                >
                    <Feather name="layers" size={16} color={colors.primary} />
                    <Text className="text-white font-bold">{t('payment.compareAll')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    /**
     * 会员仪表板(订阅后状态)
     */
    function renderMembershipDashboard() {
        return (
            <View className="gap-6">
                {/* Balance Card */}
                <View className="rounded-3xl border border-white/10 shadow-xl overflow-hidden">
                    <LinearGradient
                        colors={['#1E293B', '#0F172A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ padding: 24, overflow: 'hidden' }}
                    >
                        <BlurView 
                            intensity={30} 
                            tint="dark" 
                            style={StyleSheet.absoluteFill}
                        />
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                                    <FlashIcon size={20} color={colors.primary} />
                                </View>
                                <Text className="text-white/70 text-base font-medium">
                                    {t('payment.balance')}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                onPress={() => {
                                    setSelectedPlan(displayPackages[0] as any);
                                    setShowTopUp(true);
                                }}
                                className="bg-primary px-4 py-2 rounded-full flex-row items-center gap-2"
                            >
                                <AntDesign name="plus" size={14} color="white" />
                                <Text className="text-white text-sm font-bold">{t('payment.addOns')}</Text>
                            </TouchableOpacity>
                        </View>
        
                        <View className="flex-row items-baseline gap-2">
                            <Text className="text-white text-5xl font-bold tracking-tight">
                                {creditState?.balance || 0}
                            </Text>
                            <Text className="text-white/60 text-lg">
                                / {creditState?.total || 0}
                            </Text>
                        </View>
        
                        <UsageProgress 
                            remaining={creditState?.balance || 0} 
                            total={creditState?.total || 0} 
                        />
        
                        <View className="h-[1px] bg-white/10 my-6" />
        
                        <View className="flex-row items-center justify-between mb-8">
                            <View className="flex-row items-center gap-2">
                                <MaterialCommunityIcons name="crown" size={18} color="#FBBF24" />
                                <Text className="text-white/60 text-sm font-medium">
                                    {t('payment.active')} {activePlan?.title || t(`payment.${memberState?.planId}`)}
                                </Text>
                            </View>
                            {memberState?.expireAt && (
                                <Text className="text-white/40 text-xs">
                                    {t("payment.nextRenewal")}: {formatFromNow(new Date(memberState.expireAt).getTime() / 1000)}
                                </Text>
                            )}
                        </View>

                        {/* Tier Benefits Inline */}
                        <View className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <View className="gap-3">
                                <View className="flex-row items-center gap-3">
                                    <Feather name="check-circle" size={14} color={colors.primary} />
                                    <Text className="text-white/50 text-xs">{t('payment.features.voiceInteraction', { value: memberState?.quota || 500 })}</Text>
                                </View>
                                <View className="flex-row items-center gap-3">
                                    <Feather name="check-circle" size={14} color={colors.primary} />
                                    <Text className="text-white/50 text-xs">{t('payment.features.prioritySupportDashboard')}</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </View>
        );
    }

    /**
     * 获取提交按钮文本
     */
    function getSubmitButtonText(): string {
        if (loading) return t('payment.paying');
        if (!selectedPlan) return t('payment.selectPlan');

        // 充值套餐
        if (selectedPlan.mode === 'addon') {
            return `${t('payment.topUp')} ${selectedPlan.title} - ¥${selectedPlan.amount}`;
        }

        // 新订阅
        if (!isMember) {
            return `${t('payment.subscribeTo')} ${selectedPlan.title} - ¥${selectedPlan.amount}`;
        }

        // 相同计划
        if (selectedPlan.id === activePlan?.id) {
            return `${t('payment.currentPlan')} ${selectedPlan.title}`;
        }

        // 计划变更
        if (planChangeInfo) {
            const actionText = planChangeInfo.changeType === PlanChangeType.UPGRADE 
                ? t('payment.upgrade')
                : t('payment.switch');
            return `${actionText} ${selectedPlan.title} - ¥${selectedPlan.amount}`;
        }

        return `${t('payment.subscribeTo')} ${selectedPlan.title} - ¥${selectedPlan.amount}`;
    }

    /**
     * 判断是否显示底部提交按钮
     */
    const shouldShowSubmitButton = useMemo(() => {
        // 订阅前总是显示
        if (!isMember) return true;
        
        // 订阅后,仅当选择了不同计划时显示
        return selectedPlan && selectedPlan.id !== activePlan?.id && selectedPlan.mode === 'recurring';
    }, [isMember, selectedPlan, activePlan]);

    return (
        <ScreenContainer edges={['top', 'bottom']} >
            <View className="flex-1">
                {/* Header */}
                <View className="px-6 pt-2 pb-4 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
                    >
                        <AntDesign name="arrowleft" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-semibold">
                        {isMember ? t('payment.confirmTitle') : t('payment.selectQuota')}
                    </Text>
                    <View className="w-10" />
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    showsVerticalScrollIndicator={false}
                >
                    {isMember && !loadingMember ? (
                        <>
                            {renderMembershipDashboard()}
                            <View className="mt-12 mb-40">
                                <Text className="text-white/80 text-lg font-bold mb-6">{t('payment.changePlan')}</Text>
                                {renderPlans()}
                            </View>
                        </>
                    ) : (
                        <View className="pt-4 mb-40">
                             {renderPlans()}
                        </View>
                    )}
                </ScrollView>

                {/* Footer Button */}
                {shouldShowSubmitButton && (
                    <View
                        className="absolute bottom-0 left-0 right-0 p-6 pt-4 pb-8 bg-black/95 border-t border-white/10"
                        style={{ zIndex: 100 }}
                    >
                        <Button
                            disabled={disabled || !selectedPlan || (selectedPlan.id === activePlan?.id)}
                            loading={loading}
                            text={getSubmitButtonText()}
                            onPress={() => handleSubmit()}
                            style={{
                                backgroundColor: colors.primary,
                                height: 50,
                                borderRadius: 25,
                            }}
                        />
                        {(disabled || planChangeInfo) && (
                            <Text className="text-white/40 text-[10px] text-center mt-2">
                                {planChangeInfo 
                                    ? (planChangeInfo.effectiveImmediately 
                                        ? t('payment.upgradeNote') 
                                        : t('payment.changePlanNote'))
                                    : t('payment.payingTip')}
                            </Text>
                        )}
                    </View>
                )}

                {/* Top-up Modal */}
                <Modal
                    visible={showTopUp}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowTopUp(false)}
                >
                    <View className="flex-1 justify-end bg-black/60">
                        <View className="bg-[#1E293B] rounded-t-[40px] p-6 pb-12 border-t border-white/10">
                            <View className="flex-row items-center justify-between mb-8">
                                <Text className="text-white text-2xl font-bold">{t('payment.addOns')}</Text>
                                <TouchableOpacity 
                                    onPress={() => setShowTopUp(false)}
                                    className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
                                >
                                    <AntDesign name="close" size={20} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row flex-wrap justify-between gap-y-4 mb-8">
                                {displayPackages.map((option: any) => {
                                    const isSelected = selectedPlan?.id === option.id;
                                    return (
                                        <TouchableOpacity
                                            key={option.id}
                                            activeOpacity={0.9}
                                            onPress={() => setSelectedPlan(option)}
                                            style={{ width: '48%' }}
                                        >
                                            <LinearGradient
                                                colors={isSelected
                                                    ? ['rgba(59, 130, 246, 0.4)', 'rgba(147, 51, 234, 0.4)']
                                                    : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.05)']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                                style={{ borderRadius: 16, padding: 1 }}
                                            >
                                                <View className={`rounded-2xl p-4 ${isSelected ? 'bg-black/40' : 'bg-transparent'}`} style={{ borderRadius: 15, height: 100, justifyContent: 'space-between' }}>
                                                    <View>
                                                        <Text className={`text-base font-bold text-white`}>
                                                            {option.title}
                                                        </Text>
                                                        <Text className="text-white/60 text-xs">
                                                            {option.creditPerMonth} {t('payment.credits')}
                                                        </Text>
                                                    </View>
                                                    <Text className="text-white text-xl font-bold">
                                                        ¥{option.amount}
                                                    </Text>
                                                </View>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>

                             <Button
                                disabled={disabled || selectedPlan?.mode !== 'addon'}
                                loading={loading}
                                text={loading 
                                    ? t('payment.paying') 
                                    : `${t('payment.topUp')} ${selectedPlan?.title || ''} - ¥${selectedPlan?.amount || 0}`}
                                onPress={() => {
                                    handleSubmit();
                                }}
                                style={{
                                    backgroundColor: colors.primary,
                                    height: 56,
                                    borderRadius: 28,
                                }}
                            />
                        </View>
                    </View>
                </Modal>

                {/* Plan Change Confirmation Modal */}
                <Modal
                    visible={showChangeConfirm}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setShowChangeConfirm(false)}
                >
                    <View className="flex-1 justify-center items-center bg-black/60 px-8">
                        <View className="bg-[#1E293B] rounded-3xl p-6 w-full max-w-[320px] border border-white/10">
                            <Text className="text-white text-xl font-bold mb-4 text-center">
                                {t('payment.confirmChange')}
                            </Text>
                            
                            {planChangeInfo && (
                                <View className="mb-6">
                                    <View className="flex-row justify-between items-center py-3 border-b border-white/10">
                                        <Text className="text-white/60 text-sm">{t('payment.currentPlan')}</Text>
                                        <Text className="text-white font-bold">{activePlan?.title}</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center py-3 border-b border-white/10">
                                        <Text className="text-white/60 text-sm">{t('payment.newPlan')}</Text>
                                        <Text className="text-primary font-bold">{selectedPlan?.title}</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center py-3 border-b border-white/10">
                                        <Text className="text-white/60 text-sm">{t('payment.priceDifference')}</Text>
                                        <Text className={`font-bold ${planChangeInfo.priceDifference > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {planChangeInfo.priceDifference > 0 ? '+' : ''}¥{Math.abs(planChangeInfo.priceDifference)}
                                        </Text>
                                    </View>
                                    <View className="flex-row justify-between items-center py-3">
                                        <Text className="text-white/60 text-sm">{t('payment.effectiveTime')}</Text>
                                        <Text className="text-white/80 text-xs">
                                            {planChangeInfo.effectiveImmediately 
                                                ? t('payment.immediately') 
                                                : t('payment.nextCycle')}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            <View className="gap-3">
                                <Button
                                    text={t('common.confirm')}
                                    onPress={confirmPlanChange}
                                    style={{
                                        backgroundColor: colors.primary,
                                        height: 48,
                                        borderRadius: 24,
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowChangeConfirm(false)}
                                    className="py-3 items-center"
                                >
                                    <Text className="text-white/60 font-medium">{t('common.cancel')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Comparison Matrix Modal */}
                <Modal
                    visible={showCompare}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowCompare(false)}
                >
                    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
                    <SafeAreaView className="flex-1">
                        <View className="flex-1 px-6 pt-10 pb-10">
                            <View className="flex-row items-center justify-between mb-8">
                                <Text className="text-white text-3xl font-black">{t('payment.planComparison')}</Text>
                                <TouchableOpacity 
                                    onPress={() => setShowCompare(false)}
                                    className="w-12 h-12 items-center justify-center rounded-full bg-white/10"
                                >
                                    <AntDesign name="close" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                                <View className="bg-white/5 rounded-3xl overflow-hidden border border-white/10">
                                    {/* Table Header */}
                                    <View className="flex-row bg-white/10 p-4">
                                        <View style={{ flex: 1.5 }}><Text className="text-white/40 text-[10px] uppercase font-bold">{t('payment.feature')}</Text></View>
                                        <View style={{ flex: 1 }}><Text className="text-white text-[10px] font-black text-center">STARTER</Text></View>
                                        <View style={{ flex: 1 }}><Text className="text-primary text-[10px] font-black text-center">PRO</Text></View>
                                        <View style={{ flex: 1 }}><Text className="text-white text-[10px] font-black text-center">MAX</Text></View>
                                    </View>

                                    {/* Rows */}
                                    {[
                                        { key: 'credits', features: ['500', '1500', '7000'] },
                                        { key: 'aiModel', features: ['Standard', 'Empathy Pro', 'Vision Ultimate'] },
                                        { key: 'voice', features: ['Standard', 'HD Emotional', 'Ultra HI-FI'] },
                                        { key: 'memory', features: ['Session', '30-Day', 'Permanent'] },
                                        { key: 'clone', features: ['-', '1 Active', 'Unlimited'] },
                                        { key: 'consult', features: ['-', '-', '1v1 Expert'] },
                                        { key: 'strategy', features: ['-', '-', 'Full Access'] },
                                    ].map((row, idx) => (
                                        <View key={row.key} className={`flex-row p-4 border-t border-white/5 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}`}>
                                            <View style={{ flex: 1.5 }}><Text className="text-white/70 text-xs font-medium">{t(`payment.matrix.${row.key}`)}</Text></View>
                                            {row.features.map((f, i) => (
                                                <View key={i} style={{ flex: 1 }} className="items-center justify-center">
                                                    <Text className={`text-[11px] text-center ${i === 2 ? 'text-white font-bold' : (i === 1 ? 'text-primary/80 font-bold' : 'text-white/40')}`}>{f}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                                
                                <View className="mt-10 mb-20 items-center">
                                    <Text className="text-white/40 text-[10px] text-center italic">
                                        * {t('payment.matrixDisclaimer')}
                                    </Text>
                                </View>
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        </ScreenContainer>
    );
};

export default ProductList;

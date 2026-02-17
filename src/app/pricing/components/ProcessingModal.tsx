import {Modal, Text, View, ActivityIndicator, Platform, TouchableOpacity} from "react-native";
import React from "react";
import {useTranslation} from "@/i18n/translation";
import {useColors} from "@/hooks/useColors";
import { AntDesign } from "@expo/vector-icons";

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';
export type OperationType = 'subscribe' | 'upgrade' | 'topup' | null;

/**
 * 支付处理模态框
 * 
 * 显示支付流程的各个状态:
 * - idle: 无操作
 * - processing: 处理中
 * - success: 成功
 * - failed: 失败
 */
const ProcessingModal = ({
    status = 'idle',
    operation = null,
    onClose,
}: { 
    status?: PaymentStatus,
    operation?: OperationType,
    onClose?: () => void,
}) => {
    const {t} = useTranslation();
    const colors = useColors();

    const visible = status !== 'idle';

    /**
     * 获取状态标题
     */
    const getTitle = () => {
        if (status === 'processing') {
            return t("payment.paying");
        }
        if (status === 'success') {
            switch (operation) {
                case 'subscribe':
                    return t("payment.subscribeSuccess");
                case 'upgrade':
                    return t("payment.upgradeSuccess");
                case 'topup':
                    return t("payment.topupSuccess");
                default:
                    return t("payment.success");
            }
        }
        if (status === 'failed') {
            return t("payment.purchaseFailedTitle");
        }
        return '';
    };

    /**
     * 获取状态描述
     */
    const getDescription = () => {
        if (status === 'processing') {
            return t("payment.payingTip");
        }
        if (status === 'success') {
            switch (operation) {
                case 'subscribe':
                    return t("payment.subscribeSuccessMsg");
                case 'upgrade':
                    return t("payment.upgradeSuccessMsg");
                case 'topup':
                    return t("payment.topupSuccessMsg");
                default:
                    return t("payment.purchaseSuccessMsg");
            }
        }
        if (status === 'failed') {
            return t("payment.pleaseRetry");
        }
        return '';
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/60 justify-center items-center px-8">
                <View
                    className="bg-[#1E293B] rounded-3xl p-8 items-center w-full max-w-[320px] border border-white/10"
                    style={{
                        ...Platform.select({
                            ios: {
                                shadowColor: "#000",
                                shadowOffset: {width: 0, height: 10},
                                shadowOpacity: 0.3,
                                shadowRadius: 20,
                            },
                            android: {
                                elevation: 12,
                            },
                        }),
                    }}
                >
                    {/* Status Icon */}
                    <View className="mb-6">
                        {status === 'processing' && (
                            <ActivityIndicator size="large" color={colors.primary}/>
                        )}
                        {status === 'success' && (
                            <View className="w-16 h-16 rounded-full bg-green-500/20 items-center justify-center">
                                <AntDesign name="checkcircle" size={40} color="#22C55E" />
                            </View>
                        )}
                        {status === 'failed' && (
                            <View className="w-16 h-16 rounded-full bg-red-500/20 items-center justify-center">
                                <AntDesign name="closecircle" size={40} color="#EF4444" />
                            </View>
                        )}
                    </View>

                    {/* Title */}
                    <Text className="text-xl font-bold text-white text-center">
                        {getTitle()}
                    </Text>

                    {/* Description */}
                    <Text className="text-sm text-white/60 mt-2 text-center leading-5">
                        {getDescription()}
                    </Text>

                    {/* Action Button for Success/Failed */}
                    {(status === 'success' || status === 'failed') && (
                        <TouchableOpacity
                            onPress={onClose}
                            className={`mt-8 px-8 py-3 rounded-full w-full items-center ${status === 'success' ? 'bg-primary' : 'bg-white/10'}`}
                        >
                            <Text className="text-white font-bold">
                                {status === 'success' ? t("common.ok") : t("payment.retry")}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    )
}

export default ProcessingModal;

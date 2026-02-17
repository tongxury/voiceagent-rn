import React, {useEffect, useState} from "react";
import {Alert} from "react-native";
import ProductList, {PRICING_DATA} from "./components/ProductList";
import {callbackAppleBilling} from "@/api/payment";
import {useRouter} from "expo-router";
import {useIAP} from 'expo-iap';
import ProcessingModal, { PaymentStatus } from "./components/ProcessingModal";
import {useTranslation} from "@/i18n/translation";
import { PricingPlan, PricingPackage } from "./types/SubscriptionTypes";

/**
 * IOS 订阅管理主组件
 * 
 * 处理订阅流程:
 * 1. 初始化 IAP(In-App Purchase)
 * 2. 处理订阅购买和变更
 * 3. 管理支付状态
 */
const IOS = () => {
    const {
        connected,
        products,
        subscriptions,
        getProducts,
        getSubscriptions,
    } = useIAP();

    const {t} = useTranslation();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [currentOperation, setCurrentOperation] = useState<'subscribe' | 'upgrade' | 'topup' | null>(null);
    const {plans, packages} = PRICING_DATA

    /**
     * 初始化 IAP
     * 从 App Store 加载产品和订阅信息
     */
    useEffect(() => {
        if (!connected) return;

        const initializeIAP = async () => {
            try {
                const packageIds = packages.map(x => x.id);
                const planIds = plans.map(x => x.id);
                
                console.log('IAP initializing with:', {planIds, packageIds});
                
                // 从 App Store 获取产品和订阅信息
                await Promise.all([
                    getProducts([...packageIds, ...planIds]),
                    getSubscriptions(planIds)
                ]);

                console.log('IAP Initialization Results:', {
                    availableProducts: (products as any[])?.map(p => p.productId || p.id),
                    availableSubs: (subscriptions as any[])?.map(s => s.productId || s.id)
                });

                setIsReady(true);
            } catch (error) {
                console.error('Error initializing IAP:', error);
                // 仍然设置为 ready,让单独的购买处理错误
                setIsReady(true);
            }
        };

        void initializeIAP();
        // 只依赖输入值，不依赖 products 和 subscriptions，因为它们是结果值
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected]);

    /**
     * 处理支付请求
     * 
     * @param selectedItem - 选择的计划或套餐
     */
    const onPay = async (selectedItem: PricingPlan | PricingPackage) => {
        const productId = selectedItem.id;
        const isSubscription = selectedItem?.mode === 'recurring';
        
        console.log('onPay called for:', productId, 'isSubscription:', isSubscription);
        console.log('IAP Status:', { connected, isReady, productsCount: products?.length, subsCount: subscriptions?.length });

        // 验证 IAP 连接状态
        if (!connected || !isReady) {
            Alert.alert(t('payment.errorTitle'), t('payment.iapNotReady'));
            return;
        }

        // 检查产品是否在 App Store 元数据中
        const hasMetadata = isSubscription 
            ? (subscriptions as any[])?.some(s => s.productId === productId || s.id === productId)
            : (products as any[])?.some(p => p.productId === productId || p.id === productId);

        if (!hasMetadata) {
            console.warn(`SKU ${productId} not found in App Store metadata`);
            // 仍然可以尝试,但记录警告
        }

        // 确定操作类型
        const operation: 'subscribe' | 'upgrade' | 'topup' = 
            isSubscription ? 'subscribe' : 'topup';
        setCurrentOperation(operation);

        try {
            setPaymentStatus('processing');
            console.log('Mocking purchase for:', productId);

            // MOCK 模式: 直接调用后端
            // 在生产环境中,应该使用真实的 IAP 流程:
            // await requestPurchase({ sku: productId, andDangerouslyFinishTransactionAutomaticallyIOS: false });
            
            await callbackAppleBilling({
                productId: productId,
                transactionReceipt: `mock_receipt_${Date.now()}_${productId}`,
            });

            console.log('Mock purchase successful');
            setPaymentStatus('success');
            
            // 购买成功后等待一小段时间确保后端已处理完成，然后刷新数据
            setTimeout(() => {
                // refetch 会在 ProductList 中被调用
            }, 500);

        } catch (error: any) {
            console.error('Purchase failed:', error);
            setPaymentStatus('failed');
            
            // 显示具体错误信息
            const errorMessage = error?.response?.data?.message || error?.message || t('payment.unknownError');
            Alert.alert(t('payment.errorTitle'), errorMessage);
        }
    };

     /**
     * 处理关闭支付模态框
     * 成功时返回上一页
     */
    const handleCloseModal = () => {
        if (paymentStatus === 'success') {
            setPaymentStatus('idle');
            setCurrentOperation(null);
            // 成功后返回,让用户看到更新的状态
            router.back();
        } else {
            setPaymentStatus('idle');
            setCurrentOperation(null);
        }
    }

    /**
     * 购买成功后自动关闭弹窗
     */
    React.useEffect(() => {
        if (paymentStatus === 'success') {
            // 延迟 1.5 秒后自动关闭，让用户看到成功提示
            const timer = setTimeout(() => {
                handleCloseModal();
            }, 1500);
            
            return () => clearTimeout(timer);
        }
    }, [paymentStatus]);

    return (
        <>
            <ProductList 
                onSubmit={onPay}
                loading={paymentStatus === 'processing'}
                disabled={!connected || !isReady}
                onPurchaseSuccess={() => {
                    console.log('[IOS] Purchase completed, triggering data refresh');
                }}
            />
            <ProcessingModal 
                status={paymentStatus}
                operation={currentOperation}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default IOS;

/**
 * 订阅状态枚举
 */
export enum SubscriptionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

/**
 * 计划变更类型
 */
export enum PlanChangeType {
    UPGRADE = 'upgrade',      // 升级到更高价格计划 - 立即生效
    DOWNGRADE = 'downgrade',  // 降级到更低价格计划 - 下个周期生效
    SWITCH = 'switch',        // 同价位切换 - 下个周期生效
}

/**
 * 订阅模式
 */
export type SubscriptionMode = 'recurring' | 'addon';

/**
 * 会员状态接口
 */
export interface MemberState {
    isActive: boolean;
    planId?: string;
    quota?: number;
    expireAt?: string;
    status?: SubscriptionStatus;
    autoRenew?: boolean;
}

/**
 * 额度状态接口
 */
export interface CreditState {
    balance: number;  // API 返回的字段名是 balance
    total?: number;
    userId?: string;
}

/**
 * 定价计划接口
 */
export interface PricingPlan {
    id: string;
    title?: string;
    amount: number;
    mode: SubscriptionMode;
    creditPerMonth: number;
    features?: string[];
    tag?: 'popular' | 'recommended';
}

/**
 * 定价套餐接口(一次性充值)
 */
export interface PricingPackage {
    id: string;
    title?: string;
    amount: number;
    creditPerMonth: number;
    mode: 'addon';
}

/**
 * 计划变更信息
 */
export interface PlanChangeInfo {
    currentPlan: PricingPlan;
    targetPlan: PricingPlan;
    changeType: PlanChangeType;
    priceDifference: number;
    creditDifference: number;
    effectiveImmediately: boolean;
}

/**
 * 计算计划变更类型
 */
export function calculatePlanChangeType(
    currentAmount: number,
    targetAmount: number
): PlanChangeType {
    if (targetAmount > currentAmount) {
        return PlanChangeType.UPGRADE;
    } else if (targetAmount < currentAmount) {
        return PlanChangeType.DOWNGRADE;
    }
    return PlanChangeType.SWITCH;
}

/**
 * 获取计划变更信息
 */
export function getPlanChangeInfo(
    currentPlan: PricingPlan,
    targetPlan: PricingPlan
): PlanChangeInfo {
    const changeType = calculatePlanChangeType(currentPlan.amount, targetPlan.amount);
    const effectiveImmediately = changeType === PlanChangeType.UPGRADE;

    return {
        currentPlan,
        targetPlan,
        changeType,
        priceDifference: targetPlan.amount - currentPlan.amount,
        creditDifference: targetPlan.creditPerMonth - currentPlan.creditPerMonth,
        effectiveImmediately,
    };
}

import { ReactNode } from "react";

export interface Settings {
    scenes: Scene[];

    titleMaxLength?: number;
    bodyMaxLength?: number;

    prompts?: PromptConfig[];
}

export interface PromptConfig {
    promptId: string;
    maxFiles?: number;
    cost?: number;
}

export interface Scene {
    value: string;
    isPopular?: boolean;
    isNew?: boolean;
    description?: string;
    getSceneIcon: ({ size, color, }: { size: number, color: string }) => ReactNode;

    [key: string]: any;
}

export interface Question {
    _id?: string;
    session?: Session;
    prompt?: {
        id: string;
        content?: string;
    };
    status?: 'created' | 'prepared' | 'generating' | 'completed' | string;

    [key: string]: any;
}

export interface Session {
    _id?: string;
    resources?: Resource[];

    [key: string]: any;

}

export interface Resource {
    [key: string]: any;

    id?: string;
    mimeType?: string;
    category?: string;
    uri?: string; // 本地文件路径
    url?: string;
    coverUrl?: string;
    name?: string;
    content?: string;
    meta?: {
        [key: string]: string;
    } | any;
}

export interface Account {
    _id?: string;
    platform?: string;
    nickname?: string;
    sign?: string;
    domain?: string[];
    followers?: string;
    posts?: string;
    interacts?: string;
    isDefault?: boolean;
    avatar?: string;
    lastUpdatedAt?: number;

    extra?: { [key: string]: any };
}

export interface User {
    id?: string;

    [key: string]: any;
}

// vip接口
export interface VipResponse {
    id: string;
    title: string;
    amount: number;
    months: number;
    creditPerMonth: number;
    unit: string;
    features: {
        coverAnalysisImages: number;
        analysisImages: number;
        preAnalysisImages: number;
        limitAnalysisImages: number;
        analysis: number;
        limitAnalysis: number;
        preAnalysis: number;
        duplicateScript: number;
    };
}

// 更新接口
export interface StoreVersion {
    version: string;
    forceUpdate: boolean;
    description: string;
    downloadUrl: {
        ios: string;
        android: string;
        fallbackIos?: string; // App Store 网页版链接
        fallbackAndroid?: string; // Play Store 网页版链接
    };
}

// --- Voice Agent Service Types ---

export interface Persona {
    _id: string;
    name: string;
    displayName: string;
    avatar?: string;
    description?: string;
    voiceId?: string;
    category?: string;
    isBuiltin?: boolean;
    welcomeMessage?: string;
}

export interface Agent {
    _id: string;
    user?: User;
    persona?: Persona;
    voiceId?: string;
    defaultSceneId?: string;
    isPublic?: boolean;
    status?: string;
    agentId?: string;
    createdAt?: number;
}

export interface CreateAgentRequest {
    name: string;
    personaId: string;
    voiceId?: string;
    avatar?: string;
    desc?: string;
    defaultSceneId?: string;
    isPublic?: boolean;
}

export interface UpdateAgentRequest extends Partial<CreateAgentRequest> {
    status?: string;
}

export interface Voice {
    _id: string;
    name: string;
    voiceId: string;
    sampleUrl?: string;
    type: 'preset' | 'cloned';
    settings?: Record<string, string>;
    status?: 'active' | 'processing' | 'failed';
}

export interface VoiceScene {
    _id: string;
    name: string;
    desc?: string;
    bgUrl?: string;
    systemPromptOverride?: string;
}

export interface Conversation {
    _id: string;
    userId: string;
    agentId: string;
    agent?: Agent;
    sceneId?: string;
    status: 'active' | 'ended' | string;
    createdAt: number;
    lastMessageAt: number;
    conversationId?: string;
    signedUrl?: string;
    token?: string;
    subject?: string;
    summary?: string;
}

export interface TranscriptEntry {
    _id: string;
    conversationId: string;
    role: 'user' | 'agent';
    message: string;
    voiceUrl?: string;
    createdAt: number;
    messageId?: string;
}

// ==================== Memory Types ====================

export interface Memory {
    _id: string;
    userId: string;
    type: 'fact' | 'preference' | 'experience' | 'relationship' | string;
    content: string;
    source?: string;
    importance: number;
    tags: string[];
    createdAt: number;
    updatedAt: number;
}

// ==================== UserProfile Types ====================

export interface UserProfile {
    _id: string;
    userId: string;
    nickname?: string;
    birthday?: string;
    interests: string[];
    goals: string[];
    personality?: string;
    emotionBaseline?: string;
    bio?: string;
    timezone?: string;
    createdAt: number;
    updatedAt: number;
}

// ==================== Emotion Types ====================

export interface EmotionLog {
    _id: string;
    userId: string;
    conversationId: string;
    emotion: 'happy' | 'sad' | 'anxious' | 'calm' | 'angry' | 'excited' | 'neutral' | string;
    intensity: number;
    summary?: string;
    triggers: string[];
    createdAt: number;
}

export interface EmotionDataPoint {
    date: string;
    emotion: string;
    intensity: number;
}

export interface EmotionStats {
    dateRange: string;
    dominantEmotion: string;
    averageIntensity: number;
    emotionCounts: Record<string, number>;
    timeline: EmotionDataPoint[];
}

// ==================== Event Types ====================

export interface ImportantEvent {
    _id: string;
    userId: string;
    title: string;
    type: 'birthday' | 'anniversary' | 'reminder' | 'goal' | 'custom' | string;
    date: string;
    isRecurring: boolean;
    note?: string;
    relatedPerson?: string;
    reminderDays: number;
    createdAt: number;
    updatedAt: number;
}

// ==================== Assessment Types ====================

export interface Assessment {
    _id: string;
    user: any; // Using any for now, matches api.usercenter.User
    type: string;
    score: number;
    level: string;
    createdAt: number;
    details: string; // JSON string
}

export interface CreateAssessmentRequest {
    type: string;
    score: number;
    level: string;
    details: string;
}

export interface ListAssessmentsRequest {
    page?: number;
    size?: number;
}

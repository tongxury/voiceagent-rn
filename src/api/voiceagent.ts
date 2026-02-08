import instance from "@/shared/providers/api";
import { Agent, Voice, VoiceScene, Conversation, TranscriptEntry, Persona, Memory, UserProfile, EmotionLog, EmotionStats, ImportantEvent, CreateAgentRequest, UpdateAgentRequest, Assessment, CreateAssessmentRequest, ListAssessmentsRequest, Topic } from "@/types";



export const listPersonas = (params: { category?: string } = {}) => {
    return instance.request<{ list: Persona[] }>({
        url: "/api/va/personas",
        params,
    });
};

export const getPersona = (id: string) => {
    return instance.request<Persona>({
        url: `/api/va/personas/${id}`,
    });
};

export const listAgents = (params: { page?: number, size?: number, category?: string } = {}) => {
    return instance.request<{ list: Agent[], total: number }>({
        url: "/api/va/agents",
        params,
    });
};

export const getAgent = (id: string) => {
    return instance.request<Agent>({
        url: `/api/va/agents/${id}`,
    });
};

export const createAgent = (data: CreateAgentRequest) => {
    return instance.request<Agent>({
        url: "/api/va/agents",
        method: "POST",
        data,
    });
};

export const updateAgent = (id: string, data: UpdateAgentRequest) => {
    return instance.request<Agent>({
        url: `/api/va/agents/${id}`,
        method: "PATCH",
        data,
    });
};

export const deleteAgent = (id: string) => {
    return instance.request<void>({
        url: `/api/va/agents/${id}`,
        method: "DELETE",
    });
};

export const listScenes = (params: {} = {}) => {
    return instance.request<{ list: VoiceScene[] }>({
        url: "/api/va/scenes",
        params,
    });
};

export const listTopics = () => {
    return instance.request<{ list: Topic[] }>({
        url: "/api/va/topics",
    });
};


export const getConversation = (id: string) => {
    return instance.request<Conversation>({
        url: `/api/va/conversations/${id}`,
    });
};

export const updateConversation = (id: string, data: { status?: string, conversationId?: string }) => {
    return instance.request<Conversation>({
        url: `/api/va/conversations/${id}`,
        method: "PATCH",
        data,
    });
};

export const listVoices = (params: { owner?: string } = {}) => {
    return instance.request<{ list: Voice[] }>({
        url: "/api/va/voices",
        params,
    });
};

export const addVoice = (data: { name: string, sampleUrl: string, type?: string }) => {
    return instance.request<Voice>({
        url: "/api/va/voices",
        method: "POST",
        data,
    });
};

export const listConversations = (params: { page?: number, size?: number } = {}) => {
    return instance.request<{ list: Conversation[], total: number }>({
        url: "/api/va/conversations",
        params,
    });
};

export const listTranscriptEntries = (conversationId: string, params: { page?: number, size?: number } = {}) => {
    return instance.request<{ list: TranscriptEntry[], total: number, conversation: Conversation }>({
        url: `/api/va/conversations/${conversationId}/transcripts`,
        params,
    });
};

export const recordTranscriptEntry = (data: { conversationId: string, role: string, message: string }) => {
    return instance.request<TranscriptEntry>({
        url: "/api/va/transcripts",
        method: "POST",
        data,
    });
};

export const sendMessage = (data: { conversationId: string, message: string, enableVoice?: boolean }) => {
    return instance.request<TranscriptEntry>({
        url: "/api/va/messages",
        method: "POST",
        data,
    });
};

export const createMotivationCard = (data: {
    agentId: string,
    originalText: string,
    emotionTag?: string,
    modelId?: string,
    sceneId?: string,
    isPublic?: boolean,
    posterStyle?: string,
}) => {
    return instance.request<{
        id: string,
        audioUrl: string,
        shareUrl: string,
        polishedText: string,
        userName?: string,
        userAvatar?: string,
        agentName?: string,
        agentAvatar?: string,
        emotionTag?: string,
        createdAt?: number,
        waveform?: number[],
        posterStyle?: string,
        posterUrl?: string
    }>({
        url: "/api/va/motivations",
        method: "POST",
        data,
    });
};

export const updateMotivationPoster = (id: string, posterUrl: string) => {
    return instance.request<void>({
        url: `/api/va/motivations/${id}/poster`,
        method: "PATCH",
        data: { posterUrl },
    });
};

export const getMotivationCard = (id: string) => {
    return instance.request<any>({
        url: `/api/va/motivations/${id}`,
    });
};

export const listMotivationCards = (params: { page?: number, size?: number } = {}) => {
    return instance.request<{ list: any[], total: number }>({
        url: "/api/va/motivations",
        params,
    });
};

export const deleteMotivationCard = (id: string) => {
    return instance.request<void>({
        url: `/api/va/motivations/${id}`,
        method: "DELETE",
    });
};

// ==================== Memory APIs ====================

export const listMemories = (params: { type?: string, page?: number, size?: number } = {}) => {
    return instance.request<{ list: Memory[], total: number }>({
        url: "/api/va/memories",
        params,
    });
};

export const createMemory = (data: {
    type: string,
    content: string,
    importance?: number,
    tags?: string[]
}) => {
    return instance.request<Memory>({
        url: "/api/va/memories",
        method: "POST",
        data,
    });
};

export const deleteMemory = (id: string) => {
    return instance.request<void>({
        url: `/api/va/memories/${id}`,
        method: "DELETE",
    });
};

// ==================== Profile APIs ====================

export const getUserProfile = () => {
    return instance.request<UserProfile>({
        url: "/api/va/profile",
    });
};

export const updateUserProfile = (data: {
    nickname?: string,
    birthday?: string,
    interests?: string[],
    goals?: string[],
    bio?: string,
    timezone?: string
}) => {
    return instance.request<UserProfile>({
        url: "/api/va/profile",
        method: "PATCH",
        data,
    });
};

// ==================== Emotion APIs ====================

export const listEmotionLogs = (params: {
    page?: number,
    size?: number,
    startTime?: number,
    endTime?: number
} = {}) => {
    return instance.request<{ list: EmotionLog[], total: number }>({
        url: "/api/va/emotions",
        params,
    });
};

export const getEmotionStats = (params: { days?: number } = {}) => {
    return instance.request<EmotionStats>({
        url: "/api/va/emotions/stats",
        params,
    });
};

// ==================== Event APIs ====================

export const listEvents = (params: { type?: string, page?: number, size?: number } = {}) => {
    return instance.request<{ list: ImportantEvent[], total: number }>({
        url: "/api/va/events",
        params,
    });
};

export const createEvent = (data: {
    title: string,
    type: string,
    date: string,
    isRecurring?: boolean,
    note?: string,
    relatedPerson?: string,
    reminderDays?: number
}) => {
    return instance.request<ImportantEvent>({
        url: "/api/va/events",
        method: "POST",
        data,
    });
};

export const updateEvent = (id: string, data: {
    title?: string,
    type?: string,
    date?: string,
    isRecurring?: boolean,
    note?: string,
    relatedPerson?: string,
    reminderDays?: number
}) => {
    return instance.request<ImportantEvent>({
        url: `/api/va/events/${id}`,
        method: "PATCH",
        data,
    });
};

export const deleteEvent = (id: string) => {
    return instance.request<void>({
        url: `/api/va/events/${id}`,
        method: "DELETE",
    });
};

export const getUpcomingEvents = (params: { days?: number } = {}) => {
    return instance.request<{ list: ImportantEvent[], total: number }>({
        url: "/api/va/events/upcoming",
        params,
    });
};

// ==================== Growth Report APIs ====================

export interface GrowthReport {
    period: string;
    startDate: number;
    endDate: number;
    conversationCount: number;
    totalDuration: number;
    newMemories: Memory[];
    emotionSummary?: EmotionStats;
    highlights: string[];
    suggestions: string[];
    upcomingEvents: ImportantEvent[];
}

export const getGrowthReport = (params: { period?: string } = {}) => {
    return instance.request<GrowthReport>({
        url: "/api/va/growth-report",
        params,
    });
};

export const generateCartesiaToken = () => {
    return instance.request<{ accessToken: string }>({
        url: "/api/va/cartesia/token",
        method: "POST",
        data: {},
    });
};

export const createConversation = (agentId: string, topic?: Topic) => {
    return instance.request<Conversation>({
        url: "/api/va/conversations",
        method: "POST",
        data: { agentId, topic },
    });
};

export const stopConversation = (id: string) => {
    return instance.request<Conversation>({
        url: `/api/va/conversations/${id}/stop`,
        method: "POST",
        data: {},
    });
};

// ==================== Assessment APIs ====================

export const createAssessment = (data: CreateAssessmentRequest) => {
    return instance.request<Assessment>({
        url: "/api/va/assessments",
        method: "POST",
        data,
    });
};

export const listAssessments = (params: ListAssessmentsRequest = {}) => {
    return instance.request<{ list: Assessment[], total: number }>({
        url: "/api/va/assessments",
        method: "GET",
        params,
    });
};

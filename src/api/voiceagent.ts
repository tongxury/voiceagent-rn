import instance from "@/providers/api";
import { Agent, Voice, VoiceScene, Conversation, TranscriptEntry, Persona } from "@/types";

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

export const createAgent = (data: { 
    name: string, 
    personaId: string, 
    voiceId?: string,
    avatar?: string, 
    desc?: string,
    defaultSceneId?: string,
    isPublic?: boolean,
}) => {
    return instance.request<Agent>({
        url: "/api/va/agents",
        method: "POST",
        data,
    });
};

export const updateAgent = (id: string, data: Partial<Agent>) => {
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

export const createConversation = (data: { agentId: string, sceneId?: string }) => {
    return instance.request<Conversation>({
        url: "/api/va/conversations",
        method: "POST",
        data,
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
    return instance.request<{ list: TranscriptEntry[], total: number }>({
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

import instance from "./instance";
import { Agent, Voice, Conversation, TranscriptEntry, Persona, Memory, UserProfile, CreateAgentRequest, UpdateAgentRequest, Topic } from "@/types";

export interface ListAgentsRequest {
    category?: string;
    page?: number;
    size?: number;
}

export const listAgents = (params: ListAgentsRequest = {}) => {
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

export const listPersonas = (params: { category?: string, page?: number, size?: number, owner?: string } = {}) => {
    return instance.request<{ list: Persona[], total: number }>({
        url: "/api/va/personas",
        params,
    });
};

export const listAgentPersonas = (agentId: string) => {
    return instance.request<{ list: Persona[], total: number }>({
        url: `/api/va/agents/${agentId}/personas`,
    });
};

export const listVoices = (params: { page?: number, size?: number, owner?: string } = {}) => {
    return instance.request<{ list: Voice[], total: number }>({
        url: "/api/va/voices",
        params,
    });
};

export const updateAgentVoice = (agentId: string, voiceId: string) => {
    return instance.request<Agent>({
        url: `/api/va/agents/${agentId}/voice`,
        method: "PATCH",
        data: { voiceId },
    });
};

export const previewVoice = (voiceId: string, text: string) => {
    return instance.request<{ audioUrl: string }>({
        url: "/api/va/voices/preview",
        method: "POST",
        data: { voiceId, text },
    });
};

export const listConversations = (params: { agentId?: string, page?: number, size?: number } = {}) => {
    return instance.request<{ list: Conversation[], total: number }>({
        url: "/api/va/conversations",
        params,
    });
};

export const getConversation = (id: string) => {
    return instance.request<Conversation>({
        url: `/api/va/conversations/${id}`,
    });
};

export const deleteConversation = (id: string) => {
    return instance.request<void>({
        url: `/api/va/conversations/${id}`,
        method: "DELETE",
    });
};

export const listTranscriptEntries = (params: { conversationId: string, page?: number, size?: number }) => {
    return instance.request<{ list: TranscriptEntry[], total: number }>({
        url: "/api/va/messages",
        params,
    });
};

export const sendMessage = (data: { conversationId: string, message: string }) => {
    return instance.request<TranscriptEntry>({
        url: "/api/va/messages",
        method: "POST",
        data,
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

export const listTopics = () => {
    return instance.request<{ list: Topic[] }>({
        url: "/api/va/topics",
    });
};

import { createAgent, deleteAgent, listAgents, listPersonas, listScenes, listVoices, updateAgent } from "@/api/voiceagent";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { Agent, Persona } from "@/types";
import { upload } from "@/utils/upload/tos";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from "react";
import { useTranslation } from "@/i18n/translation";
import useTailwindVars from "@/hooks/useTailwindVars";
import { PersonaSelector } from "./PersonaSelector";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface AgentTabProps {
    activeAgent: Agent | null;
    setActiveAgent: (agent: Agent) => void;
}

export const AgentTab = (props: AgentTabProps) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();
    const { activeAgent, setActiveAgent } = props;
    const [isCreating, setIsCreating] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
    const [newName, setNewName] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [selectedPersonaId, setSelectedPersonaId] = useState("");
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [selectedVoiceId, setSelectedVoiceId] = useState("");
    const [selectedSceneId, setSelectedSceneId] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [agentStatus, setAgentStatus] = useState("active");
    const [voiceFilter, setVoiceFilter] = useState<'all' | 'system' | 'custom'>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const queryClient = useQueryClient();

    const isEditMode = !!editingAgentId;

    const resetForm = () => {
        setNewName("");
        setNewAvatar("");
        setNewDesc("");
        setSelectedPersonaId("");
        setSelectedVoiceId("");
        setSelectedSceneId("");
        setIsPublic(true);
        setAgentStatus("active");
        setIsCreating(false);
        setEditingAgentId(null);
    };

    const handleEditStart = (agent: Agent) => {
        setEditingAgentId(agent._id);
        setNewName(agent.name);
        setNewAvatar(agent.avatar || "");
        setNewDesc(agent.desc || "");
        setSelectedPersonaId(agent.personaId || "");
        setSelectedVoiceId(agent.voiceId || "");
        setSelectedSceneId(agent.defaultSceneId || "");
        setIsPublic(agent.isPublic ?? true);
        setAgentStatus(agent.status || "active");
        setIsCreating(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePickAvatar = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            setIsUploadingAvatar(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            const uploadUrl = await upload({
                uri: asset.uri,
                name: asset.fileName || `avatar_${Date.now()}.jpg`,
                type: asset.mimeType || 'image/jpeg',
            });

            setNewAvatar(uploadUrl);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error("Failed to pick or upload avatar", error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // 使用优化后的 useQueryData，自动解开嵌套路径
    const { data: agentsData } = useQueryData({
        queryKey: ['agents'],
        queryFn: () => listAgents(),
    });

    const { data: personasData } = useQueryData({
        queryKey: ['personas'],
        queryFn: () => listPersonas(),
    });

    const { data: voicesData, isLoading: isVoicesLoading } = useQueryData({
        queryKey: ['voices', voiceFilter],
        queryFn: () => listVoices({ owner: voiceFilter === 'all' ? '' : voiceFilter }),
    });

    const { data: scenesData } = useQueryData({
        queryKey: ['scenes'],
        queryFn: () => listScenes(),
    });

    const agents = useMemo(() => agentsData?.list || [], [agentsData?.list]);
    const personas = useMemo(() => personasData?.list || [], [personasData?.list]);
    const voices = useMemo(() => voicesData?.list || [], [voicesData?.list]);
    const scenes = useMemo(() => scenesData?.list || [], [scenesData?.list]);

    // 默认选择第一个模板
    React.useEffect(() => {
        if (isCreating && !isEditMode && personas.length > 0 && !selectedPersonaId) {
            const firstPersona = personas[0];
            setSelectedPersonaId(firstPersona._id);
            setNewName(firstPersona.displayName);
            setNewDesc(firstPersona.description || "");
            setSelectedVoiceId(firstPersona.voiceId || "");
            setNewAvatar(firstPersona.avatar || "");
        }
    }, [isCreating, isEditMode, personas, selectedPersonaId]);

    const handleSaveAgent = async () => {
        if (!newName.trim() || !selectedPersonaId || !selectedVoiceId) return;
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await updateAgent(editingAgentId!, {
                    name: newName,
                    avatar: newAvatar,
                    desc: newDesc,
                    personaId: selectedPersonaId,
                    voiceId: selectedVoiceId,
                    defaultSceneId: selectedSceneId,
                    isPublic: isPublic,
                    status: agentStatus,
                });
            } else {
                await createAgent({
                    name: newName,
                    avatar: newAvatar || `https://api.dicebear.com/7.x/bottts/png?seed=${newName}`,
                    desc: newDesc || t('agent.customAgent'),
                    personaId: selectedPersonaId,
                    voiceId: selectedVoiceId,
                    defaultSceneId: selectedSceneId,
                    isPublic: isPublic,
                });
            }
            await queryClient.invalidateQueries({ queryKey: ['agents'] });
            resetForm();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error("Failed to save agent", error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAgent = async (agentId?: string) => {
        const idToDelete = agentId || editingAgentId;
        if (!idToDelete) return;
        
        const confirmDelete = () => new Promise<boolean>((resolve) => {
            // @ts-ignore - Alert is globally available in RN
            Alert.alert(
                t('agent.deleteConfirmTitle'),
                t('agent.deleteConfirmDesc'),
                [
                    { text: t('agent.cancel'), onPress: () => resolve(false), style: 'cancel' },
                    { text: t('agent.delete'), onPress: () => resolve(true), style: 'destructive' },
                ]
            );
        });

        const shouldDelete = await confirmDelete();
        if (!shouldDelete) return;

        setIsSubmitting(true);
        try {
            await deleteAgent(idToDelete);
            await queryClient.invalidateQueries({ queryKey: ['agents'] });
            
            // 如果删除的是当前选中的助理，清空选中状态
            if (activeAgent?._id === idToDelete) {
                // @ts-ignore
                setActiveAgent(null);
                await AsyncStorage.removeItem("last_agent_id");
            }
            
            if (editingAgentId === idToDelete) {
                resetForm();
            }
            
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error("Failed to delete agent", error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderAgentItem = ({ item }: { item: Agent }) => (
        <View className="flex-row items-center mb-3">
            <TouchableOpacity 
                disabled={isManaging}
                onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveAgent(item);
                    await AsyncStorage.setItem("last_agent_id", item._id);
                }}
                className={`flex-1 p-4 rounded-3xl flex-row items-center border ${activeAgent?._id === item._id ? 'bg-primary border-primary' : 'bg-muted border-border'} ${isManaging ? 'opacity-80' : ''}`}
            >
                <Image source={{ uri: item.avatar }} className="h-12 w-12 rounded-2xl" />
                <View className="ml-4 flex-1">
                    <Text className={`font-bold ${activeAgent?._id === item._id ? 'text-primary-foreground' : 'text-foreground'}`}>{item.name}</Text>
                    <Text className={`text-xs ${activeAgent?._id === item._id ? 'text-primary-foreground/60' : 'text-muted-foreground'}`} numberOfLines={1}>{item.desc}</Text>
                </View>
                {!isManaging && activeAgent?._id === item._id && <Feather name="check-circle" size={20} color={colors.primaryForeground} />}
            </TouchableOpacity>
            
            {isManaging && (
                <View className="flex-row items-center space-x-2 gap-2 ml-2">
                  
                    <TouchableOpacity 
                        onPress={() => handleEditStart(item)}
                        className="h-10 w-10 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/20"
                    >
                        <Feather name="edit-3" size={16} color={colors.primaryForeground} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => handleDeleteAgent(item._id)}
                        className="h-10 w-10 bg-error/10 rounded-2xl items-center justify-center border border-error/20"
                    >
                        <Feather name="trash-2" size={16} color={colors.error || '#ef4444'} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    if (isCreating) {
        return (
            <ScrollView className="flex-1 py-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                <View className="flex-row items-center justify-between mb-6 px-1">
                    <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{isEditMode ? t('agent.editAgent') : t('agent.createNewAgent')}</Text>
                    <TouchableOpacity onPress={resetForm}>
                        <Text className="text-primary font-bold">{t('agent.cancel')}</Text>
                    </TouchableOpacity>
                </View>

                {/* 1. 角色模板选择 */}
                <PersonaSelector 
                    personas={personas} 
                    selectedPersonaId={selectedPersonaId} 
                    onSelect={(persona) => {
                        setSelectedPersonaId(persona._id);
                        setNewName(persona.displayName);
                        setNewDesc(persona.description || "");
                        setSelectedVoiceId(persona.voiceId || "");
                        setNewAvatar(persona.avatar || "");
                    }} 
                />
                
                {/* 2. 助理外观与基本信息 */}
                <View className="mb-8">
                    <Text className="text-muted-foreground font-bold uppercase text-[10px] mb-4 ml-1 tracking-widest">{t('agent.basicInfo')}</Text>
                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity 
                            onPress={handlePickAvatar}
                            disabled={isUploadingAvatar}
                            className="relative"
                        >
                            <View className="h-20 w-20 rounded-2xl bg-muted border border-border overflow-hidden items-center justify-center">
                                {newAvatar ? (
                                    <Image source={{ uri: newAvatar }} className="h-full w-full" />
                                ) : (
                                    <Feather name="image" size={28} color={colors.foreground} opacity={0.2} />
                                )}
                                {isUploadingAvatar && (
                                    <View className="absolute inset-0 bg-background/60 items-center justify-center">
                                        <ActivityIndicator color={colors.foreground} size="small" />
                                    </View>
                                )}
                            </View>
                            <View className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full items-center justify-center border-2 border-card">
                                <Feather name="camera" size={10} color={colors.primaryForeground} />
                            </View>
                        </TouchableOpacity>
                        
                        <View className="ml-4 flex-1 space-y-3">
                            <TextInput
                                placeholder={t('agent.agentName')}
                                placeholderTextColor={colors.mutedForeground}
                                className="bg-muted rounded-xl p-3 text-foreground border border-border text-sm font-bold"
                                value={newName}
                                onChangeText={setNewName}
                            />
                            <TextInput
                                placeholder={t('agent.shortDescription')}
                                placeholderTextColor={colors.mutedForeground}
                                className="bg-muted rounded-xl p-3 text-foreground border border-border text-sm"
                                value={newDesc}
                                onChangeText={setNewDesc}
                                multiline
                                numberOfLines={2}
                            />
                        </View>
                    </View>
                </View>
                
                <TouchableOpacity 
                    onPress={handleSaveAgent}
                    disabled={isSubmitting || !newName.trim() || !selectedPersonaId}
                    className={`py-5 rounded-[25px] items-center justify-center mb-10 shadow-xl ${isSubmitting || !newName.trim() || !selectedPersonaId ? 'bg-muted' : 'bg-primary'}`}
                    style={!(isSubmitting || !newName.trim() || !selectedPersonaId) ? {
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.3,
                        shadowRadius: 15,
                        elevation: 8
                    } : {}}
                >
                    {isSubmitting ? <ActivityIndicator color={colors.primaryForeground} /> : <Text className={`font-black uppercase tracking-widest ${isSubmitting || !newName.trim() || !selectedPersonaId ? 'text-muted-foreground' : 'text-primary-foreground'}`}>{isEditMode ? t('agent.updateAgent') : t('agent.createAgent')}</Text>}
                </TouchableOpacity>
            </ScrollView>
        );
    }

    return (
        <View className="flex-1">
            <FlatList
                data={agents}
                keyExtractor={item => item._id}
                renderItem={renderAgentItem}
                ListHeaderComponent={
                    <View className="flex-row items-center justify-between mb-4 px-1">
                        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{t('agent.selectAgent')}</Text>
                        <TouchableOpacity 
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setIsManaging(!isManaging);
                            }}
                            className={`px-3 py-1.5 rounded-full border ${isManaging ? 'bg-primary border-primary' : 'bg-muted border-border'}`}
                        >
                            <Text className={`text-[10px] font-bold uppercase ${isManaging ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                {isManaging ? t('agent.done') : t('agent.edit')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                ListFooterComponent={
                    !isManaging ? (
                        <TouchableOpacity 
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setIsCreating(true);
                            }}
                            className="mt-2 py-6 border border-dashed border-border rounded-3xl items-center flex-row justify-center space-x-2"
                        >
                            <Feather name="plus" size={20} color={colors.foreground} className="opacity-40" />
                            <Text className="text-muted-foreground font-bold">{t('agent.createNew')}</Text>
                        </TouchableOpacity>
                    ) : null
                }
        />
        </View>
    );
};

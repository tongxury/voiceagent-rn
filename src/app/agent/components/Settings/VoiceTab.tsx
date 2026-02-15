import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    TextInput,
    Alert,
    Image,
    Modal
} from "react-native";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import * as Haptics from "expo-haptics";
import { upload } from "@/utils/upload/tos";
import { addVoice, listVoices, updateAgentVoice } from "@/api/voiceagent";
import { useTailwindVars } from "@/hooks/useTailwindVars";
import { Voice, Agent } from "@/types";
import { useTranslation } from "@/i18n/translation";
import { useQueryData } from "@/shared/hooks/useQueryData";
import { useQueryClient } from "@tanstack/react-query";
import { AudioPlayer } from "@/shared/components/AudioPlayer";

interface VoiceTabProps {
    activeAgent: Agent | null;
    setActiveAgent: (agent: Agent) => void;
}

export const VoiceTab = ({ activeAgent, setActiveAgent }: VoiceTabProps) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();
    const [isAdding, setIsAdding] = useState(false);
    const [showVoiceList, setShowVoiceList] = useState(false);
    const [voiceName, setVoiceName] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUpdatingAgent, setIsUpdatingAgent] = useState(false);

    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordDuration, setRecordDuration] = useState(0);

    const queryClient = useQueryClient();
    const { data: voicesData, isLoading } = useQueryData<any>({
        queryKey: ['voices'],
        queryFn: () => listVoices(),
    });

    const voices = (voicesData?.list || []) as Voice[];
    const currentVoice = voices.find(v => v._id === activeAgent?.voice?._id);

    const handleSelectVoice = async (voice: Voice) => {
        if (!activeAgent || isUpdatingAgent) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsUpdatingAgent(true);
        try {
            const response = await updateAgentVoice(activeAgent._id, voice._id);
            // Unwrap AxiosResponse.data and ServerPayload.data
            const updatedAgent = (response.data as any).data || response.data;
            setActiveAgent(updatedAgent);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setShowVoiceList(false);
        } catch (error) {
            console.error("Failed to update agent voice", error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsUpdatingAgent(false);
        }
    };

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert(t('agent.permissionDenied'), t('agent.micPermissionNeeded'));
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
            setRecordDuration(0);

            // Start timer
            const interval = setInterval(async () => {
                const status = await recording.getStatusAsync();
                if (status.canRecord) {
                    setRecordDuration(Math.floor(status.durationMillis / 1000));
                }
            }, 1000);

            (recording as any)._interval = interval;

        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        setIsRecording(false);
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            clearInterval((recording as any)._interval);
            setRecording(null);

            if (uri) {
                await processAudioFile(uri, `recorded_voice_${Date.now()}.m4a`, 'audio/x-m4a');
            }
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    };

    const processAudioFile = async (uri: string, name: string, type: string) => {
        setIsUploading(true);
        try {
            const sampleUrl = await upload({
                uri,
                name,
                type,
            }, (progress) => {
                setUploadProgress(progress);
            });

            setIsUploading(false);

            await addVoice({
                name: voiceName || name.split('.')[0],
                sampleUrl: sampleUrl,
                type: 'cloned'
            });

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await queryClient.invalidateQueries({ queryKey: ['voices'] });
            setIsAdding(false);
            setVoiceName("");
            setUploadProgress(0);
        } catch (error: any) {
            console.error("Failed to process audio:", error);
            Alert.alert(t('agent.error'), error.message || t('agent.failedToProcessAudio'));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddVoice = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await processAudioFile(file.uri, file.name, file.mimeType || 'audio/mpeg');
        } catch (error: any) {
            console.error("Failed to select file:", error);
            Alert.alert(t('agent.error'), "Failed to select audio file");
        }
    };

    const renderVoiceItem = ({ item }: { item: Voice }) => {
        const isSelected = activeAgent?.voice?._id === item._id;

        return (
            <TouchableOpacity
                onPress={() => handleSelectVoice(item)}
                disabled={isUpdatingAgent || !activeAgent}
                className={`mb-3 p-4 rounded-3xl flex-row items-center border ${isSelected ? 'bg-primary border-primary' : 'bg-muted border-border'} ${!activeAgent ? 'opacity-50' : ''}`}
            >
                <View className="mr-4">
                    {item.sampleUrl ? (
                        <AudioPlayer
                            id={item.voiceId}
                            url={item.sampleUrl}
                            showLabel={false}
                            className="h-10 w-10 rounded-full"
                            activeClassName={isSelected ? 'bg-primary-foreground/20' : 'bg-primary'}
                            inactiveClassName={isSelected ? 'bg-primary-foreground/20' : 'bg-primary/10'}
                            iconSize={18}
                        />
                    ) : (
                        <View className={`h-10 w-10 rounded-full items-center justify-center ${isSelected ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}>
                            <MaterialCommunityIcons
                                name={(item.type === 'cloned' ? "account-voice" : "robot-voice") as any}
                                size={20}
                                color={isSelected ? colors.primaryForeground : colors.primary}
                            />
                        </View>
                    )}
                </View>
                <View className="flex-1 gap-1.5">
                    <Text className={`font-bold ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>{item.name}</Text>
                    <Text className={`text-xs line-clamp-1 ${isSelected ? 'text-primary-foreground/60' : 'text-muted-foreground'}`} style={{ lineHeight: 16 }}>{item.description}</Text>
                </View>
                {item.status === 'processing' ? (
                    <ActivityIndicator size="small" color={isSelected ? colors.primaryForeground : colors.primary} />
                ) : isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primaryForeground} />
                )}
            </TouchableOpacity>
        );
    };


    return (
        <View className="flex-1">
            <View className="flex-1">
                <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-3 ml-1">
                    {t('agent.currentVoice') || "Current Selection"}
                </Text>
                
                {currentVoice ? (
                    renderVoiceItem({ item: currentVoice })
                ) : (
                    <View className="p-4 rounded-3xl bg-muted border border-border flex-row items-center justify-between">
                        <Text className="text-muted-foreground">{t('agent.noVoiceSelected') || "No voice selected"}</Text>
                    </View>
                )}

                <TouchableOpacity 
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setShowVoiceList(true);
                    }}
                    className="mt-6 py-4 bg-muted/50 border border-border rounded-3xl items-center flex-row justify-center space-x-2 active:bg-muted"
                >
                    <Ionicons name="list" size={20} color={colors.foreground} />
                    <Text className="text-foreground font-bold">{t('agent.changeVoice') || "Change Voice"}</Text>
                </TouchableOpacity>
            </View>

            {/* Voice List Modal - Custom 70% Height Bottom Sheet */}
            <Modal
                visible={showVoiceList}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowVoiceList(false)}
            >
                <TouchableOpacity 
                    className="flex-1 bg-black/50"
                    activeOpacity={1}
                    onPress={() => setShowVoiceList(false)}
                >
                    <TouchableOpacity 
                        activeOpacity={1} 
                        style={{ height: '70%', marginTop: 'auto' }}
                        className="bg-background rounded-t-3xl overflow-hidden"
                    >
                        <View className="flex-1 pt-6">
                            <View className="px-6 flex-row items-center justify-between mb-4">
                                <Text className="text-xl font-bold text-foreground">{t('agent.selectVoice') || "Select Voice"}</Text>
                                <TouchableOpacity 
                                    onPress={() => setShowVoiceList(false)}
                                    className="h-8 w-8 items-center justify-center rounded-full bg-muted"
                                >
                                    <Ionicons name="close" size={20} color={colors.foreground} />
                                </TouchableOpacity>
                            </View>
                            
                            <FlatList
                                data={voices}
                                keyExtractor={(item) => item._id}
                                renderItem={renderVoiceItem}
                                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                                ListHeaderComponent={
                                    false ? (
                                    <TouchableOpacity 
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                            setIsAdding(true);
                                        }}
                                        className="py-6 mb-8 bg-primary/5 border border-dashed border-primary/30 rounded-3xl items-center flex-row justify-center space-x-2"
                                    >
                                        <Feather name="plus" size={20} color={colors.primary} />
                                        <Text className="text-primary font-bold">{t('agent.addCustomVoice')}</Text>
                                    </TouchableOpacity>
                                    ) : null
                                }
                                ListEmptyComponent={
                                    !isLoading ? (
                                        <View className="items-center justify-center py-12">
                                            <MaterialCommunityIcons name="microphone-off" size={48} color={colors.foreground} opacity={0.05} />
                                            <Text className="text-muted-foreground mt-4 opacity-20">{t('agent.noCustomVoices')}</Text>
                                        </View>
                                    ) : null
                                }
                            />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            {/* Nested Modal for Adding Voice */}
            <Modal
                visible={isAdding}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsAdding(false)}
            >
                <View className="flex-1 bg-background pt-6 px-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{t('agent.cloneNewVoice')}</Text>
                        <TouchableOpacity onPress={() => setIsAdding(false)}>
                            <Text className="text-primary font-bold">{t('agent.cancel')}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-muted-foreground mb-2 ml-1 text-sm">{t('agent.voiceName')}</Text>
                    <TextInput
                        placeholder={t('agent.voiceNamePlaceholder')}
                        placeholderTextColor={colors.mutedForeground}
                        className="bg-muted rounded-2xl p-4 text-foreground mb-6 border border-border"
                        value={voiceName}
                        onChangeText={setVoiceName}
                    />

                    <View className="bg-primary/5 border border-dashed border-primary/30 rounded-3xl p-6 items-center justify-center mb-8">
                        {isUploading ? (
                            <View className="items-center py-4">
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text className="text-foreground mt-4 font-bold">{t('agent.uploadingSample', { progress: Math.round(uploadProgress) })}</Text>
                            </View>
                        ) : isRecording ? (
                            <View className="items-center py-4 w-full">
                                <View className="flex-row items-center justify-center mb-4 space-x-2">
                                    <View className="h-2 w-2 rounded-full bg-error animate-pulse" />
                                    <Text className="text-foreground font-mono text-xl">{Math.floor(recordDuration / 60)}:{(recordDuration % 60).toString().padStart(2, '0')}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={stopRecording}
                                    className="h-20 w-20 bg-error rounded-full items-center justify-center shadow-lg shadow-error/50"
                                >
                                    <Ionicons name="stop" size={32} color="white" />
                                </TouchableOpacity>
                                <Text className="text-muted-foreground mt-4 font-medium">{t('agent.tapToFinishRecording')}</Text>
                            </View>
                        ) : (
                            <View className="flex-row w-full justify-around py-4">
                                <TouchableOpacity onPress={handleAddVoice} className="items-center">
                                    <View className="h-16 w-16 bg-muted rounded-full items-center justify-center mb-4 border border-border">
                                        <Feather name="upload-cloud" size={28} color={colors.foreground} />
                                    </View>
                                    <Text className="text-foreground font-bold">{t('agent.uploadFile')}</Text>
                                    <Text className="text-muted-foreground text-[10px] mt-1 italic">MP3/WAV/M4A</Text>
                                </TouchableOpacity>

                                <View className="w-[1px] h-16 bg-border self-center" />

                                <TouchableOpacity onPress={startRecording} className="items-center">
                                    <View className="h-16 w-16 bg-primary rounded-full items-center justify-center mb-4 shadow-lg shadow-primary/30">
                                        <MaterialCommunityIcons name="microphone" size={32} color="white" />
                                    </View>
                                    <Text className="text-foreground font-bold">{t('agent.directRecord')}</Text>
                                    <Text className="text-muted-foreground text-[10px] mt-1 italic">{t('agent.recordNow')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    {!isRecording && !isUploading && (
                        <Text className="text-muted-foreground text-xs text-center px-4">
                            {t('agent.recordBestResults')}
                        </Text>
                    )}
                </View>
            </Modal>
        </View>
    );
};

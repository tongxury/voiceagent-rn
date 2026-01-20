import React from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Modal, 
    TextInput 
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "@/i18n/translation";
import useTailwindVars from "@/hooks/useTailwindVars";

interface MessageModalProps {
    visible: boolean;
    onClose: () => void;
    textInput: string;
    setTextInput: (text: string) => void;
    onSendMessage: (text: string) => void;
}

export const MessageModal = ({ 
    visible, 
    onClose, 
    textInput, 
    setTextInput, 
    onSendMessage 
}: MessageModalProps) => {
    const { colors } = useTailwindVars();
    const { t } = useTranslation();
    return (
        <Modal visible={visible} transparent animationType="fade">
            <BlurView intensity={80} className="flex-1 justify-end px-6 pb-12">
                <TouchableOpacity className="flex-1" onPress={onClose} />
                <View className="bg-card rounded-[45px] p-8 border border-border shadow-2xl">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-black text-foreground">{t('agent.sendMessage')}</Text>
                        <TouchableOpacity onPress={onClose} className="h-10 w-10 bg-muted rounded-full items-center justify-center">
                            <Ionicons name="close" size={24} color={colors.foreground} />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        autoFocus
                        multiline
                        className="bg-muted rounded-3xl p-6 text-foreground text-lg min-h-[150px] border border-border"
                        placeholder={t('agent.messagePlaceholder')}
                        placeholderTextColor={colors.mutedForeground}
                        value={textInput}
                        onChangeText={setTextInput}
                        selectionColor={colors.primary}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            onSendMessage(textInput);
                            setTextInput("");
                            onClose();
                        }}
                        disabled={!textInput.trim()}
                        className={`mt-6 py-5 rounded-[25px] items-center ${textInput.trim() ? 'bg-primary' : 'bg-muted opacity-50'}`}
                    >
                        <Text className={`font-black text-lg ${textInput.trim() ? 'text-white' : 'text-muted-foreground'}`}>{t('agent.sendSignal')}</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Modal>
    );
};

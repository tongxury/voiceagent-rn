import React, { useMemo } from "react";
import { 
    Text, 
    TouchableOpacity, 
    FlatList 
} from "react-native";
import * as Haptics from "expo-haptics";
import { listScenes } from "@/api/voiceagent";
import { useQuery } from "@tanstack/react-query";
import { VoiceScene } from "@/types";
import { useTranslation } from "@/i18n/translation";

interface SceneTabProps {
    activeScene: VoiceScene | null;
    setActiveScene: (scene: VoiceScene) => void;
}

export const SceneTab = ({ activeScene, setActiveScene }: SceneTabProps) => {
    const { t } = useTranslation();
    const { data: scenesRes } = useQuery({
        queryKey: ['scenes'],
        queryFn: () => listScenes(),
    });

    const scenes = useMemo(() => (scenesRes?.data as any)?.data?.list || [], [(scenesRes?.data as any)?.data?.list]);

    const renderSceneItem = ({ item }: { item: VoiceScene }) => (
        <TouchableOpacity 
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveScene(item);
            }}
            className={`mb-3 p-5 rounded-3xl border ${activeScene?._id === item._id ? 'bg-primary border-primary' : 'bg-muted border-border'}`}
        >
            <Text className={`font-bold text-lg ${activeScene?._id === item._id ? 'text-white' : 'text-foreground'}`}>{item.name}</Text>
            <Text className={`text-xs mt-1 ${activeScene?._id === item._id ? 'text-white/60' : 'text-muted-foreground'}`}>{item.desc}</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={scenes}
            keyExtractor={item => item._id}
            renderItem={renderSceneItem}
            ListHeaderComponent={<Text className="text-muted-foreground text-xs font-bold uppercase mb-4 tracking-widest">{t('agent.selectAtmosphere')}</Text>}
        />
    );
};

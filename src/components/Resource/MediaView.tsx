import React, {useEffect, useState} from "react";
import {Image, Text, View} from "react-native";
import {Resource} from "@/types";
import {useTranslation} from "@/i18n/translation";
import {isMedia, isVideo} from "@/utils/resource";
import {getUrl} from "@/utils";
import {Feather} from "@expo/vector-icons";

interface MediaViewProps {
    item: Resource;
    index?: number; 
    onPress?: () => void;
    width?: number;
    height?: number;
}

const MediaView = ({
                       item,
                       index,
                       // onPress,
                       width = 150,
                       height = 180,
                   }: MediaViewProps) => {
    const {t} = useTranslation();
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        getUrl(item).then((r) => {
            setUrl(r || "");
        });
    }, [item]);

    if (!isMedia(item)) {
        return <></>;
    }

    if (!url) {
        return (
            <View
                className={`rounded-[10px] bg-background border border-border`}
                style={{width, height}}
            />
        );
    }

    return (
        <View className="relative">
            <Image
                source={{uri: url}}
                className={`rounded-[10px] bg-card border border-border`}
                style={{width, height}}
                resizeMode="cover"
                fadeDuration={0}
            />

            {isVideo(item) && (
                <View
                    className="absolute bottom-2 left-2 flex-row items-center px-1.5 py-0.5 rounded-xl bg-black/60">
                    <Feather
                        name="video"
                        size={12}
                        color="#fff"
                        style={{marginRight: 4}}
                    />
                    <Text
                        className="text-white text-xs font-medium"
                        style={{
                            textShadowColor: "rgba(0, 0, 0, 0.3)",
                            textShadowOffset: {width: 0, height: 1},
                            textShadowRadius: 1,
                        }}
                    >
                        {t("video")}
                    </Text>
                </View>
            )}

            {typeof index === "number" && (
                <View
                    className="absolute top-0 right-0 w-6 h-5 rounded-bl-lg justify-center items-center bg-black/60"
                >
                    <Text
                        className="text-white text-sm font-semibold"
                        style={{
                            textShadowColor: "rgba(0, 0, 0, 0.3)",
                            textShadowOffset: {width: 0, height: 1},
                            textShadowRadius: 2,
                        }}
                    >
                        {index}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default MediaView;

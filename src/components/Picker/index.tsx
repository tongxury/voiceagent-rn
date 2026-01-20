import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Platform,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {MaterialIcons} from "@expo/vector-icons";
import {Resource} from "@/types";
import {useTranslation} from "@/i18n/translation";
import {getUrl} from "@/utils";
import {useColors} from "@/hooks/useColors";
import MediaView from "@/components/Resource/MediaView";
import VideoPlayer from "@/components/VideoPlayer";

interface PickerProps {
    files?: Resource[];
    onChange?: (files: Resource[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    allowedTypes?: ("image" | "video" | "all")[];
    showPreview?: boolean;
    selectFilesTitle?: string;
}

const Picker = ({
                    files = [],
                    onChange,
                    maxFiles = 5,
                    maxSizeMB = 1000,
                    allowedTypes = ["image", "video"],
                    selectFilesTitle = "",
                    showPreview = true,
                }: PickerProps) => {
    const {t} = useTranslation();
    const colors = useColors();
    const [visible, setIsVisible] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<
        { id: string; uri: string; targetUri: string; isVideo: boolean }[]
    >([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const existingUris = useMemo(() => {
        const uris = new Set<string>();
        files?.filter((x) => x.uri).forEach((item) => uris.add(item.uri!));
        return uris;
    }, [files]);

    // 获取屏幕宽度
    const {width: screenWidth} = Dimensions.get("window");

    // 判断是否为视频文件 - 只支持iOS原生支持的格式
    const isVideoFile = useCallback((resource: Resource) => {
        // iOS AVFoundation 支持的主要视频格式
        const supportedVideoTypes = [
            "video/mp4",
            "video/quicktime", // .mov
            "video/x-m4v",
        ];

        const supportedExtensions = [".mp4", ".mov", ".m4v"];

        // 检查MIME类型
        if (resource.mimeType) {
            return supportedVideoTypes.includes(resource.mimeType);
        }

        // 检查文件扩展名
        if (resource.uri) {
            const uri = resource.uri.toLowerCase();
            return supportedExtensions.some((ext) => uri.includes(ext));
        }

        return false;
    }, []);

    useEffect(() => {
        (async () => {
            const {status: mediaLibraryStatus} =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            const {status: cameraStatus} =
                await ImagePicker.requestCameraPermissionsAsync();

            setHasPermission(
                mediaLibraryStatus === "granted" && cameraStatus === "granted"
            );

            if (mediaLibraryStatus !== "granted" || cameraStatus !== "granted") {
                Alert.alert(t("needPermission"), t("allowAccessToAlbumAndCamera"), [
                    {text: t("ok"), style: "default"},
                ]);
            }
        })();
    }, [t]);

    const processSelectedMedia = useCallback(
        async (assets: any[]) => {
            if (assets.length === 0) return;
            setIsProcessing(true);

            try {
                const assetsToProcess = assets.slice(0, maxFiles - files.length);
                const fileInfoPromises = assetsToProcess.map((asset) =>
                    FileSystem.getInfoAsync(asset.uri, {size: true})
                );
                const fileInfos = await Promise.all(fileInfoPromises);
                const newItems: Resource[] = [];

                for (let i = 0; i < assetsToProcess.length; i++) {
                    const asset = assetsToProcess[i];
                    const fileInfo = fileInfos[i];

                    if (existingUris.has(asset.uri)) continue;
                    if (!fileInfo.exists || fileInfo.size > maxSizeMB * 1024 * 1024)
                        continue;

                    const type =
                        asset.type || (asset.uri.endsWith(".mp4") ? "video" : "image");
                    const mimeType = type === "video" ? "video/mp4" : "image/jpeg";
                    const timestamp = Date.now() + i;
                    const fileName =
                        asset.fileName ||
                        `${type === "video" ? "video" : "image"}_${timestamp}.${
                            type === "video" ? "mp4" : "jpg"
                        }`;

                    newItems.push({
                        uri: asset.uri,
                        name: fileName,
                        mimeType: mimeType,
                        type: mimeType,
                        size: fileInfo.size,
                        width: asset.width,
                        height: asset.height,
                        duration: asset.duration,
                        id: `media_${timestamp}_${Math.random()
                            .toString(36)
                            .substring(2, 9)}`,
                        progress: 0,
                        uploaded: false,
                    });
                }

                if (newItems.length > 0 && onChange) {
                    onChange([...files, ...newItems]);
                }
            } catch (error) {
                console.error("批量处理媒体文件出错:", error);
                Alert.alert(t("error"), t("processMediaFilesFailed"));
            } finally {
                setIsProcessing(false);
            }
        },
        [files, maxFiles, maxSizeMB, existingUris, onChange, t]
    );

    const pickFromGallery = async () => {
        try {
            if (files.length >= maxFiles) {
                Alert.alert(
                    t("tip"),
                    t("maxFilesLimit").replace("{maxFiles}", maxFiles.toString())
                );
                return;
            }

            let mediaTypes = ImagePicker.MediaTypeOptions.All;
            if (allowedTypes.includes("image") && !allowedTypes.includes("video")) {
                mediaTypes = ImagePicker.MediaTypeOptions.Images;
            } else if (
                allowedTypes.includes("video") &&
                !allowedTypes.includes("image")
            ) {
                mediaTypes = ImagePicker.MediaTypeOptions.Videos;
            }

            const remainingSlots = maxFiles - files.length;
            setIsProcessing(true);

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes,
                allowsEditing: false,
                allowsMultipleSelection: true,
                selectionLimit: remainingSlots,
                quality: 0.5,
                exif: false,
                base64: false,
            });

            if (result.canceled) {
                setIsProcessing(false);
                return;
            }

            processSelectedMedia(result.assets);
        } catch (error) {
            console.error("选择媒体文件出错:", error);
            Alert.alert(t("error"), t("selectMediaFilesFailed"));
            setIsProcessing(false);
        }
    };

    const openPreview = async (startIndex: number = 0) => {
        const urls = await Promise.all(files.map((r) => getUrl(r)));
        setPreviewUrls(
            files.map((e, k) => ({
                id: e.id,
                uri: urls[k],
                targetUri: e.uri,
                isVideo: isVideoFile(e),
            } as any))
        );
        setCurrentIndex(startIndex);
        setIsVisible(true);
    };

    const removeItem = useCallback(
        (resource: Resource) => {
            if (onChange) {
                onChange(files.filter((item) => item?.id !== resource?.id));
                const list = previewUrls.filter((item) => item.id !== resource?.id);
                setPreviewUrls(list);

                if (list.length === 0) {
                    setIsVisible(false);
                    setCurrentIndex(0);
                } else {
                    // 调整索引，确保不越界
                    if (currentIndex >= list.length) {
                        setCurrentIndex(list.length - 1);
                    }
                }
            }
        },
        [files, onChange, previewUrls, currentIndex]
    );

    const formatFileSize = useCallback((bytes?: number): string => {
        if (!bytes) return "未知大小";
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }, []);

    const formatDuration = useCallback((seconds?: number): string => {
        if (!seconds) return "";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    const galleryButtonStyle = {
        ...Platform.select({
            ios: {
                shadowColor: colors.primary,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    };

    return (
        <View className={"flex-col"}>
            <FlatList
                data={[...files, {addComponent: true}]}
                ItemSeparatorComponent={() => (
                    <View style={{width: 10, height: 10}}></View>
                )}
                renderItem={({item: resource, index}) => {
                    if (resource.addComponent) {
                        if (files?.length >= maxFiles) {
                            return <></>;
                        }

                        return (
                            <TouchableOpacity onPress={pickFromGallery}>
                                <View
                                    className="w-[150px] h-[180px] rounded-[10px] flex-row items-center p-[10px] gap-2 justify-center border-dashed border border-border overflow-hidden"
                                    style={galleryButtonStyle}
                                >
                                    {isProcessing ? (
                                        <>
                                            <ActivityIndicator size="small" color={colors.mutedForeground}/>
                                            <Text className="text-muted-foreground text-md font-medium" numberOfLines={1}>
                                                {t("adding")}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <MaterialIcons
                                                name="photo-library"
                                                size={18}
                                                color={colors.mutedForeground}
                                            />
                                            <Text className="text-muted-foreground text-sm" numberOfLines={1}>
                                                {selectFilesTitle || ` ${t("selectFiles")}(${files?.length || 0}/${maxFiles})`}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    } else {
                        return (
                            <MediaView
                                item={resource}
                                index={index + 1}
                                onPress={() => openPreview(index)}
                            />
                        );
                    }
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
            />

            {/* 混合预览模态框（图片+视频） */}
            <Modal
                visible={visible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsVisible(false)}
            >
                <View className={'flex-1 bg-background'}>
                    {/* 右上角关闭按钮 */}
                    <View
                        style={{
                            position: "absolute",
                            top: 50,
                            right: 20,
                            zIndex: 1000,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setIsVisible(false)}
                            className="bg-black/20 px-[5px] py-[5px] rounded-full"
                        >
                            <MaterialIcons name="close" size={20} color="white"/>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={previewUrls}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `preview_${item.id}`}
                        initialScrollIndex={currentIndex}
                        getItemLayout={(data, index) => ({
                            length: screenWidth,
                            offset: screenWidth * index,
                            index,
                        })}
                        onMomentumScrollBegin={(event) => {
                            const index = Math.round(
                                event.nativeEvent.contentOffset.x / screenWidth
                            );
                            setCurrentIndex(index);
                        }}
                        renderItem={({item, index}) => {
                            const isCurrentPage = index === currentIndex;

                            return (
                                <View style={{width: screenWidth, flex: 1}}>
                                    {item.isVideo ? (
                                        // 渲染视频播放器
                                        <VideoPlayer
                                            uri={item.targetUri}
                                            isActive={isCurrentPage}
                                            itemId={item.id}
                                            style={{
                                                flex: 1,
                                            }}
                                            showControls={true}
                                        />
                                    ) : (
                                        // 渲染图片
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Image
                                                source={{uri: item.uri}}
                                                style={{
                                                    width: screenWidth,
                                                    height: "80%",
                                                }}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    )}
                                </View>
                            );
                        }}
                        removeClippedSubviews={false}
                        windowSize={3}
                        maxToRenderPerBatch={1}
                        updateCellsBatchingPeriod={100}
                        disableIntervalMomentum={true}
                        initialNumToRender={1}
                        scrollEventThrottle={16}
                        decelerationRate="fast"
                        snapToInterval={screenWidth}
                        snapToAlignment="start"
                    />

                    {/* 底部浮动控制栏 */}
                    <View
                        style={{
                            position: "absolute",
                            bottom: 40,
                            left: 20,
                            right: 20,
                            zIndex: 1000,
                        }}
                    >
                        <View className="flex-row justify-between items-center">
                            <View className="bg-white/20 px-[15px] py-[7px] rounded-full">
                                <Text className="text-white text-sm">
                                    {currentIndex + 1} / {previewUrls?.length || 0}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => removeItem(files[currentIndex])}
                                className="bg-black/20 px-[15px] py-[7px] rounded-full flex-row items-center gap-[5px]"
                            >
                                <MaterialIcons name="delete" size={16} color={colors.foreground}/>
                                <Text className="text-white">{t("delete")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Picker;

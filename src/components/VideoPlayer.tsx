import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Video from "react-native-video";
import { useTranslation } from "@/i18n/translation";

interface VideoPlayerProps {
  uri: string;
  isActive?: boolean;
  itemId?: string;
  style?: any;
  onError?: (error: any) => void;
  onLoad?: () => void;
  showControls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  isActive = true,
  itemId,
  style,
  onError,
  onLoad,
  showControls = true,
}) => {
  const { t } = useTranslation();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localVideoPlaying, setLocalVideoPlaying] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (!isActive) {
      setLocalVideoPlaying(false);
      setIsVideoEnded(false);
    }
  }, [isActive]);

  const handlePlayPause = () => {
    if (isVideoEnded) {
      setIsVideoEnded(false);
      setLocalVideoPlaying(true);
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
    } else {
      setLocalVideoPlaying(!localVideoPlaying);
    }
  };

  const handleError = (error: any) => {
    console.log(t("videoPlaybackError"), error);
    setHasError(true);
    setIsLoading(false);
    onError?.(error);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setIsVideoEnded(false);
    onLoad?.();
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    setIsVideoEnded(false);
  };

  const handleEnd = () => {
    setLocalVideoPlaying(false);
    setIsVideoEnded(true);
  };

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      {hasError ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <MaterialIcons name="error-outline" size={48} color="#666" />
          <Text
            style={{
              color: "#999",
              textAlign: "center",
              marginTop: 10,
              fontSize: 16,
            }}
          >
            {t("videoFormatNotSupported")}
          </Text>
          <Text
            style={{
              color: "#666",
              textAlign: "center",
              marginTop: 5,
              fontSize: 12,
            }}
          >
            {t("useMP4OrMOVFormat")}
          </Text>
        </View>
      ) : (
        <>
          <Video
            ref={videoRef}
            key={itemId}
            source={{ uri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
            paused={!isActive || !localVideoPlaying}
            repeat={false}
            playInBackground={false}
            playWhenInactive={false}
            controls={false}
            onError={handleError}
            onLoad={handleLoad}
            onLoadStart={handleLoadStart}
            onEnd={handleEnd}
          />

          {isLoading && (
            <View
              style={{
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="white" />
            </View>
          )}

          {!isLoading && !hasError && showControls && (
            <TouchableOpacity
              style={{
                position: "absolute",
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handlePlayPause}
            >
              <MaterialIcons
                name={
                  isVideoEnded
                    ? "replay"
                    : localVideoPlaying
                    ? "pause"
                    : "play-arrow"
                }
                size={30}
                color="white"
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default VideoPlayer;

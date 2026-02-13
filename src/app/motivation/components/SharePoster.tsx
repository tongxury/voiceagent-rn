import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from "@/i18n/translation";
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useTailwindVars from "@/hooks/useTailwindVars";

const { width } = Dimensions.get('window');
const POSTER_WIDTH = width * 0.9;
const POSTER_HEIGHT = POSTER_WIDTH * 1.6;

interface SharePosterProps {
  data: {
    text: string;
    userName: string;
    userAvatar: string;
    agentName: string;
    agentAvatar: string;
    emotionTag: string;
    shareUrl: string;
  };
}

export const SharePoster = forwardRef<ViewShot, SharePosterProps>(({ data }, ref) => {
  const { colors } = useTailwindVars();
  const { t } = useTranslation()

  // 根据情感获取颜色主题
  const getTheme = () => {
    switch (data.emotionTag) {
      case 'energetic':
        return {
          colors: ['#f59e0b', '#ef4444'],
          icon: 'lightning-bolt',
          label: t('agent.motivationPoster.energy')
        };
      case 'comfort':
        return {
          colors: ['#3b82f6', '#2dd4bf'],
          icon: 'leaf',
          label: t('agent.motivationPoster.heal')
        };
      case 'encouraging':
      default:
        return {
          colors: ['#8b5cf6', '#d946ef'],
          icon: 'star',
          label: t('agent.motivationPoster.encourage')
        };
    }
  };

  const theme = getTheme();

  return (
    <View style={styles.offscreenContainer}>
      <ViewShot ref={ref} options={{ format: 'jpg', quality: 0.9 }}>
        <View style={[styles.poster, { width: POSTER_WIDTH, height: POSTER_HEIGHT }]}>
          {/* 背景渐变 */}
          <LinearGradient
            colors={theme.colors as any}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          {/* 装饰纹理 (半透明叠加) */}
          <View style={styles.overlay}>
            <MaterialCommunityIcons
              name="format-quote-open"
              size={120}
              color="white"
              style={{ opacity: 0.1, position: 'absolute', top: 40, left: 20 }}
            />
          </View>

          {/* 顶部：Agent 信息 */}
          <View style={styles.header}>
            <View style={styles.agentInfo}>
              <View style={styles.avatarRing}>
                <Image source={{ uri: data.agentAvatar }} style={styles.avatar} />
              </View>
              <View>
                <Text style={styles.agentName}>{data.agentName}</Text>
                <View style={styles.tag}>
                  <MaterialCommunityIcons name={theme.icon as any} size={12} color="white" />
                  <Text style={styles.tagText}>{theme.label}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 中间：正文内容 */}
          <View style={styles.content}>
            <Text style={styles.mainText} numberOfLines={8}>
              {data.text}
            </Text>
          </View>

          {/* 底部：用户信息 + 二维码 */}
          <View style={styles.footer}>
            <View style={styles.userInfo}>
              <View style={styles.userRow}>
                <Image source={{ uri: data.userAvatar }} style={styles.userAvatar} />
                <Text style={styles.userName}>{data.userName} {t('agent.motivationPoster.voicePrint')}</Text>
              </View>
              <Text style={styles.brand}>VoiceMark by VoiceAgent</Text>
            </View>

            <View style={styles.qrContainer}>
              <QRCode
                value={data.shareUrl}
                size={60}
                backgroundColor="transparent"
                color="white"
              />
              <Text style={styles.qrTip}>{t('agent.motivationPoster.scan')}</Text>
            </View>
          </View>
        </View>
      </ViewShot>
    </View>
  );
});

const styles = StyleSheet.create({
  offscreenContainer: {
    position: 'absolute',
    left: -9999, // 渲染在屏幕外进行截图
    top: 0,
  },
  poster: {
    padding: 30,
    justifyContent: 'space-between',
    borderRadius: 0, // 截图不需要圆角，方便保存
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 40,
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
  },
  agentName: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    marginBottom: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    color: 'white',
    marginLeft: 4,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  mainText: {
    fontSize: 28,
    lineHeight: 42,
    color: 'white',
    fontWeight: '700',
    textAlign: 'left',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 25,
  },
  userInfo: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    fontWeight: '600',
  },
  brand: {
    fontSize: 12,
    color: 'white',
    opacity: 0.6,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrTip: {
    fontSize: 10,
    color: 'white',
    marginTop: 6,
    opacity: 0.8,
  }
});

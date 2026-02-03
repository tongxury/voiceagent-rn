import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { generateCartesiaToken } from '@/api/voiceagent';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// -----------------------------------------------------------------------------
// Cartesia 原生 WebSocket 实现方案
// -----------------------------------------------------------------------------
// 不使用官方 JS SDK，因为该 SDK 深度依赖 Node.js 核心模块 (https/stream/ws)，
// 在 React Native 这种原生非 Node 环境中会引发严重的 Bundling 错误。
// 直接使用 React Native 内建的 WebSocket API 是最稳健的方案。
// -----------------------------------------------------------------------------

interface CartesiaCallViewProps {
    agentId: string;
    onClose: () => void;
}

export const CartesiaCallView: React.FC<CartesiaCallViewProps> = ({ agentId, onClose }) => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        initCartesia();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const initCartesia = async () => {
        try {
            setStatus('connecting');

            // 1. 从后端获取临时 Token (后端接口：/api/va/cartesia/token)
            const res = await generateCartesiaToken();
            // 兼容性处理：检查 res.data.accessToken 或 res.data.data.accessToken
            const accessToken = (res.data as any)?.accessToken || (res.data as any)?.data?.accessToken;

            if (!accessToken) {
                console.error('[Cartesia] No access token found in response:', res.data);
                setStatus('error');
                return;
            }

            // 2. 构造连接 URL
            // 必须包含 cartesia_version 和 access_token 两个参数
            const CARTESIA_VERSION = '2024-06-10';
            const wsUrl = `wss://api.cartesia.ai/tts/websocket?cartesia_version=${CARTESIA_VERSION}&api_key=${accessToken}`;

            // 3. 建立原生 WebSocket 连接
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[Cartesia] WebSocket Connected');
                setStatus('connected');
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'chunk') {
                        // data.data 包含 Base64 编码的音频帧
                        // console.log('[Cartesia] Received audio chunk');
                        // 此处应将 base64 数据传给原生的 Audio 模块进行播放
                    } else if (data.type === 'error') {
                        console.error('[Cartesia] Server Error:', data.message);
                    }
                } catch (e) {
                    console.error('[Cartesia] Parse Message Error:', e);
                }
            };

            ws.onerror = (e) => {
                console.error('[Cartesia] WebSocket Error:', e);
                setStatus('error');
            };

            ws.onclose = (e) => {
                console.log('[Cartesia] WebSocket Closed:', e.code, e.reason);
                if (status !== 'idle') setStatus('idle');
            };

        } catch (err) {
            console.error('[Cartesia] Init Error:', err);
            setStatus('error');
        }
    };

    const speak = async (text: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.warn('[Cartesia] Socket not ready');
            return;
        }

        try {
            // 构造符合 Cartesia 协议的消息格式
            const message = {
                model_id: 'sonic-english',
                voice: {
                    mode: 'id',
                    id: 'fb9afd81-bc44-429a-8e99-4676527582b1', // 默认音色，生产环境可由业务控制
                },
                output_format: {
                    container: 'raw',
                    encoding: 'pcm_f32le',
                    sample_rate: 44100,
                },
                transcript: text,
                context_id: 'conversation-mvp-' + Date.now(),
            };

            wsRef.current.send(JSON.stringify(message));
            console.log('[Cartesia] Sent text to speak');
        } catch (err) {
            console.error('[Cartesia] Send Error:', err);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-black/90 p-6">
            <Text className="text-white text-2xl font-bold mb-8">Cartesia Native MVP</Text>

            {status === 'connecting' && (
                <ActivityIndicator size="large" color="#00ff00" />
            )}

            {status === 'connected' && (
                <View className="items-center">
                    <View className="w-32 h-32 bg-green-500/20 rounded-full items-center justify-center border-2 border-green-500 mb-8">
                        <Ionicons name="mic" size={64} color="#00ff00" />
                    </View>
                    <Text className="text-green-500 mb-8 font-medium">Native WebSocket Connected</Text>

                    <TouchableOpacity
                        onPress={() => speak("Hello, I am your AURA AI therapist. Using native sockets now.")}
                        className="bg-white px-8 py-4 rounded-full mb-4"
                    >
                        <Text className="text-black font-bold text-lg">Test Voice Response</Text>
                    </TouchableOpacity>

                    <Text className="text-gray-400 text-xs mt-4">No Node.js polyfills required</Text>
                </View>
            )}

            {status === 'error' && (
                <View className="items-center">
                    <Text className="text-red-500 mb-4">Connection Failed</Text>
                    <TouchableOpacity onPress={initCartesia} className="bg-red-500/20 px-4 py-2 rounded-lg">
                        <Text className="text-red-500">Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                onPress={onClose}
                className="absolute top-12 right-6"
            >
                <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
};

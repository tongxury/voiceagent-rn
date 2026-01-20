import EventSource from 'react-native-sse';
import {getAuthToken} from '@/utils';
import {useState, useRef} from 'react';
import {getConfig} from "@/config";

const useEventSource = () => {
    const [text, setText] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);
    const isActiveRef = useRef<boolean>(false);

    const startPolling = async ({questionId, onMessage, onComplete}: {
        questionId: string,
        onMessage?: (message: string) => void
        onComplete?: () => void
    }) => {
        try {
            // 防止重复请求
            if (isActiveRef.current) {
                console.log('Request already active, ignoring');
                return;
            }

            // 清理之前的连接
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }

            isActiveRef.current = true;
            setText('');
            setIsConnecting(true);
            setIsCompleted(false);

            const token = await getAuthToken();
            const apiUrl = `${getConfig().API_URL}/api/ag/v1/answer-chunks-stream`;

            const eventSource = new EventSource(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    questionId,
                }),
            });

            // 保存引用以便后续关闭
            eventSourceRef.current = eventSource;

            // 监听事件
            eventSource.addEventListener('open', (event) => {
                if (!isActiveRef.current) return;
                console.log('Connection opened', event);
                setIsConnecting(false);
            });

            eventSource.addEventListener('message', (event) => {
                if (!isActiveRef.current) return;

                try {
                    const obj = JSON.parse(event.data || '{}');
                    console.log('Received message', '');

                    if (obj.data) {
                        onMessage?.(obj.data);
                        setText(prevState => prevState + obj.data);
                    }

                    // 当收到完成信号时
                    if (obj.code === 1000) {
                        console.log('Stream completed');
                        setIsCompleted(true);
                        setIsConnecting(false);
                        isActiveRef.current = false; // 标记为非活跃状态
                        onComplete?.();

                        // 关闭连接
                        if (eventSourceRef.current) {
                            eventSourceRef.current.close();
                            eventSourceRef.current = null;
                        }
                    }

                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });

            eventSource.addEventListener('error', (error) => {
                if (!isActiveRef.current) return;

                console.error('EventSource error:', error);
                setIsConnecting(false);
                isActiveRef.current = false; // 标记为非活跃状态

                // 关闭连接，防止自动重连
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                    eventSourceRef.current = null;
                }
            });

            eventSource.addEventListener('close', () => {
                if (!isActiveRef.current) return;

                console.log('Connection closed by server');
                setIsConnecting(false);
                isActiveRef.current = false; // 标记为非活跃状态

                if (eventSourceRef.current) {
                    eventSourceRef.current = null;
                }
            });

        } catch (error) {
            console.error('Failed to create EventSource:', error);
            setIsConnecting(false);
            isActiveRef.current = false;
        }
    };

    // 手动停止连接的方法
    const stopPolling = () => {
        console.log('Manually stopping polling');
        isActiveRef.current = false; // 先标记为非活跃状态
        setIsConnecting(false);
        setIsCompleted(false);

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    };

    // 重置文本内容
    const resetText = () => {
        setText('');
    };

    return {
        text,
        isConnecting,
        isCompleted,
        startPolling,
        stopPolling,
        resetText,
    };
};

export default useEventSource;

import { useEffect, useRef, useState, useCallback } from 'react';

export default function StreamViewer() {
    const [imageUrl, setImageUrl] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connectWebSocket = useCallback(() => {
        try {
            setIsConnecting(true);
            const WS_URL = 'ws://192.168.0.7:8080';
            wsRef.current = new WebSocket(WS_URL);

            wsRef.current.onopen = () => {
                console.log('WebSocket 연결됨');
                setIsConnecting(false);
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type === 'stream') {
                        setImageUrl(`data:image/jpeg;base64,${message.data}`);
                    }
                } catch (error) {
                    console.error('스트림 데이터 처리 오류:', error);
                }
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket 오류:', error);
                if (!isConnecting) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log('WebSocket 재연결 시도...');
                        connectWebSocket();
                    }, 3000);
                }
            };

            wsRef.current.onclose = () => {
                console.log('WebSocket 연결 종료');
                if (!isConnecting) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        console.log('WebSocket 재연결 시도...');
                        connectWebSocket();
                    }, 3000);
                }
            };
        } catch (error) {
            console.error('WebSocket 연결 실패:', error);
            if (!isConnecting) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('WebSocket 재연결 시도...');
                    connectWebSocket();
                }, 3000);
            }
        }
    }, [isConnecting]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            clearTimeout(reconnectTimeoutRef.current);
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connectWebSocket]);

    return (
        <div>
            <h1>Camera Stream</h1>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Camera Stream"
                    style={{ width: '100%', height: 'auto' }}
                />
            ) : (
                <div>
                    {isConnecting ? '연결 시도 중...' : '스트림 로딩 중...'}
                </div>
            )}
        </div>
    );
}

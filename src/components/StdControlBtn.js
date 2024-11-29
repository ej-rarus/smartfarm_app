import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../App.css';

function StdControlBtn() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [deviceStates, setDeviceStates] = useState({
    light: false,
    fan: false,
    pump: false
  });
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  const connectWebSocket = useCallback(() => {
    try {
      ws.current = new WebSocket('ws://3.39.126.121:3000');

      ws.current.onopen = () => {
        console.log('웹소켓 연결 성공');
        setIsConnected(true);
        setError(null);
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
      };

      ws.current.onerror = (error) => {
        console.error('웹소켓 에러:', error);
        setError('웹소켓 연결 중 오류가 발생했습니다.');
        setIsConnected(false);
      };

      ws.current.onclose = () => {
        console.log('웹소켓 연결 종료');
        setIsConnected(false);
        reconnectTimeout.current = setTimeout(() => {
          console.log('웹소켓 재연결 시도...');
          connectWebSocket();
        }, 3000);
      };
    } catch (err) {
      console.error('웹소켓 연결 실패:', err);
      setError('웹소켓 연결에 실패했습니다.');
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connectWebSocket]);

  const handleControl = (device, action) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(`${device}_${action}`);
      setDeviceStates(prev => ({
        ...prev,
        [device]: action === 'on'
      }));
    } else {
      setError('웹소켓이 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="control-btn-container">
      <div className="connection-status">
        연결 상태: {isConnected ? 
          <span className="connected">연결됨</span> : 
          <span className="disconnected">연결 끊김</span>
        }
      </div>
      
      <div className="control-sets">
        <div className="control-set">
          <span className="device-label">조명</span>
          <div className="btn-group">
            <button 
              className="control-btn on-btn"
              onClick={() => handleControl('light', 'on')}
              disabled={!isConnected}
            >
              켜기
            </button>
            <button 
              className="control-btn off-btn"
              onClick={() => handleControl('light', 'off')}
              disabled={!isConnected}
            >
              끄기
            </button>
            <span className={`status-indicator ${deviceStates.light ? 'on' : 'off'}`}>
              {deviceStates.light ? '켜짐' : '꺼짐'}
            </span>
          </div>
        </div>

        <div className="control-set">
          <span className="device-label">팬</span>
          <div className="btn-group">
            <button 
              className="control-btn on-btn"
              onClick={() => handleControl('fan', 'on')}
              disabled={!isConnected}
            >
              켜기
            </button>
            <button 
              className="control-btn off-btn"
              onClick={() => handleControl('fan', 'off')}
              disabled={!isConnected}
            >
              끄기
            </button>
            <span className={`status-indicator ${deviceStates.fan ? 'on' : 'off'}`}>
              {deviceStates.fan ? '켜짐' : '꺼짐'}
            </span>
          </div>
        </div>

        <div className="control-set">
          <span className="device-label">펌프</span>
          <div className="btn-group">
            <button 
              className="control-btn on-btn"
              onClick={() => handleControl('pump', 'on')}
              disabled={!isConnected}
            >
              켜기
            </button>
            <button 
              className="control-btn off-btn"
              onClick={() => handleControl('pump', 'off')}
              disabled={!isConnected}
            >
              끄기
            </button>
            <span className={`status-indicator ${deviceStates.pump ? 'on' : 'off'}`}>
              {deviceStates.pump ? '켜짐' : '꺼짐'}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default StdControlBtn;

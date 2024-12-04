import React, { useState, useEffect } from 'react';

function StdControlBtn({ ws }) {
  const [deviceStates, setDeviceStates] = useState({
    device1: false,
    device2: false,
    device3: false,
    device4: false
  });

  const toggleDevice = (device) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      // 현재 상태의 반대값을 계산
      const newState = !deviceStates[device];
      
      // 디바이스별 명령어 설정
      let command = '';
      switch(device) {
        case 'device1':
          command = newState ? 'fan_on' : 'fan_off';
          break;
        case 'device2':
          command = newState ? 'light_on' : 'light_off';
          break;
        case 'device3':
          command = newState ? 'water_on' : 'water_off';
          break;
        case 'device4':
          command = newState ? 'window_on' : 'window_off';
          break;
        default:
          break;
      }

      // 웹소켓으로 명령어 전송
      ws.current.send(command);
      
      // UI 상태 업데이트
      setDeviceStates(prev => ({
        ...prev,
        [device]: newState
      }));
    } else {
      console.error('WebSocket is not connected');
      // 필요하다면 여기에 에러 처리 로직 추가
    }
  };

  // 웹소켓 메시지 수신 처리
  useEffect(() => {
    if (ws.current) {
      const wsInstance = ws.current;  // ref 값을 지역 변수에 저장
      const handleMessage = (event) => {
        const response = event.data;
        // 서버 응답에 따라 상태 업데이트
        if (response.includes('fan_on')) setDeviceStates(prev => ({ ...prev, device1: true }));
        if (response.includes('fan_off')) setDeviceStates(prev => ({ ...prev, device1: false }));
        if (response.includes('light_on')) setDeviceStates(prev => ({ ...prev, device2: true }));
        if (response.includes('light_off')) setDeviceStates(prev => ({ ...prev, device2: false }));
        if (response.includes('water_on')) setDeviceStates(prev => ({ ...prev, device3: true }));
        if (response.includes('water_off')) setDeviceStates(prev => ({ ...prev, device3: false }));
        if (response.includes('window_on')) setDeviceStates(prev => ({ ...prev, device4: true }));
        if (response.includes('window_off')) setDeviceStates(prev => ({ ...prev, device4: false }));
      };

      wsInstance.addEventListener('message', handleMessage);
      return () => wsInstance.removeEventListener('message', handleMessage);
    }
  }, [ws]);

  return (
    <div className="control-btn-container">
      <div className="control-sets">
        {Object.entries(deviceStates).map(([device, isOn]) => (
          <div className="control-set" key={device}>
            <span className="device-label">
              {device === 'device1' && '환풍기'}
              {device === 'device2' && '조명'}
              {device === 'device3' && '급수'}
              {device === 'device4' && '창문'}
            </span>
            <button
              className={`toggle-btn ${isOn ? 'on' : 'off'}`}
              onClick={() => toggleDevice(device)}
            >
              {isOn ? 'ON' : 'OFF'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StdControlBtn;

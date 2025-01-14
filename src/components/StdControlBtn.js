import React, { useState, useEffect } from 'react';

function StdControlBtn({ ws }) {
  const [deviceStates, setDeviceStates] = useState(() => {
    const savedStates = localStorage.getItem('deviceStates');
    return savedStates ? JSON.parse(savedStates) : {
      device1: false,
      device2: false,
      device3: false,
      device4: false
    };
  });

  useEffect(() => {
    localStorage.setItem('deviceStates', JSON.stringify(deviceStates));
  }, [deviceStates]);

  const toggleDevice = (device) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const newState = !deviceStates[device];
      
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
          command = newState ? 'mist_on' : 'mist_off';
          break;
        default:
          break;
      }

      if (command) {
        ws.current.send(command);
      }
      
      setDeviceStates(prev => ({
        ...prev,
        [device]: newState
      }));
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
        if (response.includes('mist_on')) setDeviceStates(prev => ({ ...prev, device4: true }));
        if (response.includes('mist_off')) setDeviceStates(prev => ({ ...prev, device4: false }));
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
              {device === 'device4' && '미스팅'}
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

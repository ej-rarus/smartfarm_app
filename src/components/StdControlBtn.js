import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function StdControlBtn({ ws }) {
  const [deviceStates, setDeviceStates] = useState({
    device1: false,
    device2: false,
    device3: false,
    device4: false
  });

  const [controlStats, setControlStats] = useState([]);

  // 타이머 설정을 위한 상태
  const [timerSettings, setTimerSettings] = useState(() => {
    const savedTimers = localStorage.getItem('deviceTimers');
    return savedTimers ? JSON.parse(savedTimers) : {
      device1: { duration: '', isActive: false },
      device2: { duration: '', isActive: false },
      device3: { duration: '', isActive: false },
      device4: { duration: '', isActive: false }
    };
  });

  // 타이머 ID 저장
  const timerRefs = React.useRef({});

  // fetchControlStats를 useCallback으로 감싸기
  const fetchControlStats = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/control-stat`);
      if (response.data.status === 200) {
        setControlStats(response.data.data);
        
        const newDeviceStates = { ...deviceStates };
        response.data.data.forEach(stat => {
          const deviceKey = getDeviceKey(stat.device);
          if (deviceKey) {
            newDeviceStates[deviceKey] = stat.status === 'ON';
          }
        });
        setDeviceStates(newDeviceStates);
      }
    } catch (error) {
      console.error('제어 상태 조회 실패:', error);
    }
  }, [deviceStates]); // deviceStates를 의존성으로 추가

  // useEffect에 fetchControlStats 추가
  useEffect(() => {
    fetchControlStats();
  }, [fetchControlStats]);

  // 디바이스 이름을 키로 변환
  const getDeviceKey = (deviceName) => {
    const deviceMap = {
      'FAN': 'device1',
      'LED': 'device2',
      'PUMP': 'device3',
      'MIST': 'device4'
    };
    return deviceMap[deviceName];
  };

  // 디바이스 키를 이름으로 변환
  const getDeviceName = (deviceKey) => {
    const deviceMap = {
      'device1': 'FAN',
      'device2': 'LED',
      'device3': 'PUMP',
      'device4': 'MIST'
    };
    return deviceMap[deviceKey];
  };

  // DB 상태 업데이트
  const updateControlStat = async (device, status) => {
    try {
      const deviceName = getDeviceName(device);
      const stat = controlStats.find(s => s.device === deviceName);
      
      if (stat) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/control-stat/${stat.id}`, {
          device: deviceName,
          status: status
        });
        await fetchControlStats(); // 상태 새로고침
      }
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
    }
  };

  const toggleDevice = (device) => {
    if (!ws.current) {
      console.error('WebSocket connection not initialized');
      return;
    }

    if (ws.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open. Current state:', ws.current.readyState);
      return;
    }

    const newState = !deviceStates[device];
    
    let command = '';
    switch(device) {
      case 'device1': command = newState ? 'FAN_ON' : 'FAN_OFF'; break;
      case 'device2': command = newState ? 'LED_ON' : 'LED_OFF'; break;
      case 'device3': command = newState ? 'PUMP_ON' : 'PUMP_OFF'; break;
      case 'device4': command = newState ? 'MIST_ON' : 'MIST_OFF'; break;
      default: break;
    }

    if (command) {
      try {
        console.log('Sending command:', command);
        ws.current.send(command);
        // DB 상태 업데이트
        updateControlStat(device, newState ? 'ON' : 'OFF');
      } catch (error) {
        console.error('Error sending command:', error);
      }
    }
    
    setDeviceStates(prev => ({
      ...prev,
      [device]: newState
    }));
  };

  // 타이머 시작
  const startTimer = (device) => {
    const duration = parseInt(timerSettings[device].duration);
    if (!duration) return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      let command = '';
      switch(device) {
        case 'device1': command = `FAN_TIMER_${duration}`; break;
        case 'device2': command = `LED_TIMER_${duration}`; break;
        case 'device3': command = `PUMP_TIMER_${duration}`; break;
        case 'device4': command = `MIST_TIMER_${duration}`; break;
        default: break;
      }

      if (command) {
        try {
          ws.current.send(command);
          updateControlStat(device, 'ON');
        } catch (error) {
          console.error('Error sending timer command:', error);
          return;
        }
      }
    }

    // 타이머 ID 저장 및 상태 업데이트
    const timerId = setTimeout(() => {
        if (deviceStates[device]) {
            toggleDevice(device);
        }
        setTimerSettings(prev => ({
            ...prev,
            [device]: { ...prev[device], isActive: false }
        }));
    }, duration * 60 * 60 * 1000);

    timerRefs.current[device] = timerId;
    
    // 디바이스 상태 업데이트
    setDeviceStates(prev => ({
        ...prev,
        [device]: true
    }));
  };

  // 타이머 중지
  const stopTimer = (device) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      let command = '';
      switch(device) {
        case 'device1': command = 'FAN_OFF'; break;
        case 'device2': command = 'LED_OFF'; break;
        case 'device3': command = 'PUMP_OFF'; break;
        case 'device4': command = 'MIST_OFF'; break;
        default: break;
      }

      if (command) {
        try {
          ws.current.send(command);
          updateControlStat(device, 'OFF');
        } catch (error) {
          console.error('Error sending stop command:', error);
        }
      }
    }

    // 타이머 클리어 및 상태 업데이트
    if (timerRefs.current[device]) {
        clearTimeout(timerRefs.current[device]);
        timerRefs.current[device] = null;
    }

    // 디바이스 상태 업데이트
    setDeviceStates(prev => ({
        ...prev,
        [device]: false
    }));
  };

  // 타이머 설정 변경 핸들러
  const handleTimerChange = (device, field, value) => {
    setTimerSettings(prev => ({
      ...prev,
      [device]: {
        ...prev[device],
        [field]: value
      }
    }));
  };

  // 타이머 토글
  const toggleTimer = (device) => {
    const currentSettings = timerSettings[device];
    const newIsActive = !currentSettings.isActive;

    if (newIsActive) {
        startTimer(device);
        
    } else {
        stopTimer(device);
    }

    setTimerSettings(prev => ({
        ...prev,
        [device]: {
            ...prev[device],
            isActive: newIsActive
        }
    }));
  };

  // 웹소켓 메시지 수신 처리
  useEffect(() => {
    if (ws.current) {
      const wsInstance = ws.current;  // ref 값을 지역 변수에 저장
      const handleMessage = (event) => {
        const response = event.data;
        // 서버 응답에 따라 상태 업데이트
        if (response.includes('FAN_ON')) setDeviceStates(prev => ({ ...prev, device1: true }));
        if (response.includes('FAN_OFF')) setDeviceStates(prev => ({ ...prev, device1: false }));
        if (response.includes('LED_ON')) setDeviceStates(prev => ({ ...prev, device2: true }));
        if (response.includes('LED_OFF')) setDeviceStates(prev => ({ ...prev, device2: false }));
        if (response.includes('PUMP_ON')) setDeviceStates(prev => ({ ...prev, device3: true }));
        if (response.includes('PUMP_OFF')) setDeviceStates(prev => ({ ...prev, device3: false }));
        if (response.includes('MIST_ON')) setDeviceStates(prev => ({ ...prev, device4: true }));
        if (response.includes('MIST_OFF')) setDeviceStates(prev => ({ ...prev, device4: false }));
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
            <div className="device-controls">
              <button
                className={`toggle-btn ${isOn ? 'on' : 'off'}`}
                onClick={() => toggleDevice(device)}
              >
                {isOn ? 'ON' : 'OFF'}
              </button>
              
              {device !== 'device3' && (
                <div className="timer-settings">
                  <input
                    type="number"
                    value={timerSettings[device].duration}
                    onChange={(e) => handleTimerChange(device, 'duration', e.target.value)}
                    placeholder="시간 입력"
                    min="1"
                    max={device === 'device4' ? '3600' : '24'}
                  />
                  <span>{device === 'device4' ? '초' : '시간'} 동안 켜기</span>
                  <button
                    className={`timer-btn ${timerSettings[device].isActive ? 'active' : ''}`}
                    onClick={() => toggleTimer(device)}
                    disabled={!timerSettings[device].duration}
                  >
                    {timerSettings[device].isActive ? '타이머 중지' : '타이머 시작'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StdControlBtn;

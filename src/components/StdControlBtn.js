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

  // 스케줄러 설정을 위한 상태
  const [schedules, setSchedules] = useState(() => {
    const savedSchedules = localStorage.getItem('deviceSchedules');
    return savedSchedules ? JSON.parse(savedSchedules) : {
      device1: { startTime: '', endTime: '', isActive: false },
      device2: { startTime: '', endTime: '', isActive: false },
      device3: { startTime: '', endTime: '', isActive: false },
      device4: { startTime: '', endTime: '', isActive: false }
    };
  });

  // 스케줄 저장
  useEffect(() => {
    localStorage.setItem('deviceSchedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('deviceStates', JSON.stringify(deviceStates));
  }, [deviceStates]);

  const toggleDevice = (device) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const newState = !deviceStates[device];
      
      let command = '';
      switch(device) {
        case 'device1':
          command = newState ? 'FAN_ON' : 'FAN_OFF';
          break;
        case 'device2':
          command = newState ? 'LED_ON' : 'LED_OFF';
          break;
        case 'device3':
          command = newState ? 'PUMP_ON' : 'PUMP_OFF';
          break;
        case 'device4':
          command = newState ? 'MIST_ON' : 'MIST_OFF';
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

  // 스케줄러 체크 및 실행
  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      Object.entries(schedules).forEach(([device, schedule]) => {
        if (schedule.isActive && schedule.startTime && schedule.endTime) {
          const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
          const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
          const startTimeMinutes = startHour * 60 + startMinute;
          const endTimeMinutes = endHour * 60 + endMinute;

          // 현재 시간이 시작 시간과 종료 시간 사이에 있는지 확인
          const shouldBeOn = currentTime >= startTimeMinutes && currentTime <= endTimeMinutes;

          // 현재 상태와 다르면 상태 변경
          if (shouldBeOn !== deviceStates[device]) {
            toggleDevice(device);
          }
        }
      });
    };

    // 1분마다 스케줄 체크
    const interval = setInterval(checkSchedules, 60000);
    checkSchedules(); // 초기 체크

    return () => clearInterval(interval);
  }, [schedules, deviceStates]);

  // 스케줄 설정 변경 핸들러
  const handleScheduleChange = (device, field, value) => {
    setSchedules(prev => ({
      ...prev,
      [device]: {
        ...prev[device],
        [field]: value
      }
    }));
  };

  return (
    <div className="control-btn-container">
      <div className="control-sets">
        <button 
          className="check-status-btn"
          onClick={() => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
              ws.current.send('CHECK_STATUS');
            }
          }}
        >
          디바이스 상태 확인
        </button>

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
              
              {/* 스케줄러 설정 UI */}
              <div className="scheduler-settings">
                <input
                  type="time"
                  value={schedules[device].startTime}
                  onChange={(e) => handleScheduleChange(device, 'startTime', e.target.value)}
                  placeholder="시작 시간"
                />
                <span>부터</span>
                <input
                  type="time"
                  value={schedules[device].endTime}
                  onChange={(e) => handleScheduleChange(device, 'endTime', e.target.value)}
                  placeholder="종료 시간"
                />
                <span>까지</span>
                <button
                  className={`scheduler-btn ${schedules[device].isActive ? 'active' : ''}`}
                  onClick={() => handleScheduleChange(device, 'isActive', !schedules[device].isActive)}
                >
                  {schedules[device].isActive ? '스케줄 사용 중' : '스케줄 사용'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StdControlBtn;

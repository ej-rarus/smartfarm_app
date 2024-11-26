import React, { useEffect, useState, useRef } from 'react';

function ArduinoSensorData() {
  const [sensorData, setSensorData] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://your_server_url');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSensorData(data);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div>
      {sensorData && (
        <div>
          <p>온도: {sensorData.temperature}°C</p>
          <p>습도: {sensorData.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default ArduinoSensorData;

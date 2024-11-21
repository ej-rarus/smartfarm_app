import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TodaysWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // 서울의 위도/경도
        const lat = 37.5665;
        const lon = 126.9780;
        
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric&lang=kr`
        );
        
        setWeather(response.data);
      } catch (err) {
        setError('날씨 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <div className="weather-container">날씨 정보를 불러오는 중...</div>;
  if (error) return <div className="weather-container">{error}</div>;
  if (!weather) return null;

  return (
    <div className="component-container">
      <h2>오늘의 날씨</h2>
      <div className="weather-info">
        <div className="weather-main">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <div className="temperature">
            {Math.round(weather.main.temp)}°C
          </div>
        </div>
        <div className="weather-details">
          <p>체감온도: {Math.round(weather.main.feels_like)}°C</p>
          <p>습도: {weather.main.humidity}%</p>
          <p>풍속: {weather.wind.speed}m/s</p>
          <p>날씨: {weather.weather[0].description}</p>
        </div>
      </div>
    </div>
  );
}

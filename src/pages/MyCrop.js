import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 진행도 계산 함수
const calculateProgress = (plantedDate, harvestDate) => {
  console.log('planted_at:', plantedDate);
  console.log('harvest_at:', harvestDate);
  
  const now = new Date();
  const planted = new Date(plantedDate);
  const harvest = new Date(harvestDate);
  
  console.log('planted Date 객체:', planted);
  console.log('harvest Date 객체:', harvest);
  
  const totalDays = (harvest - planted) / (1000 * 60 * 60 * 24);
  const daysElapsed = (now - planted) / (1000 * 60 * 60 * 24);
  
  console.log('총 일수:', totalDays);
  console.log('경과 일수:', daysElapsed);
  
  const progress = (daysElapsed / totalDays) * 100;
  return Math.min(Math.max(progress, 0), 100); // 0-100 사이 값으로 제한
};

// 남은 일수 계산 함수
const calculateRemainingDays = (harvestDate) => {
  console.log('harvest_at (남은 일수 계산):', harvestDate);
  
  const now = new Date();
  const harvest = new Date(harvestDate);
  
  console.log('harvest Date 객체 (남은 일수 계산):', harvest);
  
  const remaining = Math.ceil((harvest - now) / (1000 * 60 * 60 * 24));
  return Math.max(remaining, 0); // 음수 방지
};

// 진행도에 따른 색상 변경 함수
const getProgressColor = (progress) => {
  if (progress < 30) return '#ff9800'; // 초기 단계 (주황색)
  if (progress < 60) return '#4caf50'; // 중간 단계 (초록색)
  if (progress < 90) return '#2196f3'; // 성숙 단계 (파란색)
  return '#9c27b0'; // 수확 단계 (보라색)
};

export default function MyCrop() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userData] = useState({
    username: "농부킴",
    profileImage: null
  });

  useEffect(() => {
    const fetchMyCrops = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/mycrop`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log('서버 응답 데이터:', response.data); // 데이터 확인
        setCrops(response.data);
      } catch (err) {
        setError('작물 정보를 불러오는데 실패했습니다.');
        console.error('작물 조회 에러:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCrops();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="my-crop-container">
      <h2>내 작물 관리</h2>
      <button 
        className="my-crop-add-button"
        onClick={() => navigate('/mycrop/new')}
      >
        새 작물 추가
      </button>
      <div className="my-crop-list">
        {crops.map((crop) => (
          <div 
            key={crop.id} 
            className="my-crop-card"
            onClick={() => navigate(`/mycrop/${crop.id}`)}
          >
            <div className="my-crop-profile-image">
              {crop.image_url ? (
                <img src={crop.image_url} alt={crop.nickname} />
              ) : (
                <i className="fas fa-seedling"></i>
              )}
            </div>
            <h3>{crop.nickname}</h3>
            <p>{crop.species}</p>
            <p>심은 날짜: {new Date(crop.planted_at).toLocaleDateString()}</p>
            <p>{Math.floor((new Date() - new Date(crop.planted_at)) / (1000 * 60 * 60 * 24))}일째</p>
            
            <div className="harvest-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${calculateProgress(crop.planted_at, crop.harvest_at)}%`,
                    backgroundColor: getProgressColor(calculateProgress(crop.planted_at, crop.harvest_at))
                  }}
                />
              </div>
              <p className="progress-text">
                수확까지 {calculateRemainingDays(crop.harvest_at)}일
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
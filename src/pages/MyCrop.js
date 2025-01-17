import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 진행도 계산 함수
const calculateProgress = (planted_at, harvest_at) => {
  const plantedDate = new Date(planted_at);
  const harvestDate = new Date(harvest_at);
  const currentDate = new Date();

  const totalDays = (harvestDate - plantedDate) / (1000 * 60 * 60 * 24);
  const elapsedDays = (currentDate - plantedDate) / (1000 * 60 * 60 * 24);

  return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
};

// 남은 일수 계산 함수
const calculateRemainingDays = (harvestDate) => {
  
  const now = new Date();
  const harvest = new Date(harvestDate);
  
  
  const remaining = Math.ceil((harvest - now) / (1000 * 60 * 60 * 24));
  return Math.max(remaining, 0); // 음수 방지
};

// 진행도에 따른 색상 변경 함수
const getProgressColor = (progress) => {
  if (progress < 30) return '#ff0000'; // 초기 단계 (빨강색)
  if (progress < 60) return '#ffa500'; // 중간 단계 (노랑색)
  if (progress < 90) return '#00ff00'; // 성숙 단계 (초록색)
  return '#4caf50'; // 수확 단계 (초록)
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
      <div className="my-crop-header">
        <h2>내 작물 관리</h2>
        <button 
          className="my-crop-add-button"
          onClick={() => navigate('/mycrop/new')}
        >
          새 작물 추가
        </button>
      </div>
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
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSeedling } from "@fortawesome/free-solid-svg-icons";

function CropDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 데모 데이터
  const [crop] = useState({
    id: 1,
    nickname: "귀여운 토마토",
    variety: "방울토마토",
    plantingDate: "2024-01-15",
    expectedHarvestDate: "2024-04-15",
    username: "농부킴"
  });

  const [posts] = useState([
    {
      id: 1,
      imageUrl: "https://example.com/image1.jpg",
      date: "2024-02-01"
    },
    // 더 많은 포스트 추가
  ]);

  const calculateGrowthPercentage = (plantingDate, expectedHarvestDate) => {
    const start = new Date(plantingDate).getTime();
    const end = new Date(expectedHarvestDate).getTime();
    const current = new Date().getTime();
    const growth = ((current - start) / (end - start)) * 100;
    return Math.min(Math.max(growth, 0), 100);
  };

  const calculateDaysFromPlanting = (plantingDate) => {
    const start = new Date(plantingDate).getTime();
    const current = new Date().getTime();
    return Math.floor((current - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="crop-detail-container">
      <div className="crop-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2>{crop.username}님의 농장</h2>
      </div>

      <div className="crop-detail-card">
        <div className="crop-detail-title">
          <FontAwesomeIcon icon={faSeedling} className="crop-icon" />
          <h3>{crop.nickname}</h3>
        </div>
        <p className="crop-detail-variety">{crop.variety}</p>
        <p className="crop-detail-date">
          파종일로부터 {calculateDaysFromPlanting(crop.plantingDate)}일
        </p>
        <div className="crop-detail-growth-container">
          <div 
            className="crop-detail-growth-bar"
            style={{ 
              width: `${calculateGrowthPercentage(crop.plantingDate, crop.expectedHarvestDate)}%`
            }}
          />
          <span className="crop-detail-growth-percentage">
            {Math.round(calculateGrowthPercentage(crop.plantingDate, crop.expectedHarvestDate))}%
          </span>
        </div>
      </div>

      <div className="crop-posts-grid">
        {posts.map(post => (
          <div 
            key={post.id} 
            className="crop-post-item"
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <img src={post.imageUrl} alt={`포스트 ${post.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CropDetail; 
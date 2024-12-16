import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faPlus, faEdit, faTrash, faSeedling, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LowerNav from "../components/LowerNav";

function MyCrop() {
  const navigate = useNavigate();
  const [userData] = useState({
    username: "농부킴",
    profileImage: null
  });

  // 데모 작물 데이터
  const [crops, setCrops] = useState([
    {
      id: 1,
      nickname: "귀여운 토마토",
      variety: "방울토마토",
      plantingDate: "2024-01-15",
      expectedHarvestDate: "2024-04-15",
    },
    {
      id: 2,
      nickname: "상추는 상추상추",
      variety: "청상추",
      plantingDate: "2024-02-01",
      expectedHarvestDate: "2024-03-15",
    },
    {
      id: 3,
      nickname: "매운맛 고추",
      variety: "청양고추",
      plantingDate: "2024-01-20",
      expectedHarvestDate: "2024-05-20",
    }
  ]);

  const [posts] = useState([
    {
      id: 1,
      cropId: 1, // 토마토
      imageUrl: "https://picsum.photos/400/400?random=1",
      content: "방울토마토가 쑥쑥 자라나고 있어요!",
      createdAt: "2024-02-15"
    },
    {
      id: 2,
      cropId: 1,
      imageUrl: "https://picsum.photos/400/400?random=2",
      content: "첫 수확한 토마토입니다.",
      createdAt: "2024-02-16"
    },
    {
      id: 3,
      cropId: 1,
      imageUrl: "https://picsum.photos/400/400?random=3",
      content: "토마토 잎이 튼튼해졌어요",
      createdAt: "2024-02-17"
    },
    {
      id: 4,
      cropId: 2, // 상추
      imageUrl: "https://picsum.photos/400/400?random=4",
      content: "상추가 자라나는 중",
      createdAt: "2024-02-15"
    },
    {
      id: 5,
      cropId: 2,
      imageUrl: "https://picsum.photos/400/400?random=5",
      content: "상추 모종 심기 완료!",
      createdAt: "2024-02-16"
    },
    {
      id: 6,
      cropId: 3, // 고추
      imageUrl: "https://picsum.photos/400/400?random=6",
      content: "청양고추 첫 수확!",
      createdAt: "2024-02-15"
    },
    {
      id: 7,
      cropId: 3,
      imageUrl: "https://picsum.photos/400/400?random=7",
      content: "고추가 빨갛게 익어가네요",
      createdAt: "2024-02-16"
    },
    {
      id: 8,
      cropId: 3,
      imageUrl: "https://picsum.photos/400/400?random=8",
      content: "고추 모종 심었어요",
      createdAt: "2024-02-17"
    },
    {
      id: 9,
      cropId: 3,
      imageUrl: "https://picsum.photos/400/400?random=9",
      content: "고추 키우기 시작!",
      createdAt: "2024-02-18"
    }
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

  const handleAddCrop = () => {
    navigate("/mycrop/new");
  };

  const handleEditCrop = (id) => {
    alert(`작물 ID ${id} 수정 기능은 아직 준비중입니다!`);
  };

  const handleDeleteCrop = (id) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setCrops(crops.filter(crop => crop.id !== id));
    }
  };

  const handleCropClick = (id) => {
    navigate(`/mycrop/${id}`);
  };

  return (
    <div className="my-crop-container">
      <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      <div className="my-crop-header">
        <div className="my-crop-profile">
          <div className="my-crop-profile-image">
            {userData?.profileImage ? (
              <img src={userData.profileImage} alt="프로필" />
            ) : (
              <FontAwesomeIcon icon={faLeaf} size="2x" />
            )}
          </div>
          <h2>{userData?.username}님의 농장</h2>
        </div>
        <button className="my-crop-add-button" onClick={handleAddCrop}>
          <FontAwesomeIcon icon={faPlus} /> 작물 추가
        </button>
      </div>

      <div className="my-crop-list">
        {crops.map(crop => (
          <div 
            key={crop.id} 
            className="my-crop-card"
            onClick={() => handleCropClick(crop.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="my-crop-info">
              <div className="my-crop-title">
                <FontAwesomeIcon icon={faSeedling} className="crop-icon" />
                <h3>{crop.nickname}</h3>
              </div>
              <p className="my-crop-variety">{crop.variety}</p>
              <p className="my-crop-date">
                파종일로부터 {calculateDaysFromPlanting(crop.plantingDate)}일
              </p>
              <p className="my-crop-description">{crop.description}</p>
            </div>
            
            <div className="my-crop-growth-container">
              <div 
                className="my-crop-growth-bar"
                style={{ 
                  width: `${calculateGrowthPercentage(crop.plantingDate, crop.expectedHarvestDate)}%`
                }}
              />
              <span className="my-crop-growth-percentage">
                {Math.round(calculateGrowthPercentage(crop.plantingDate, crop.expectedHarvestDate))}%
              </span>
            </div>

            <div className="my-crop-actions">
              <button 
                className="my-crop-edit-btn"
                onClick={() => handleEditCrop(crop.id)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button 
                className="my-crop-delete-btn"
                onClick={() => handleDeleteCrop(crop.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCrop; 
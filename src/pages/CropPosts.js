import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function CropPosts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts] = useState([
    {
      id: 1,
      cropId: 1, // 토마토
      username: "농부킴",
      cropNickname: "사과",
      userProfileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
      imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600",
      content: "오늘 토마토 수확했어요! 🍅 첫 수확인데 잘 자라서 기분이 너무 좋네요. 다들 맛있게 드세요~",
      likes: 42,
      comments: 13,
      createdAt: "2024-03-15T12:00:00"
    },
    {
      id: 2,
      cropId: 1,
      username: "파머존",
      cropNickname: "당근",
      userProfileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
      imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600",
      content: "상추가 무럭무럭 자라고 있어요 🥬 곧 수확할 수 있을 것 같아요!",
      likes: 28,
      comments: 7,
      createdAt: "2024-03-14T15:30:00"
    },
    {
      id: 3,
      cropId: 1,
      username: "식물집사",
      cropNickname: "방울토마토",
      userProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600",
      content: "방울토마토 모종 심었어요 🌱 잘 자라길 바라며!",
      likes: 35,
      comments: 9,
      createdAt: "2024-03-14T09:15:00"
    },
    {
      id: 4,
      cropId: 2,
      username: "텃밭지기",
      cropNickname: "방울토마토",
      userProfileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400",
      imageUrl: "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600",
      content: "오늘 아침 물주기 완료! 💦 날씨가 좋아서 식물들이 더 생기있어 보여요",
      likes: 31,
      comments: 8,
      createdAt: "2024-03-13T08:20:00"
    },
    {
      id: 5,
      cropId: 2,
      username: "도시농부",
      cropNickname: "상추",
      userProfileImage: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400",
      imageUrl: "https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=600",
      content: "베란다 텃밭 근황입니다 🌿 상추가 정말 잘 자라고 있어요!",
      likes: 45,
      comments: 15,
      createdAt: "2024-03-12T16:45:00"
    },
    {
      id: 6,
      cropId: 3,
      username: "초록마을",
      cropNickname: "토마토",
      userProfileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400",
      imageUrl: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600",
      content: "토마토 지지대 설치했어요 📝 이제 튼튼하게 자랄 수 있겠죠?",
      likes: 37,
      comments: 11,
      createdAt: "2024-03-11T14:10:00"
    }
  ]);

  const cropPosts = posts.filter(post => post.cropId === parseInt(id));
  const handleCropClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleAddPost = () => {
    navigate(`/post/new?cropId=${id}`);
  };

  return (
    <div className="crop-posts-container">
      
      <div className="crop-posts-header">
      <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button 
          className="add-post-button back-button"
          onClick={handleAddPost}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="crop-posts-grid">
        {cropPosts.map(posts => (
          <div key={posts.id} className="crop-post-item" onClick={() => handleCropClick(posts.id)}>
            <img src={posts.imageUrl} alt={posts.content} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CropPosts;

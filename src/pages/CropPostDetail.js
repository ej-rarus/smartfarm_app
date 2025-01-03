import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import defaultPostImg from '../assets/default-post.png';
import defaultProfileImg from '../assets/default-profile.png';

function CropPostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return defaultPostImg;
    if (path.startsWith('http')) return path;
    return `${process.env.REACT_APP_API_URL}${path}`;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      년: 31536000,
      개월: 2592000,
      일: 86400,
      시간: 3600,
      분: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval}${unit} 전`;
      }
    }
    
    return '방금 전';
  };

  useEffect(() => {
    const fetchPostAndUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // 게시글 정보 조회
        const postResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/post/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (postResponse.data.status === 200) {
          const postData = postResponse.data.data;
          setPost(postData);

          // 게시글 작성자의 사용자 정보 조회
          const userResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/user/${postData.user_id}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (userResponse.data.status === 200) {
            setUserData(userResponse.data.data);
          }
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setError(error.response?.data?.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndUserData();
  }, [id, navigate]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="not-found">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="feed-container">
      <div className="feed-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <div className="post-container">
        <div className="post-header">
          <div className="post-user-info">
            <img 
              src={userData?.profile_image ? getImageUrl(userData.profile_image) : defaultProfileImg} 
              alt="프로필" 
              className="profile-image"
            />
            <div className="user-details">
              <span className="username">{userData?.username}</span>
              <span className="username-suffix">님의</span>
              <span className="crop-species">{post?.species}</span>
              <span className="crop-nickname">{post?.nickname}</span>
            </div>
          </div>
        </div>

        <div className="post-image-container">
          <img 
            src={getImageUrl(post.post_img)} 
            alt="게시글 이미지"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultPostImg;
            }}
          />
        </div>

        <div className="post-actions">
          <button className="action-button">
            <FontAwesomeIcon icon={faHeart} />
            <span className="action-count">{post.likes || 0}</span>
          </button>
          <button className="action-button">
            <FontAwesomeIcon icon={faComment} />
            <span className="action-count">{post.comments || 0}</span>
          </button>
        </div>

        <div className="post-content">
        <p className="date">
            {formatTimeAgo(post.created_at)}
          </p>
          <span className="content-text">{post.post_text}</span>
          
        </div>
      </div>
    </div>
  );
}

export default CropPostDetail;


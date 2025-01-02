import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import defaultPostImg from '../assets/default-post.png';
import defaultProfileImg from '../assets/default-profile.png';
import '../App.css';

function CropPostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return defaultPostImg;
    if (path.startsWith('http')) return path;
    return `${process.env.REACT_APP_API_URL}${path}`;
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/post/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data) {
          setPost(response.data);
          console.log('받은 데이터:', response.data);
        } else {
          throw new Error('데이터가 없습니다.');
        }
      } catch (error) {
        console.error('게시글 상세 정보 로딩 실패:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
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
              src={post.profile_img ? getImageUrl(post.profile_img) : defaultProfileImg} 
              alt="프로필" 
              className="profile-image"
            />
            <div className="user-details">
              <span className="username">{post.username}</span>
              <span className="username-suffix">님의</span>
              <span className="crop-species">{post.species}</span>
              <span className="crop-nickname">{post.nickname}</span>
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

        <div className="post-content">
          <span className="content-text">{post.post_text}</span>
          <p className="date">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CropPostDetail;


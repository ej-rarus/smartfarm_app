import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

function CropPostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 이미지 URL 생성 헬퍼 함수
  const getImageUrl = (path) => {
    if (!path) return "/default-image.png";
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
          `${process.env.REACT_APP_API_URL}/api/crop-post/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        if (response.data.status === 200) {
          setPost(response.data.data);
        }
      } catch (error) {
        console.error('게시글 상세 정보 로딩 실패:', error);
        if (error.response) {
          setError(error.response.data.message || '게시글을 불러오는데 실패했습니다.');
        } else {
          setError('서버와의 연결에 실패했습니다.');
        }
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
      <div className="post-container">
      <div className="post-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="user-info">
          
          <div className="user-text">
            <div className="username">{post.username}</div>
            <div className="crop-nickname">{post.crop_nickname}</div>
          </div>
        </div>
      </div>

      <div className="post-image-container">
        {post.post_img && (
          <img 
            src={getImageUrl(post.post_img)} 
            alt="게시글 이미지" 
            className="post-image"
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-post-image.png";
            }}
          />
        )}
      </div>

      <div className="post-content">
        <div className="interaction-buttons">
          <button className="like-button">
            <FontAwesomeIcon icon={faHeart} />
            <span>{post.likes || 0}</span>
          </button>
          <button className="comment-button">
            <FontAwesomeIcon icon={faComment} />
            <span>{post.comments || 0}</span>
          </button>
        </div>

        <div className="post-text">{post.post_text}</div>
        <div className="post-date">
          {dayjs(post.created_at).format('YYYY년 MM월 DD일 HH:mm')}
        </div>
      </div>
      </div>
    </div>
  );
}

export default CropPostDetail;

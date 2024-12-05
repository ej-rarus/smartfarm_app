import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../utils/auth";

function DiaryPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const user = getCurrentUser();
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/diary/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );

        console.log('전체 서버 응답:', response);
        console.log('이미지 경로:', response.data.data.image);

        if (response.data.status === 200 && response.data.data) {
          setPost(response.data.data);
        } else {
          setError(response.data.message || '게시글을 불러올 수 없습니다.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || '게시글을 불러올 수 없습니다.');
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        const user = getCurrentUser();
        await axios.delete(
          `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/diary/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );
        navigate('/diary');
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const getCategoryName = (categoryCode) => {
    const categories = {
      '0001': '공지사항',
      '0002': '농업',
      '0003': '기술',
      '0004': '일상',
      '0005': '기타'
    };
    return categories[categoryCode] || '기타';
  };

  return (
    <div className="instagram-post-container">
      
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : !post ? (
        <div className="not-found">게시글을 찾을 수 없습니다.</div>
      ) : (
        <div className="instagram-post-content">
          <div className="post-author-info">
            <div className="author-avatar">
              <i className="fas fa-user-circle"></i>
            </div>
            <div className="author-details">
              <span className="author-name">{post.author}</span>
              <span className="post-category">{getCategoryName(post.post_category)}</span>
            </div>
          </div>

          {post.image && post.image !== 'null' && (
            <div className="post-image">
              <img 
                src={`${process.env.REACT_APP_API_URL}${post.image}`}
                alt={post.post_title} 
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('이미지 로딩 오류:', e);
                  console.log('실패한 이미지 URL:', e.target.src);
                  e.target.parentElement.style.display = 'none'; // div.post-image 전체를 숨김
                }}
              />
            </div>
          )}

          <div className="post-details">
            <h2 className="post-title">{post.post_title}</h2>
            <p className="post-content">{post.post_content}</p>
            
            <div className="post-meta">
              <span className="post-date">
                {new Date(post.create_date).toLocaleDateString("ko-KR", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiaryPost;

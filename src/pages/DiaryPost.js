import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function DiaryPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/diary/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/diary/${id}`);
        navigate('/diary');
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!post) return <div className="not-found">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="diary-post-container">
      <div className="diary-post-header">
        <h1>{post.post_title}</h1>
        <div className="post-info">
          <span className="author">
            <i className="fas fa-user"></i> {post.author}
          </span>
          <span className="date">
            <i className="fas fa-calendar"></i> 
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

      <div className="diary-post-content">
        {post.post_content}
      </div>

      <div className="diary-post-buttons">
        <button 
          className="back-btn"
          onClick={() => navigate('/diary')}
        >
          목록으로
        </button>
        <div className="action-buttons">
          <button 
            className="edit-btn"
            onClick={() => navigate(`/diary/edit/${id}`)}
          >
            수정
          </button>
          <button 
            className="delete-btn"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiaryPost;

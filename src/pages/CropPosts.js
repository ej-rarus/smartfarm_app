import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

function CropPosts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('인증 토큰이 없습니다.');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/mycrop/${id}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.status === 200) {
          const activePosts = response.data.data.filter(post => !post.is_deleted);
          setPosts(activePosts);
        }
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        if (error.response) {
          // 서버가 응답을 반환한 경우
          console.error('서버 응답:', error.response.data);
          console.error('상태 코드:', error.response.status);
        } else if (error.request) {
          // 요청이 전송되었지만 응답을 받지 못한 경우
          console.error('응답 없음:', error.request);
        } else {
          // 요청 설정 중에 오류가 발생한 경우
          console.error('에러 메시지:', error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id, navigate]);

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
        {posts.map(post => (
          <div 
            key={post.id} 
            className="crop-post-item" 
            onClick={() => handleCropClick(post.id)}
          >
            {post.post_img ? (
              <img 
                src={`${process.env.REACT_APP_API_URL}${post.post_img}`} 
                alt={post.post_text} 
              />
            ) : (
              <div className="no-image">이미지 없음</div>
            )}
          </div>
        ))}
      </div>
      {posts.length === 0 && (
        <div className="no-posts">
          아직 게시글이 없습니다.
        </div>
      )}
    </div>
  );
}

export default CropPosts;

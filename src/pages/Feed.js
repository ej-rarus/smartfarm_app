import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import defaultPostImg from '../assets/default-post.png';
import defaultProfileImg from '../assets/default-profile.png';

function Feed() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const POSTS_PER_PAGE = 5;

  const getImageUrl = (path) => {
    if (!path) return defaultPostImg;
    if (path.startsWith('http')) return path;
    return `${process.env.REACT_APP_API_URL}${path}`;
  };

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.status === 200) {
        const newPosts = response.data.data;
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setHasMore(newPosts.length === POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
      setError(error.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleAddPost = () => {
    navigate(`/post/new?cropId=${id}`);
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="feed-container">
      <div className="feed-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button className="add-post-button back-button" onClick={handleAddPost}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {posts.map((post, index) => (
        <div 
          key={post.id} 
          ref={index === posts.length - 1 ? lastPostElementRef : null}
          className="post-container"
        >
          <div className="post-header">
            <div className="post-user-info">
              <img 
                src={post.profile_image ? getImageUrl(post.profile_image) : defaultProfileImg} 
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
      ))}

      {loading && <div className="loading">로딩 중...</div>}
    </div>
  );
}

export default Feed; 
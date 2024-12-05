import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function Diary() {
  const [data, setData] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const navigate = useNavigate();
  const POSTS_PER_PAGE = 5;

  // 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const user = getCurrentUser();
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/diary`,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }
        );
        
        // 서버 응답 구조에 맞게 데이터 처리
        const posts = response.data.data || [];
        const sortedPosts = posts.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));
        
        setAllPosts(sortedPosts);
        const initialPosts = sortedPosts.slice(0, POSTS_PER_PAGE);
        setData(initialPosts);
        setHasMore(sortedPosts.length > POSTS_PER_PAGE);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchInitialData();
  }, [navigate]);

  // 페이지 변경시 데이터 추가
  useEffect(() => {
    if (page === 1) return;
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = page * POSTS_PER_PAGE;
    const newPosts = allPosts.slice(startIndex, endIndex);
    setData(prev => [...prev, ...newPosts]);
    setHasMore(endIndex < allPosts.length);
  }, [page, allPosts]);

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

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="diary-container">
      <div className="diary-header">
        <h1>영농일지</h1>
        <p>나의 농사 기록을 남겨보세요</p>
      </div>

      <div className="diary-content">
        <button
          className="write-button"
          onClick={() => navigate("/diary/new")}
        >
          <i className="fas fa-pen"></i> 새 글 작성
        </button>

        <div className="diary-list">
          {[...data]
            .sort((a, b) => new Date(b.create_date) - new Date(a.create_date))
            .map((item, index) => {
              const formattedDate = new Date(item.create_date).toLocaleDateString("ko-KR", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              
              return (
                <div 
                  ref={index === data.length - 1 ? lastPostElementRef : null}
                  className="diary-card" 
                  key={item.post_id} 
                  onClick={() => navigate(`/diary/${item.post_id}`)}
                >
                  <div className="diary-card-header">
                    <span className="diary-number">#{item.post_id}</span>
                    <span className="diary-date">{formattedDate}</span>
                  </div>
                  <h3 className="diary-title">{item.post_title}</h3>
                  <div className="diary-footer">
                    <span className="diary-author">
                      <i className="fas fa-user"></i> {item.author}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
        
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Diary;

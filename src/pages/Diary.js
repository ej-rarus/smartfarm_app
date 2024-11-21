import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/diary`);
        const sortedPosts = response.data.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));
        setAllPosts(sortedPosts);
        const initialPosts = sortedPosts.slice(0, POSTS_PER_PAGE);
        setData(initialPosts);
        setHasMore(sortedPosts.length > POSTS_PER_PAGE);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

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
    <div className="page-container">
      <h1 className="page-title">Diary</h1>
      <hr style={{
        border: "none",
        height: "2px",
        backgroundColor: "gray",
        width: "13rem",
        marginTop: "0.5rem",
      }}/>
      <p className="page-content">영농일지입니다.</p>

      <div className="post-list-container">
        <button
          className="std-btn"
          onClick={() => navigate("/diary/new")}
        >
          글쓰기
        </button>

        {[...data]
          .sort((a, b) => new Date(b.create_date) - new Date(a.create_date))
          .map((item, index) => {
            const formattedDate = new Date(item.create_date).toLocaleDateString("en-CA");
            
            if (data.length === index + 1) {
              return (
                <div 
                  ref={lastPostElementRef}
                  className="post-card" 
                  key={item.post_id} 
                  onClick={() => navigate(`/diary/${item.post_id}`)}
                >
                  <div className="post-id">{item.post_id}</div>
                  <div className="post-title">{item.post_title}</div>
                  <div className="post-author">{item.author}</div>
                  <div className="post-create-date">{formattedDate}</div>
                </div>
              );
            } else {
              return (
                <div 
                  className="post-card" 
                  key={item.post_id} 
                  onClick={() => navigate(`/diary/${item.post_id}`)}
                >
                  <div className="post-id">{item.post_id}</div>
                  <div className="post-title">{item.post_title}</div>
                  <div className="post-author">{item.author}</div>
                  <div className="post-create-date">{formattedDate}</div>
                </div>
              );
            }
          })}
        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
}

export default Diary;

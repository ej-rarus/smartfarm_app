import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TodaysAgriNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const twoMonthsAgo = new Date(today.setMonth(today.getMonth() - 1));
        const formattedDate = twoMonthsAgo.toISOString().split('T')[0];  // YYYY-MM-DD 형식

        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=스마트팜&from=${formattedDate}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
        );
        
        console.log('뉴스 응답:', response.data);
        
        if (response.data.articles && response.data.articles.length > 0) {
          setNews(response.data.articles);
        } else {
          setError('관련 뉴스가 없습니다.');
        }
      } catch (err) {
        console.error('뉴스 API 에러:', err);
        setError('뉴스를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="component-container">뉴스를 불러오는 중...</div>;
  if (error) return <div className="component-container">{error}</div>;
  if (!news.length) return <div className="component-container">표시할 뉴스가 없습니다.</div>;

  return (
    <div className="component-container">
      <h2>농업 뉴스</h2>
      <div className="news-list">
        {news.map((item, index) => (
          <div key={index} className="news-item">
            {item.urlToImage && (
              <img 
                src={item.urlToImage} 
                alt={item.title} 
                className="news-image"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <h3>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </h3>
            <p className="news-description">{item.description}</p>
            <div className="news-meta">
              <span>{new Date(item.publishedAt).toLocaleDateString('ko-KR')}</span>
              <span>{item.source.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

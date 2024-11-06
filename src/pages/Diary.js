import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Diary() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://3.39.126.121:3000/api/diary");
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">Diary</h1>
      <hr
        style={{
          border: "none",
          height: "2px",
          backgroundColor: "gray",
          width: "13rem",
          marginTop: "0.5rem",
        }}
      />
      <p className="page-content">영농일지입니다.</p>

      <div className="post-list-container">
        <button
          className="std-btn"
          onClick={() => navigate("/diary/new")} // 버튼 클릭 시 글 작성 페이지로 이동
        >
          글쓰기
        </button>

        {[...data]
          .sort((a, b) => new Date(b.create_date) - new Date(a.create_date)) // 날짜 내림차순 정렬
          .map((item) => {
            const formattedDate = new Date(item.create_date).toLocaleDateString(
              "en-CA"
            );
            return (
              <div className="post-card" key={item.post_id} onClick={() => navigate(`/diary/${item.post_id}`)}>
                <div className="post-id">{item.post_id}</div>
                <div className="post-title">{item.post_title}</div>
                <div className="post-author">{item.author}</div>
                <div className="post-create-date">{formattedDate}</div>
              </div>
              
            );
          })}
      </div>
    </div>
  );
}

export default Diary;

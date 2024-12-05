import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../utils/auth";

export default function DiaryEditPost() {
  const { id } = useParams(); // 수정할 게시글 ID를 URL에서 가져옴
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // 기존 게시글 데이터를 불러오는 함수
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
        const post = response.data;
        setTitle(post.post_title);
        setCategory(post.post_category);
        setAuthor(post.author);
        setContent(post.post_content);
      } catch (err) {
        console.error("Failed to fetch post data:", err);
        alert("게시글을 불러오는데 실패했습니다.");
        navigate("/diary");
      }
    };

    fetchPost();
  }, [id, navigate]);

  // 수정된 게시글 데이터를 서버에 전송하는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getCurrentUser();
      
      if (!user?.token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/diary/${id}`,
        {
          post_title: title,
          post_category: category,
          author: author,
          post_content: content,
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      navigate("/diary");
    } catch (err) {
      console.error("Failed to update post:", err);
      if (err.response?.status === 403) {
        alert("권한이 없습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        alert("게시글 수정 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">글 수정</h1>
      <form className="std-form" onSubmit={handleSubmit}>
        <div className="std-form-container">
          <label>제목</label>
          <input
            className="std-input-field"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="std-form-container">
          <label>글쓴이</label>
          <input
            className="std-input-field"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="std-form-container">
          <label>내용</label>
          <textarea
            className="std-input-field long-text-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="std-form-container">
          <label>카테고리</label>
          <select
            className="std-input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">카테고리를 선택하세요</option>
            <option value="0001">공지사항</option>
            <option value="0002">농업</option>
            <option value="0003">기술</option>
            <option value="0004">일상</option>
            <option value="0005">기타</option>
          </select>
        </div>

        <div id="submit-btn-container" className="std-form-container">
          <button className="edit-btn" type="submit">수정</button>
          <button 
            className="delete-btn" 
            type="button"
            onClick={() => navigate("/diary")}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

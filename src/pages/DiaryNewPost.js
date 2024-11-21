import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from '../utils/auth';

function DiaryNewPost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.username) {
      setAuthor(user.username);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/diary`, {
        post_title: title,
        post_category: category,
        author: author,
        content: content,
      });
      navigate("/diary");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">새 글 작성</h1>
      <form className="std-form" onSubmit={handleSubmit}>
        <div className="std-form-container">
          <label>제목</label>
          <input
            className="input-field"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="std-form-container">
          <label>카테고리</label>
          <select
            className="input-field"
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
        <div className="std-form-container">
          <label>글쓴이</label>
          <input
            className="input-field"
            type="text"
            value={author}
            readOnly
          />
        </div>
        <div className="std-form-container">
          <label>내용</label>
          <textarea
            className="input-field long-text-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        
        <div id="submit-btn-container" className="std-form-container">
          <button className="edit-btn" type="submit">작성</button>
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

export default DiaryNewPost;

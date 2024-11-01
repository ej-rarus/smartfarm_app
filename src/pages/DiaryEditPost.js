import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
        const response = await axios.get(`http://3.39.126.121:3000/diary/${id}`);
        const post = response.data;
        setTitle(post.post_title);
        setCategory(post.post_category);
        setAuthor(post.author);
        setContent(post.post_content);
      } catch (err) {
        console.error("Failed to fetch post data:", err);
      }
    };

    fetchPost();
  }, [id]);

  // 수정된 게시글 데이터를 서버에 전송하는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://3.39.126.121:3000/diary/${id}`, {
        post_title: title,
        post_category: category,
        author: author,
        post_content: content,
      });
      navigate("/diary"); // 수정 후 목록 페이지로 이동
      console.log("수정된 제목:", title);
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  return (
    <div className="content-wrap">
      <h1 className="page-title">글 수정</h1>
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
          <label>글쓴이</label>
          <input
            className="input-field"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="std-form-container">
          <label>내용</label>
          <textarea
            className="input-field"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
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
          <button className="std-btn" type="submit">수정</button>
          <button
            className="std-btn"
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

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";



function DiaryPost() {
  const { id } = useParams(); // URL에서 게시글 ID를 가져옴
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate(`/diary/edit/${id}`);
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://3.39.126.121:3000/diary/${id}`);
        setPost(response.data); // 게시글 데이터 설정
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>No post found.</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">{post.post_title}</h1>
      <p>글쓴이: {post.author}</p>
      <p>작성일자: {new Date(post.create_date).toLocaleDateString("en-CA")}</p>
      <div>{post.post_content}</div> {/* 게시글의 내용 */}
      <button onClick={handleEdit}>수정</button>
    </div>
  );
}

export default DiaryPost;

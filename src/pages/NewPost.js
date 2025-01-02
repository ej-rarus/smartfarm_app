// src/pages/NewPost.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default function NewPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const cropId = searchParams.get('cropId');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crops, setCrops] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCrop) {
      alert('작물을 선택해주세요');
      return;
    }
    
    if (!content) {
      alert('게시글 내용을 입력해주세요');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('crop_id', cropId);
      formData.append('post_text', content);
      
      if (image) {
        formData.append('post_img', image);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/mycrop/${selectedCrop}/posts`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.status === 201) {
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate(`/mycrop/${cropId}`); // 또는 원하는 페이지로 이동
      }

    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert(error.response?.data?.message || '게시글 등록 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const fetchUserCrops = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/mycrop`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // 서버에서 받은 작물 데이터를 select에 맞는 형식으로 변환
        const formattedCrops = response.data.map(crop => ({
          value: crop.id,
          label: crop.nickname || crop.species // nickname이 없으면 species를 사용
        }));

        setCrops(formattedCrops);
      } catch (error) {
        console.error('작물 목록 조회 실패:', error);
        // 에러 처리 (예: 알림 표시)
      }
    };

    fetchUserCrops();
  }, []);

  return (
    <div className="new-post-container">
      <header className="new-post-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>새 게시물</h1>
      </header>

      <form className="new-post-form" onSubmit={handleSubmit}>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="crop-select"
        >
          <option value="">작물을 선택해주세요</option>
          {crops.map(crop => (
            <option key={crop.value} value={crop.value}>
              {crop.label}
            </option>
          ))}
        </select>
        <div className="image-upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="image-upload"
            hidden
          />
          <label 
            htmlFor="image-upload" 
            className="image-upload-label"
          >
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="image-preview" 
              />
            ) : (
              <>
                <FontAwesomeIcon icon={faImage} />
                <span>사진 추가</span>
              </>
            )}
          </label>
        </div>
        <textarea
          placeholder="내용을 입력해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="content-input"
        />

          
        </form>
        <button 
          className="submit-button"
          onClick={handleSubmit}
          disabled={!content || !selectedCrop}
        >
          완료
        </button>
    </div>
  );
}
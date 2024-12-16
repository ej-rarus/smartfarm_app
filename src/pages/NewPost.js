// src/pages/NewPost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faImage } from '@fortawesome/free-solid-svg-icons';

export default function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const crops = [
    { value: 'tomato', label: '토마토' },
    { value: 'strawberry', label: '딸기' },
    { value: 'lettuce', label: '상추' },
    { value: 'cucumber', label: '오이' },
    { value: 'pepper', label: '고추' }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API 호출 로직 구현
    console.log({ title, content, selectedCrop, image });
    navigate(-1); // 제출 후 이전 페이지로 이동
  };

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
        <button 
          className="submit-button"
          onClick={handleSubmit}
          disabled={!content || !selectedCrop}
        >
          완료
        </button>
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
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import axios from "axios";

function MyCropNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: "",
    species: "",
    planted_at: null,
    harvest_at: null,
  });
  const [error, setError] = useState(null);

  // 품종 선택 옵션
  const varietyOptions = [
    { value: "", label: "품종을 선택해주세요" },
    { value: "방울토마토", label: "방울토마토" },
    { value: "청상추", label: "청상추" },
    { value: "청양고추", label: "청양고추" },
    { value: "대파", label: "대파" },
    { value: "양배추", label: "양배추" },
    { value: "당근", label: "당근" },
    { value: "감자", label: "감자" }
  ];

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/mycrop`,
        {
          species: formData.species,
          nickname: formData.nickname,
          planted_at: formatDate(formData.planted_at),
          harvest_at: formatDate(formData.harvest_at)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 201) {
        alert("작물이 성공적으로 등록되었습니다!");
        navigate("/mycrop");
      }
    } catch (err) {
      console.error('작물 등록 중 오류 발생:', err);
      setError(err.response?.data?.message || "작물 등록에 실패했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = () => {
    return (
      formData.nickname.trim() !== "" &&
      formData.species !== "" &&
      formData.planted_at !== null &&
      formData.harvest_at !== null
    );
  };

  return (
    <div className="mycrop-new-container">
      <header className="mycrop-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>새 농작물</h1>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mycrop-new-form">
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="농작물 이름을 입력해주세요"
            className="crop-name-input"
            required
          />
        </div>

        <div className="form-group">
          <label>품종</label>
          <select
            name="species"
            value={formData.species}
            onChange={handleChange}
            className="crop-variety-input"
            required
          >
            {varietyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>파종일자</label>
          <DatePicker
            selected={formData.planted_at}
            onChange={(date) => {
              setFormData(prev => ({
                ...prev,
                planted_at: date
              }));
            }}
            locale={ko}
            dateFormat="yyyy-MM-dd"
            inline
            required
          />
        </div>

        <div className="form-group">
          <label>예상 수확일자</label>
          <DatePicker
            selected={formData.harvest_at}
            onChange={(date) => {
              setFormData(prev => ({
                ...prev,
                harvest_at: date
              }));
            }}
            locale={ko}
            dateFormat="yyyy-MM-dd"
            inline
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className={`mycrop-new-submit-button ${!isFormValid() ? 'disabled' : ''}`}
            disabled={!isFormValid()}
          >
            완료
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyCropNew; 
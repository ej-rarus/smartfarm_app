import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LowerNav from "../components/LowerNav";

function MyCropNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    plantDate: "",
    expectedHarvestDate: "",
    visibility: "public"
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("제출된 데이터:", formData);
    // 실제 API 연동 전 테스트용 알림
    alert("작물이 등록되었습니다!");
    navigate("/mycrop");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="mycrop-new-container">
      <div className="mycrop-new-header">
        <button 
          className="back-button"
          onClick={() => navigate("/mycrop")}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1>새 농작물</h1>
      </div>

      <form onSubmit={handleSubmit} className="mycrop-new-form">
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="농작물 이름을 입력해주세요"
            required
          />
        </div>

        <div className="form-group">
          <label>품종</label>
          <select
            name="variety"
            value={formData.variety}
            onChange={handleChange}
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
          <input
            type="date"
            name="plantDate"
            value={formData.plantDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>예상 수확일자</label>
          <input
            type="date"
            name="expectedHarvestDate"
            value={formData.expectedHarvestDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>공개범위</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            required
          >
            <option value="public">전체 공개</option>
            <option value="private">비공개</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            완료
          </button>
        </div>
      </form>
      <LowerNav />
    </div>
  );
}

export default MyCropNew; 
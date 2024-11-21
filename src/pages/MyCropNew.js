import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from '../utils/auth';

function MyCropNew() {
  const [cropName, setCropName] = useState("");
  const [variety, setVariety] = useState("");
  const [plantDate, setPlantDate] = useState("");
  const [expectedHarvestDate, setExpectedHarvestDate] = useState("");
  const [status, setStatus] = useState("growing");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/crops`, {
        crop_name: cropName,
        variety: variety,
        plant_date: plantDate,
        expected_harvest_date: expectedHarvestDate,
        status: status,
        notes: notes
      });
      navigate("/mycrop");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">새 작물 등록</h1>
      <form className="std-form" onSubmit={handleSubmit}>
        <div className="std-form-container">
          <label>작물명</label>
          <input
            className="input-field"
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            required
          />
        </div>
        <div className="std-form-container">
          <label>품종</label>
          <input
            className="input-field"
            type="text"
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            required
          />
        </div>
        <div className="std-form-container">
          <label>심은 날짜</label>
          <input
            className="input-field"
            type="date"
            value={plantDate}
            onChange={(e) => setPlantDate(e.target.value)}
            required
          />
        </div>
        <div className="std-form-container">
          <label>예상 수확일</label>
          <input
            className="input-field"
            type="date"
            value={expectedHarvestDate}
            onChange={(e) => setExpectedHarvestDate(e.target.value)}
          />
        </div>
        <div className="std-form-container">
          <label>상태</label>
          <select
            className="input-field"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="growing">생육중</option>
            <option value="harvested">수확완료</option>
            <option value="failed">실패</option>
          </select>
        </div>
        <div className="std-form-container">
          <label>메모</label>
          <textarea
            className="input-field long-text-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
        
        <div className="std-form-container">
          <button className="std-btn" type="submit">등록</button>
          <button 
            className="std-btn" 
            type="button"
            onClick={() => navigate("/mycrop")}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default MyCropNew; 
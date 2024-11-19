import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginForm({ onSubmit, error }) {
  const [formData, setFormData] = useState({
    email_adress: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'email-input' ? 'email_adress' : id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('제출된 데이터:', formData);
    onSubmit(formData);
  };

  return (
    <div className="component-container">
      <form id="login-form" onSubmit={handleSubmit}>
        <input 
          id="email-input"
          type="email"
          placeholder="이메일"
          value={formData.email_adress}
          onChange={handleChange}
          required
        />
        <input 
          id="password"
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button id="login-btn" type="submit">
          로그인
        </button>
      </form>
      <div className="find">
        <Link to="/signup" className="custom-link">
          <span className="span-text">회원가입</span>
        </Link>
        <Link to="/forgotpassword" className="custom-link">
          <span className="span-text">비밀번호를 잊어버리셨나요?</span>
        </Link>
      </div>
    </div>
  );
}

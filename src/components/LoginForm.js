import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'id-input' ? 'username' : 'password']: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/login`, formData);
      
      const { token, user } = response.data;
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, token);
      localStorage.setItem(process.env.REACT_APP_USER_KEY, JSON.stringify(user));

      navigate('/dashboard');

    } catch (err) {
      setError(
        err.response?.data?.message || 
        "로그인에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="component-container">
      <form id="login-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <input
          id="id-input"
          type="text"
          placeholder="아이디"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          id="pw-input"
          type="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
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

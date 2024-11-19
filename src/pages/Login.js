import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from "../components/LoginForm";
import axios from 'axios';
import { setAuthHeader } from '../utils/auth';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (formData) => {
    try {
      console.log('로그인 시도:', formData);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/login`,
        formData
      );

      console.log('서버 응답:', response.data);

      const data = response.data;
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user;

      if (!token || !user) {
        console.error('응답 데이터:', data);
        throw new Error('토큰 또는 사용자 정보가 없습니다.');
      }

      localStorage.setItem(process.env.REACT_APP_AUTH_TOKEN_KEY, token);
      localStorage.setItem(process.env.REACT_APP_USER_KEY, JSON.stringify(user));
      
      setAuthHeader(token);

      console.log('저장된 토큰:', localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY));
      console.log('저장된 사용자:', localStorage.getItem(process.env.REACT_APP_USER_KEY));

      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from);
    } catch (error) {
      console.error('로그인 에러:', error);
      setError(
        error.response?.data?.message || 
        "로그인에 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="login-wrapper">
        <LoginForm onSubmit={handleLogin} error={error} />
      </div>
    </div>
  );
}

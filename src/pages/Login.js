import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from "../components/LoginForm";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // 이미 로그인된 사용자는 대시보드로 리다이렉트
    const isLoggedIn = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      // 로그인 로직...
      
      // 로그인 성공 후 이전에 시도했던 페이지로 리다이렉트
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from);
    } catch (error) {
      // 에러 처리...
    }
  };

  return (
    <div className="page-container">
      <div className="login-wrapper">
        <LoginForm />
      </div>
    </div>
  );
}

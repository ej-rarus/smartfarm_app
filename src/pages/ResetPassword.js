import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.password !== passwords.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/reset-password/${token}`,
        { password: passwords.password }
      );
      
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/login');
    } catch (error) {
      setError(
        error.response?.data?.message || 
        '비밀번호 변경 중 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="component-container">
        <h2>새 비밀번호 설정</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="std-form-container">
            <input
              type="password"
              name="password"
              className="std-input-field"
              placeholder="새 비밀번호"
              value={passwords.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="std-form-container">
            <input
              type="password"
              name="confirmPassword"
              className="std-input-field"
              placeholder="새 비밀번호 확인"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="std-btn"
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '비밀번호 변경'}
          </button>
        </form>
      </div>
    </div>
  );
} 
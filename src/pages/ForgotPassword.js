import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/reset-password`,
        { email_adress: email }
      );
      
      setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
    } catch (error) {
      setError(
        error.response?.data?.message || 
        '비밀번호 재설정 요청 중 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="component-container">
        <h2>비밀번호 재설정</h2>
        <p>가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="std-form-container">
            <input
              type="email"
              className="std-input-field"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="std-btn"
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '비밀번호 재설정 링크 받기'}
          </button>
        </form>
      </div>
    </div>
  );
}

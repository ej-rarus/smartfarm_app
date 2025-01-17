import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '🌱왜 불러요? 바쁘다고요😠'
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { role: 'user', content: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/chat`;
      const token = localStorage.getItem('token');
      
      console.log('요청 정보:', {
        apiUrl,
        token: token ? '토큰 존재' : '토큰 없음',
        message: newMessage
      });

      const response = await axios.post(
        apiUrl,
        { message: newMessage },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        }
      );

      console.log('서버 응답:', response.data);

      if (response.data.status === 200) {
        const botMessage = { 
          role: response.data.data.role, 
          content: response.data.data.content 
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.data.message);
      }

    } catch (error) {
      console.error('상세 에러 정보:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

      let errorMessage;
      if (error.response?.status === 400) {
        errorMessage = '메시지를 입력해주세요.';
      } else if (error.response?.status === 401) {
        errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
      } else if (error.response?.status === 404) {
        errorMessage = 'API 엔드포인트를 찾을 수 없습니다.';
      } else if (error.response?.status === 500) {
        errorMessage = error.response.data.message || '서버 내부 오류가 발생했습니다.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = '서버 응답 시간이 초과되었습니다.';
      } else if (!error.response) {
        errorMessage = '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
      } else {
        errorMessage = '죄송합니다. 일시적인 오류가 발생했습니다.';
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {!isOpen ? (
        <button 
          className="chatbot-button"
          onClick={() => setIsOpen(true)}
        >
          <img 
            src="/images/jh_icon.png" 
            alt="장협봇" 
            className="chatbot-icon"
          />
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>장협봇</h3>
            <button 
              className="chatbot-close-button"
              onClick={() => setIsOpen(false)}
            >
            나가기
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <span className="typing-indicator">...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="질문을 입력하세요..."
              disabled={isLoading}
            />
            <button type="submit" className="chatbot-send-button" disabled={isLoading}>
            <img 
            src="/images/jh_icon.png" 
            alt="장협봇" 
            className="chatbot-icon"
          />
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 
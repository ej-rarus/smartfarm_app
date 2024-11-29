import React, { useState } from 'react';
import axios from 'axios';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { role: 'user', content: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/chat`,
        { message: newMessage }
      );

      const botMessage = { role: 'assistant', content: response.data.message };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('챗봇 응답 오류:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '죄송합니다. 일시적인 오류가 발생했습니다.' 
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
          <i className="fas fa-comment"></i>
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>장협봇</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <span className="typing-indicator">...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="질문을 입력하세요..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 
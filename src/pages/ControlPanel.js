import '../App.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import StdControlBtn from '../components/StdControlBtn';

function ControlPanel() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const responseListRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const [data2] = useState([{
    name: 'Page A',
    uv: 40,
    pv: 24,
    amt: 24,
  },
  {
    name: 'Page B',
    uv: 30,
    pv: 13,
    amt: 22,
  },
  {
    name: 'Page C',
    uv: 20,
    pv: 98,
    amt: 22,
  },
  {
    name: 'Page D',
    uv: 27,
    pv: 39,
    amt: 20,
  },
  {
    name: 'Page E',
    uv: 18,
    pv: 48,
    amt: 21,
  },
  {
    name: 'Page F',
    uv: 23,
    pv: 38,
    amt: 25,
  },
  {
    name: 'Page G',
    uv: 34,
    pv: 43,
    amt: 21,
  },]);

  const connectWebSocket = useCallback(() => {
    try {
      ws.current = new WebSocket('ws://3.39.126.121:3000');

      ws.current.onopen = () => {
        console.log('웹소켓 연결 성공');
        setIsConnected(true);
        setError(null);
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
      };

      ws.current.onmessage = (event) => {
        const response = event.data;
        setResponses(prev => [...prev, response]);
      };

      ws.current.onerror = (error) => {
        console.error('웹소켓 에러:', error);
        setError('웹소켓 연결 중 오류가 발생했습니다.');
        setIsConnected(false);
      };

      ws.current.onclose = () => {
        console.log('웹소켓 연결 종료');
        setIsConnected(false);
        // 3초 후 재연결 시도
        reconnectTimeout.current = setTimeout(() => {
          console.log('웹소켓 재연결 시도...');
          connectWebSocket();
        }, 3000);
      };
    } catch (err) {
      console.error('웹소켓 연결 실패:', err);
      setError('웹소켓 연결에 실패했습니다.');
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    const connect = () => connectWebSocket();
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    if (responseListRef.current) {
      responseListRef.current.scrollTop = responseListRef.current.scrollHeight;
    }
  }, [responses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
      setMessage('');
    } else {
      setError('웹소켓이 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">제어패널</h1>
      <hr
        style={{
          border: 'none',
          height: '2px',
          backgroundColor: 'gray',
          width: '13rem',
          marginTop: '0.5rem',
        }}
      />
      
      <StdControlBtn ws={ws} />

      <div className="websocket-container">
        <div className="connection-status">
          연결 상태: {isConnected ? 
            <span className="connected">연결됨</span> : 
            <span className="disconnected">연결 끊김</span>
          }
        </div>
        
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="명령어를 입력하세요"
            className="command-input"
            disabled={!isConnected}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!isConnected}
          >
            전송
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="response-container">
          <h3>응답 메시지:</h3>
          <div className="response-list" ref={responseListRef}>
            {responses.map((response, index) => (
              <div key={index} className="response-item">
                {response}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="90%" height={300}>
        <LineChart data={data2}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis/>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ControlPanel;

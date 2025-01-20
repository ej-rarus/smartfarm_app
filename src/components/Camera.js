import { useState, useEffect } from 'react';

export default function Camera() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const streamUrl ='http://dsfarm6f.iptime.org:10101/stream';

  const handleImageError = () => {
    setIsStreaming(false);
    setIsLoading(false);
    setError('스트리밍 연결에 실패했습니다. 카메라 연결을 확인해주세요.');
  };

  const handleImageLoad = () => {
    setIsStreaming(true);
    setIsLoading(false);
    setError(null);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIsStreaming(true);
    setError(null);
  };

  return (
    <div className="camera-container">
      <h1>ESP32-CAM 실시간 스트리밍</h1>
      <p>현재 ESP32-CAM에서 전송되는 실시간 영상입니다:</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="stream-container">
        {isStreaming ? (
          <>
            {isLoading && <div className="loading-message">스트리밍 로딩 중...</div>}
            <img 
              id="stream" 
              src={streamUrl} 
              alt="ESP32-CAM Stream"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          </>
        ) : (
          <div className="stream-error">
            <p>스트리밍이 중단되었습니다</p>
            <button onClick={handleRefresh}>
              새로고침
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

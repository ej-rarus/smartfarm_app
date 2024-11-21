import axios from 'axios';

// 로그인 상태 확인
export const isAuthenticated = () => {
  const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
  const user = getCurrentUser();
  return !!token && !!user;
};

// 현재 사용자 정보 가져오기
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(process.env.REACT_APP_USER_KEY);
  const token = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
  
  if (!userStr || !token) {
    return null;
  }

  const user = JSON.parse(userStr);
  return { ...user, token };
};

// JWT 토큰 가져오기
export const getToken = () => {
  return localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
};

// 로그아웃
export const logout = () => {
  // 로컬 스토리지에서 인증 관련 데이터 제거
  localStorage.removeItem(process.env.REACT_APP_AUTH_TOKEN_KEY);
  localStorage.removeItem(process.env.REACT_APP_USER_KEY);
  
  // axios 헤더에서 인증 토큰 제거
  delete axios.defaults.headers.common['Authorization'];
};

// axios 인증 헤더 설정
export const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}; 
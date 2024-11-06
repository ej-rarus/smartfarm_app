import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3); // 초기 카운트다운 값 설정

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1); // 카운트다운 감소
    }, 1000);

    // 0초가 되면 '/' 경로로 이동하고 타이머를 정리
    if (countdown === 0) {
      navigate('/');
    }

    // 컴포넌트가 언마운트되거나 countdown이 0이 되면 타이머 정리
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="page-container">
      <span>{`'username'님, 회원가입이 완료되었습니다!`}</span>
      <span>{`${countdown}초 후에 메인 페이지로 이동합니다.`}</span>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";


export default function Welcome() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(parseInt(process.env.REACT_APP_WELCOME_COUNTDOWN || '3'));
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy. MM. dd. h:mm a");

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
      <span>{`'username'님, 가입해주셔서 감사합니다.`}</span>
      <div>{formattedDate}</div>
      <span>{`${countdown}초 후에 메인 페이지로 이동합니다.`}</span>
    </div>
  );
}


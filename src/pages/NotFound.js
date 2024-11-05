// NotFound.js
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-container">
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>404</h1>
        <p>요청하신 페이지를 찾을 수 없습니다.</p>
        <Link to="/">홈으로 돌아가기</Link>
      </div>
    </div>
  );
}

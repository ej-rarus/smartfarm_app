// NotFound.js
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-container">
      <div style={{ 
        textAlign: "center", 
        padding: "4rem",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem"
      }}>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
        <p>요청하신 페이지를 찾을 수 없습니다.</p>
        <Link 
          to="/" 
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            display: "inline-block"
          }}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

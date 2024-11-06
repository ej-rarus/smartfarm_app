import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

import Terms from "./Terms";
import MarketingInfo from "./MarketingInfo";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailUnique, setIsEmailUnique] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수 조건을 모두 확인
    if (!isEmailUnique) {
      alert("이메일 중복 확인을 완료해 주세요.");
      return;
    }
    if (!isPasswordMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isEmailValid) {
      alert("유효한 이메일 형식을 입력해 주세요.");
      return;
    }
    
    // 모든 조건을 충족하면 /welcome 페이지로 이동
    navigate('/welcome');
  };

  const checkEmailDuplication = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해 주세요.");
      return;
    }
    if (!isEmailValid) {
      alert("유효한 이메일 형식을 입력해 주세요.");
      return;
    }
    const isUnique = email !== "duplicate@example.com"; // 실제로는 서버 요청을 통해 확인
    setIsEmailUnique(isUnique);
    alert(isUnique ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.");
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // 이메일 형식 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(emailValue));

    setIsEmailUnique(null); // 이메일 변경 시 중복 상태 초기화
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsPasswordMatch(newPassword === passwordConfirm);
    setPasswordStrength(checkPasswordStrength(newPassword)); // 비밀번호 강도 업데이트
  };

  const handlePasswordConfirmChange = (e) => {
    const confirmValue = e.target.value;
    setPasswordConfirm(confirmValue);
    setIsPasswordMatch(confirmValue !== "" && password !== "" && confirmValue === password);
  };

  // 비밀번호 강도 평가 함수
  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "약함";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && password.length >= 8) {
      return "강함";
    } else if ((hasUpperCase || hasLowerCase) && hasNumbers && password.length >= 6) {
      return "보통";
    } else {
      return "약함";
    }
  };

  return (
    <div className="component-container">
      <form className="std-form" onSubmit={handleSubmit}>
        {/* 이메일 주소 */}
        <div className="std-form-container">
          <label>E-mail</label>
          <input
            className="std-input-field"
            type="text"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <button type="button" onClick={checkEmailDuplication} className="check-btn">
            중복 확인
          </button>
          {!isEmailValid && <span className="error-message">유효한 이메일 형식이 아닙니다.</span>}
          {isEmailUnique === false && <span className="error-message">이미 사용 중인 이메일입니다.</span>}
          {isEmailUnique === true && <span className="success-message">사용 가능한 이메일입니다.</span>}
        </div>

        {/* 비밀번호 */}
        <div className="std-form-container">
          <label>비밀번호</label>
          <input
            className="std-input-field"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <span className={`password-strength ${passwordStrength}`}>
            비밀번호 강도: {passwordStrength}
          </span>
        </div>

        {/* 비밀번호 확인 */}
        <div className="std-form-container">
          <label>비밀번호 확인</label>
          <input
            className="std-input-field"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            required
          />
          {password !== "" && passwordConfirm !== "" && (
            !isPasswordMatch ? 
              <span className="error-message">비밀번호가 일치하지 않습니다.</span> : 
              <span className="success-message">비밀번호가 일치합니다.</span>
          )}
        </div>

        {/* 이름 */}
        <div className="std-form-container">
          <label>이름</label>
          <input className="std-input-field" type="text" placeholder="이름을 입력하세요" name="user-name" required />
        </div>

        {/* 이용약관 */}
        <div className="std-form-container">
          <fieldset className="marketing-option" required>
            <label className="terms">이용약관 및 개인정보처리방침</label>
            <Terms />
            <div className="checkbox-container">
              <input type="checkbox" name="terms-confirm" required />
              <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
            </div>
          </fieldset>
        </div>

        {/* 마케팅 정보 수신 동의 */}
        <div className="std-form-container">
          <fieldset className="marketing-option">
            <legend>마케팅 정보 수신 동의</legend>
            <MarketingInfo />
            <label>
              <input type="radio" name="marketing" value="1" />
              동의
            </label>
            <label>
              <input type="radio" name="marketing" value="0" />
              거부
            </label>
          </fieldset>
        </div>

        {/* 제출 버튼 */}
        <div className="std-form-container">
          <button type="submit" className="submit-btn">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}

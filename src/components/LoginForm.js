import { Link } from "react-router-dom";

export default function LoginForm() {
  return (
    <div className="component-container">
        <form id="login-form">
          <input id="id-input" type="text" placeholder="아이디"></input>
          <input id="pw-input" type="password" placeholder="비밀번호"></input>
          <button id="login-btn" type="submit">
            {" "}
            로그인{" "}
          </button>
        </form>
        <div className="find">
          <Link to={"/signup"} className="custom-link">
            <span className="span-text">회원가입</span>
          </Link>
          <Link to={"/forgotpassword"} className="custom-link">
            <span className="span-text">비밀번호를 잊어버리셨나요?</span>
          </Link>
        </div>
    </div>
  );
}

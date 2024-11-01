import "../App.css";

export default function SignUpForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="component-container">
      <form className="signup-container" onSubmit={handleSubmit}>
        {/* 이메일 주소: 로그인 ID로 사용되며, 인증 이메일을 보내는 데에도 필요합니다. */}
        <label>
          E-mail
          <input
            type="text"
            placeholder="이메일을 입력하세요"
            name="email"
            required
          />
        </label>

        {/* 비밀번호: 최소 자릿수와 보안 조건(대문자, 특수문자 등)을 설정하는 것이 좋습니다. */}
        <label>
          비밀번호
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            name="password"
            required
          />
        </label>

        {/* 비밀번호 확인: 비밀번호를 다시 입력해 정확성을 확인합니다. */}
        <label>
          비밀번호 확인
          <input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            name="password-confirm"
            required
          />
        </label>

        {/* 이름 또는 사용자 이름: 사용자 본명을 입력하거나 별명을 사용할 수 있게 합니다. */}
        <label>
          이름
          <input
            type="text"
            placeholder="이름을 입력하세요"
            name="user-name"
            required
          />
        </label>

        {/* 이용약관 및 개인정보처리방침 동의: 필수 항목으로, 사용자가 약관과 개인정보 정책에 동의하도록 체크박스를 제공합니다. */}
        <label className="terms">
          <input type="checkbox" name="terms-confirm" required />
          <span>이용약관 및 개인정보 처리방침에 동의합니다.</span>
        </label>

        {/* 마케팅 및 프로모션 정보 수신 동의: 선택사항으로, 마케팅 정보 수신 여부를 결정할 수 있습니다. */}
        <fieldset className="marketing-option">
          <legend>마케팅 정보 수신 동의</legend>
          <label>
            <input type="radio" name="marketing" value="1" />
            동의
          </label>
          <label>
            <input type="radio" name="marketing" value="0" />
            거부
          </label>
        </fieldset>

        {/* CAPTCHA 또는 보안 질문: 봇 방지를 위해 추가할 수 있습니다. */}
        <div className="captcha">
          {/* CAPTCHA 컴포넌트가 여기에 추가됩니다 */}
        </div>

        {/* 제출 버튼 */}
        <button type="submit" className="submit-btn">
          회원가입
        </button>
      </form>
    </div>
  );
}

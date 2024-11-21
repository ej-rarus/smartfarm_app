import React from "react";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightToBracket, faRightFromBracket  } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { logout } from '../utils/auth';

function Nav({ menuVisible, setMenuVisible }) {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // 상태를 토글
  };
  return (
      <div className="nav">
        <div className="main-logo-container">
          <div id="main-logo" onClick={() => {navigate('/');}}>
            FARMSTER
          </div>
        </div>
        <div className="nav-btn-container">
          {isLoggedIn ? (
            <div id="sign-out-btn" className="nav-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} size="2x" />
            </div>
          ) : (
            <div id="sign-in-btn" className="nav-btn" onClick={()=>navigate("/login")}>
              <FontAwesomeIcon icon={faRightToBracket} size="2x" />
            </div>
          )}
          <div id="burger-menu-btn" className="nav-btn" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} size="2x" /> {/* 버거 아이콘 */}
          </div>
        </div>
      </div>
  );
}

export default Nav;

import React from "react";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightToBracket  } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Nav({ menuVisible, setMenuVisible }) {
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // 상태를 토글
  };
  return (
      <div className="nav">
        <div className="main-logo-container">
          <div className="main-logo" onClick={() => {setMenuVisible(false); navigate('/');}}>
            스마트팜앱
          </div>
        </div>
        <div className="nav-btn-container">
          <div id="sign-in-btn" className="nav-btn" onClick={()=>navigate("/login")}>
            <FontAwesomeIcon icon={faRightToBracket} size="2x" />
          </div>
          <div id="burger-menu-btn" className="nav-btn" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} size="2x" /> {/* 버거 아이콘 */}
          </div>
        </div>
      </div>
  );
}

export default Nav;

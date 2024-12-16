import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket, faRightFromBracket, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { logout } from '../utils/auth';
import '../App.css';

function Sidebar({menuVisible, setMenuVisible}){
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN_KEY);

    const isCurrentPath = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        setMenuVisible(false);
        navigate('/login');
    };

    return(
        <div id="sidebar-container" className={menuVisible ? 'open' : ''} style={{
            zIndex: 1,
        }}>
            <div className={`sidebar-btn ${isCurrentPath('/') ? 'active' : ''}`} 
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/')}}>
                메인페이지
            </div>
            <div className={`sidebar-btn ${isCurrentPath('/dashboard') ? 'active' : ''}`}
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/dashboard')}}>
                대시보드
            </div>
            <div className={`sidebar-btn ${isCurrentPath('/controlpanel') ? 'active' : ''}`}
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/controlpanel')}}>
                컨트롤패널
            </div>
            <div className={`sidebar-btn ${isCurrentPath('/diary') ? 'active' : ''}`}
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/diary')}}>
                영농일지
            </div>
            <div className={`sidebar-btn ${isCurrentPath('/mycrop') ? 'active' : ''}`}
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/mycrop')}}>
                내 작물
            </div>
            <div className={`sidebar-btn ${isCurrentPath('/feed') ? 'active' : ''}`}
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/feed')}}>
                커뮤니티
            </div>
            <div className="sidebar-bottom">
                {isLoggedIn ? (
                    <>
                        <div className={`sidebar-btn ${isCurrentPath('/mypage') ? 'active' : ''}`}
                            onClick={()=>{setMenuVisible(!menuVisible); navigate('/mypage')}}>
                            <FontAwesomeIcon icon={faCircleUser} className="sidebar-icon" size="2x" />
                            <span>&nbsp;&nbsp;마이페이지</span>
                        </div>
                        <div className="sidebar-btn" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faRightFromBracket} className="sidebar-icon" size="2x" />
                            <span>&nbsp;&nbsp;로그아웃</span>
                        </div>
                    </>
                ) : (
                    <div className="sidebar-btn" onClick={()=>{setMenuVisible(!menuVisible); navigate('/login')}}>
                        <FontAwesomeIcon icon={faRightToBracket} className="sidebar-icon" />
                        <span>&nbsp;로그인</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
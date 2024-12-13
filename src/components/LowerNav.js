import React from 'react';
import { useNavigate } from 'react-router-dom';

const LowerNav = () => {
    const navigate = useNavigate();
    const isActive = (path) => window.location.pathname === path;

    return (
        <nav className="bottom-navigation">
            <div className="bottom-nav-item" onClick={() => navigate('/')}>
                <i className={`fas fa-home ${isActive('/') ? 'bottom-nav-active' : ''}`}></i>
                <span className={isActive('/') ? 'bottom-nav-active' : ''}>홈</span>
            </div>
            <div className="bottom-nav-item" onClick={() => navigate('/diary')}>
                <i className={`fas fa-book ${isActive('/diary') ? 'bottom-nav-active' : ''}`}></i>
                <span className={isActive('/diary') ? 'bottom-nav-active' :  ''}>커뮤니티</span>
            </div>
            <div className="bottom-nav-item" onClick={() => navigate('/diary/new')}>
                <i className={`fas fa-plus-square ${isActive('/diary/new') ? 'bottom-nav-active' : ''}`}></i>
                <span className={isActive('/diary/new') ? 'bottom-nav-active' : ''}>글쓰기</span>
            </div>
            <div className="bottom-nav-item" onClick={() => navigate('/profile')}>
                <i className={`fas fa-user ${isActive('/profile') ? 'bottom-nav-active' : ''}`}></i>
                <span className={isActive('/profile') ? 'bottom-nav-active' : ''}>내 정보</span>
            </div>
        </nav>
    );
};

export default LowerNav;

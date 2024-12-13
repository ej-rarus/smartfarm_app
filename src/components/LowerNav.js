import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function LowerNav() {
    const navigate = useNavigate();
    const location = useLocation();

    // 현재 경로에 따라 아이콘 활성화 여부 결정
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="lower-nav">
            <div className="nav-item" onClick={() => navigate('/')}>
                <i className={`fas fa-home ${isActive('/') ? 'active' : ''}`}></i>
                <span className={isActive('/') ? 'active' : ''}>홈</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/diary')}>
                <i className={`fas fa-book ${isActive('/diary') ? 'active' : ''}`}></i>
                <span className={isActive('/diary') ? 'active' : ''}>커뮤니티</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/diary/new')}>
                <i className={`fas fa-plus-square ${isActive('/diary/new') ? 'active' : ''}`}></i>
                <span className={isActive('/diary/new') ? 'active' : ''}>글쓰기</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/profile')}>
                <i className={`fas fa-user ${isActive('/profile') ? 'active' : ''}`}></i>
                <span className={isActive('/profile') ? 'active' : ''}>내 정보</span>
            </div>
        </nav>
    );
}

export default LowerNav;

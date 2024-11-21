import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../App.css';

function Sidebar({menuVisible, setMenuVisible}){
    const navigate = useNavigate();
    const location = useLocation();

    const isCurrentPath = (path) => {
        return location.pathname === path;
    };

    return(
        <div id="sidebar-container" className={menuVisible ? 'open' : ''}>
            <div className={`sidebar-btn ${isCurrentPath('/') ? 'active' : ''}`} 
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/')}}>
                Main
            </div>
            <div className={`sidebar-btn ${isCurrentPath('/dashboard') ? 'active' : ''}`}
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/dashboard')}}>
                Dashboard
            </div>
            <div className={`sidebar-btn ${isCurrentPath('/controlpanel') ? 'active' : ''}`}
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/controlpanel')}}>
                Control
            </div>
            <div className={`sidebar-btn ${isCurrentPath('/diary') ? 'active' : ''}`}
                onClick={()=>{setMenuVisible(!menuVisible); navigate('/diary')}}>
                Diary
            </div>
        </div>
    );
}

export default Sidebar;
import React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';

function Sidebar({menuVisible, setMenuVisible}){
    const navigate = useNavigate();

    return(
        <div id="sidebar-container"  style={{display: menuVisible ? 'flex' : 'none'}}>
            <div className="sidebar-btn" onClick={()=>{setMenuVisible(!menuVisible); navigate('/')}}>Main</div>
            <div className="sidebar-btn" onClick={()=>{setMenuVisible(!menuVisible); navigate('/dashboard')}}>Dashboard</div>
            <div className="sidebar-btn" onClick={()=>{setMenuVisible(!menuVisible); navigate('/controlpanel')}}>Control</div>
            <div className="sidebar-btn" onClick={()=>{setMenuVisible(!menuVisible); navigate('/diary')}}>Diary</div>
        </div>
    );
}

export default Sidebar;
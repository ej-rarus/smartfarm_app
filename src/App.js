import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Main from "./pages/Main";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ControlPanel from "./pages/ControlPanel";
import Diary from "./pages/Diary";
import DiaryNewPost from "./pages/DiaryNewPost";
import DiaryEditPost from "./pages/DiaryEditPost";
import DiaryPost from "./pages/DiaryPost";
import ForgotPassword from "./pages/ForgotPassword";
import Welcome from "./pages/Welcome";


import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";

function AppContent() {
  const location = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    setMenuVisible(false);
  }, [location.pathname]);

  return (
    <div className="App">
      <Nav menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
      <Sidebar menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/welcome" element={<Welcome />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/controlpanel" element={<ControlPanel />} />
        
        <Route path="/diary/new" element={<DiaryNewPost />} />
        <Route path="/diary/edit/:id" element={<DiaryEditPost />} />
        <Route path="/diary/:id" element={<DiaryPost />} />
        <Route path="/diary" element={<Diary />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

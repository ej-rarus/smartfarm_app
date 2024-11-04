import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";


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

import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import ForgotPassword from "./pages/ForgotPassword";


function App() {

  const [menuVisible, setMenuVisible] = useState(false); // menuVisible 상태 관리


  return (
    <BrowserRouter>

      <div className="App">
      <Nav menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
      <Sidebar menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/controlpanel" element={<ControlPanel/>} />
          <Route path="/diary" element={<Diary/>} />
          <Route path="/diary/:id" element={<DiaryPost />} /> {/* 동적 라우트 */}
          <Route path="/diary/new" element={<DiaryNewPost />} /> {/* 글쓰기 경로 추가 */}
          <Route path="/diary/edit/:id" element = {<DiaryEditPost/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;

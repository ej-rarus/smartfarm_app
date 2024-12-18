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
import ResetPassword from "./pages/ResetPassword";
import MyPage from "./pages/MyPage";
import MyCrop from './pages/MyCrop';
import MyCropNew from './pages/MyCropNew';
import Feed from './pages/Feed';
import NewPost from './pages/NewPost';
import CropPostDetail from './pages/CropPostDetail';
import CropPosts from "./pages/CropPosts";

import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

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
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/controlpanel" element={
          <ProtectedRoute>
            <ControlPanel />
          </ProtectedRoute>
        } />
        
        <Route path="/diary/new" element={
          <ProtectedRoute>
            <DiaryNewPost />
          </ProtectedRoute>
        } />
        <Route path="/diary/edit/:id" element={
          <ProtectedRoute>
            <DiaryEditPost />
          </ProtectedRoute>
        } />
        <Route path="/diary/:id" element={
          <ProtectedRoute>
            <DiaryPost />
          </ProtectedRoute>
        } />
        <Route path="/diary" element={
          <ProtectedRoute>
            <Diary />
          </ProtectedRoute>
        } />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        <Route path="/mypage" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        } />
        <Route path="/mycrop" element={
          <ProtectedRoute>
            <MyCrop />
          </ProtectedRoute>
        } />
        <Route path="/mycrop/new" element={
          <ProtectedRoute>
            <MyCropNew />
          </ProtectedRoute>
        } />
        <Route path="/mycrop/:id" element={<CropPosts />} />
        
        <Route path="/feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />

        <Route path="/post/new" element={
          <ProtectedRoute>
            <NewPost />
          </ProtectedRoute>
        } />
        <Route path="/post/:id" element={<CropPostDetail />} />

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

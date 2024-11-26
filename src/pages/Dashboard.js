import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RealTimeChart from '../components/RealTimeChart';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import "../App.css";
import ArduinoSensorData from '../components/ArduinoSensorData';

function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // 인증 확인
        if (!isAuthenticated()) {
            navigate('/login', { state: { from: { pathname: '/dashboard' } } });
            return;
        }

        // 사용자 정보 로드
        try {
            const user = getCurrentUser();
            setUserData(user);
            setLoading(false);
        } catch (err) {
            setError('사용자 정보를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    }, [navigate]);

    if (loading) return <div className="page-container">로딩 중...</div>;
    if (error) return <div className="page-container">에러: {error}</div>;

    return (
        <div className='page-container'>
            <h1 className='page-title'>Dashboard</h1>
            <hr style={{
                border: 'none', 
                height: '2px', 
                backgroundColor: 'gray', 
                width:'13rem', 
                marginTop:"0.5rem"
            }}/>
            {userData && (
                <div className="user-info">
                    <p>환영합니다, {userData.username}님!</p>
                    <p>이메일: {userData.email}</p>
                </div>
            )}
            <ArduinoSensorData/>
            <RealTimeChart/>

            <p>재배실 현황</p>
            <p>카메라</p>
            <p>온도</p>
            <p>습도</p>
        </div>
    );
}

export default Dashboard;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import "../App.css";
function MyPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { state: { from: { pathname: '/mypage' } } });
            return;
        }

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
            <h1 className='page-title'>마이페이지</h1>
            <hr style={{
                border: 'none', 
                height: '2px', 
                backgroundColor: 'gray', 
                width:'13rem', 
                marginTop:"0.5rem"
            }}/>
            {userData && (
                <div className="user-info">
                    <p>사용자 이름: {userData.username}</p>
                    <p>이메일: {userData.email}</p>
                </div>
            )}
        </div>
    );
}

export default MyPage; 
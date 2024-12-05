import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    
    // 모든 차트 데이터 상태 정의
    const [tempData, setTempData] = useState({
        labels: [],
        values: []
    });
    const [humidData, setHumidData] = useState({
        labels: [],
        values: []
    });
    const [co2Data, setCo2Data] = useState({
        labels: [],
        values: []
    });
    const [lightData, setLightData] = useState({
        labels: [],
        values: []
    });

    // 더미 데이터 생성 및 업데이트
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            // 온도 데이터 업데이트
            setTempData(prev => ({
                labels: [...prev.labels, timeStr].slice(-10),
                values: [...prev.values, Math.random() * 10 + 20].slice(-10) // 20~30도
            }));

            // 습도 데이터 업데이트
            setHumidData(prev => ({
                labels: [...prev.labels, timeStr].slice(-10),
                values: [...prev.values, Math.random() * 30 + 50].slice(-10) // 50~80%
            }));

            // CO2 데이터 업데이트
            setCo2Data(prev => ({
                labels: [...prev.labels, timeStr].slice(-10),
                values: [...prev.values, Math.random() * 200 + 400].slice(-10) // 400~600ppm
            }));

            // 조도 데이터 업데이트
            setLightData(prev => ({
                labels: [...prev.labels, timeStr].slice(-10),
                values: [...prev.values, Math.random() * 500 + 500].slice(-10) // 500~1000lux
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // 차트 옵션 설정
    const tempOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: '온도 (°C)'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 15,
                max: 35
            }
        }
    };

    const humidOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: '습도 (%)'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 40,
                max: 90
            }
        }
    };

    const co2Options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'CO2 농도 (ppm)'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 300,
                max: 700
            }
        }
    };

    const lightOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: '조도 (lux)'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 400,
                max: 1100
            }
        }
    };

    // 차트 데이터 설정
    const tempChartData = {
        labels: tempData.labels,
        datasets: [{
            label: '온도',
            data: tempData.values,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1
        }]
    };

    const humidChartData = {
        labels: humidData.labels,
        datasets: [{
            label: '습도',
            data: humidData.values,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.1
        }]
    };

    const co2ChartData = {
        labels: co2Data.labels,
        datasets: [{
            label: 'CO2',
            data: co2Data.values,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1
        }]
    };

    const lightChartData = {
        labels: lightData.labels,
        datasets: [{
            label: '조도',
            data: lightData.values,
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgba(255, 205, 86, 0.5)',
            tension: 0.1
        }]
    };

    // 인증 체크
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
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
        <div className='dashboard-container'>
            <h1 className='dashboard-title'>Dashboard</h1>
            <div className="dashboard-welcome">
                {userData && <p>환영합니다, {userData.username}님!</p>}
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <Line options={tempOptions} data={tempChartData} />
                </div>
                <div className="chart-container">
                    <Line options={humidOptions} data={humidChartData} />
                </div>
                <div className="chart-container">
                    <Line options={co2Options} data={co2ChartData} />
                </div>
                <div className="chart-container">
                    <Line options={lightOptions} data={lightChartData} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;


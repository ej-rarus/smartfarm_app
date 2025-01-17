import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import Camera from '../components/Camera';
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
import AIChatBot from '../components/AIChatBot';

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
    
    // 센서 데이터 상태만 유지
    const [sensorData, setSensorData] = useState({
        temperature: { labels: [], values: [] },
        humidity: { labels: [], values: [] },
        light: { labels: [], values: [] }
    });

    // 센서 데이터 가져오기
    const fetchSensorData = async () => {
        try {
            const response = await fetch('http://3.39.126.121:3000/api/sensor-data/1');
            if (!response.ok) {
                throw new Error('센서 데이터 조회에 실패했습니다');
            }
            const data = await response.json();
            
            if (data.status === 200 && data.data.records) {
                const records = data.data.records;
                
                const formattedData = {
                    temperature: { labels: [], values: [] },
                    humidity: { labels: [], values: [] },
                    light: { labels: [], values: [] }
                };

                // 최신 데이터가 먼저 오도록 정렬
                records.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                records.forEach(record => {
                    const time = new Date(record.created_at).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });

                    formattedData.temperature.labels.push(time);
                    formattedData.temperature.values.push(record.temperature);
                    formattedData.humidity.labels.push(time);
                    formattedData.humidity.values.push(record.humidity);
                    formattedData.light.labels.push(time);
                    formattedData.light.values.push(record.light_intensity);
                });

                setSensorData(formattedData);
            }
        } catch (error) {
            console.error('센서 데이터 조회 실패:', error);
            setError('센서 데이터를 불러오는데 실패했습니다.');
        }
    };

    // 인증 체크 및 센서 데이터 로드
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }

        try {
            const user = getCurrentUser();
            setUserData(user);
            fetchSensorData(); // 초기 데이터 로드
            
            // 10초마다 데이터 업데이트
            const interval = setInterval(fetchSensorData, 10000);
            
            return () => clearInterval(interval);
        } catch (err) {
            setError('사용자 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    // 차트 옵션 설정
    const tempOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: '온도 (°C)'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 40
            }
        }
    };

    const humidOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: '습도 (%)'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 100
            }
        }
    };

    const lightOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'PPFD (μmol/m²/s)'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 1000
            }
        }
    };

    // 차트 데이터 설정
    const tempChartData = {
        labels: sensorData.temperature.labels,
        datasets: [{
            label: '온도',
            data: sensorData.temperature.values,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1
        }]
    };

    const humidChartData = {
        labels: sensorData.humidity.labels,
        datasets: [{
            label: '습도',
            data: sensorData.humidity.values,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.1
        }]
    };

    const lightChartData = {
        labels: sensorData.light.labels,
        datasets: [{
            label: '조도',
            data: sensorData.light.values,
            borderColor: 'rgb(255, 205, 86)',
            backgroundColor: 'rgba(255, 205, 86, 0.5)',
            tension: 0.1
        }]
    };

    if (loading) return <div className="page-container">로딩 중...</div>;
    if (error) return <div className="page-container">에러: {error}</div>;

    return (
        <div className='dashboard-container'>
            <h1 className='dashboard-title'>Dashboard</h1>
            <div className="dashboard-welcome">
                {userData && <p>환영합니다, {userData.username}님!</p>}
            </div>
            <Camera />
            <div className="charts-grid">
                <div className="chart-container">
                    <Line options={tempOptions} data={tempChartData} />
                </div>
                <div className="chart-container">
                    <Line options={humidOptions} data={humidChartData} />
                </div>
                <div className="chart-container">
                    <Line options={lightOptions} data={lightChartData} />
                </div>
            </div>
            <AIChatBot />
        </div>
    );
}

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { Filler, Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.js에 필요한 스케일과 요소를 등록합니다.
ChartJS.register(Filler);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function RealTimeChart() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '실시간 데이터',
                data: [],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const newTime = new Date().toLocaleTimeString();
            const newData = Math.floor((Math.random()*100)%30);

            setChartData((prevData) => {
                const updatedLabels = [...prevData.labels, newTime];
                const updatedData = [...prevData.datasets[0].data, newData];

                return {
                    ...prevData,
                    labels: updatedLabels.slice(-10),
                    datasets: [
                        {
                            ...prevData.datasets[0],
                            data: updatedData.slice(-10),
                        },
                    ],
                };
            });
        }, 1000); // 1초마다 데이터 업데이트

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2>실시간 데이터 그래프</h2>
            <div className='graph-container'>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    animation: {
                        duration: 0, // 실시간 업데이트 시 애니메이션 비활성화
                        easing: 'easeInCubic',
                    },
                    scales: {
                        x: {
                            type: 'category',
                            title: {
                                display: true,
                                text: '시간',
                            },
                        },
                        y: {
                            min: -30,  // y축의 최소값을 고정
                            max: 40, // y축의 최대값을 고정
                            title: {
                                display: true,
                                text: '값',
                            },
                        },
                    },
                }}
            />
            </div>
        </div>
    );
}

export default RealTimeChart;

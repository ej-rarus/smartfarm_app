import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
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

// ChartJS 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TodaysPriceInfo() {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('225'); // 토마토 코드로 기본값 설정

  // 작물 코드 목록
  const cropList = [
    { code: '225', name: '토마토' },
    { code: '226', name: '딸기' },
    { code: '221', name: '수박' },
    { code: '222', name: '참외' },
    { code: '223', name: '오이' },
    { code: '224', name: '호박' },
  ];

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/kamis/price`,
          {
            params: {
              crop_code: selectedCrop
            }
          }
        );

        if (response.data.status === 200 && response.data.data?.data?.item) {
          setPriceData(response.data.data.data.item);
        } else {
          setError(response.data.message || '데이터를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('가격 정보 조회 오류:', err);
        setError('가격 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedCrop) {
      fetchPriceData();
    }
  }, [selectedCrop]);

  const handleCropChange = (event) => {
    setSelectedCrop(event.target.value);
  };

  return (
    <div className="price-container">
      <div className="price-header">
        <h3>농산물 가격 정보</h3>
        <select 
          value={selectedCrop} 
          onChange={handleCropChange}
          className="crop-select"
        >
          {cropList.map(crop => (
            <option key={crop.code} value={crop.code}>
              {crop.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="price-loading">
          가격 정보를 불러오는 중...
        </div>
      )}

      {error && (
        <div className="price-error">
          {error}
          <button onClick={() => window.location.reload()}>
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && (!priceData || priceData.length === 0) && (
        <div className="no-price">
          최근 30일간 거래 내역이 없습니다.
          <p className="no-price-sub">다른 작물을 선택해보세요.</p>
        </div>
      )}

      {!loading && !error && priceData && priceData.length > 0 && (
        <div className="price-list">
          <div className="price-section">
            <h4>최근 거래 가격</h4>
            {priceData
              .filter(item => item.countyname !== "평균" && item.countyname !== "평년")
              .slice(-5)
              .reverse()
              .map((item, index) => (
                <div key={index} className="price-item">
                  <div className="price-header">
                    <span className="date">{item.yyyy}/{item.regday}</span>
                    <span className="location">{item.marketname}</span>
                  </div>
                  <div className="price-details">
                    <span className="kind">{item.kindname}</span>
                    <span className="price">{item.price}원</span>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="price-section">
            <h4>평균 가격 추이</h4>
            {priceData && (
              <div className="chart-container">
                <Line
                  data={{
                    labels: priceData
                      .filter(item => item.countyname === "평균")
                      .slice(-5)
                      .map(item => {
                        const date = new Date(item.regday);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }),
                    datasets: [
                      {
                        label: '평균 가격',
                        data: priceData
                          .filter(item => item.countyname === "평균")
                          .slice(-5)
                          .map(item => parseInt(item.price.replace(/,/g, ''))),
                        borderColor: 'rgb(75, 192, 192)',
                        segment: {
                          borderColor: ctx => {
                            const prev = ctx.p0.parsed.y;
                            const current = ctx.p1.parsed.y;
                            return prev > current ? 'rgb(59, 130, 246)' : // 파란색 (가격 하락)
                                   prev < current ? 'rgb(239, 68, 68)' : // 빨간색 (가격 상승)
                                   'rgb(75, 192, 192)'; // 기본색 (변동 없음)
                          }
                        },
                        tension: 0.1,
                        fill: false,
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const value = context.parsed.y;
                            const prev = context.dataset.data[context.dataIndex - 1];
                            const diff = prev ? value - prev : 0;
                            const sign = diff > 0 ? '▲' : diff < 0 ? '▼' : '';
                            return `${value.toLocaleString()}원 ${sign}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        ticks: {
                          callback: function(value) {
                            return value.toLocaleString() + '원';
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

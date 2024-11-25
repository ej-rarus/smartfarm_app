import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TodaysPriceInfo() {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        const startDate = new Date(today.setMonth(today.getMonth() - 1))
                          .toISOString().split('T')[0];

        const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
        const API_URL = 'http://www.kamis.or.kr/service/price/xml.do';
        
        const response = await axios.get(`${PROXY_URL}${API_URL}`, {
          params: {
            action: 'periodProductList',
            p_productclscode: '02',
            p_startday: startDate,
            p_endday: endDate,
            p_itemcategorycode: '200',
            p_itemcode: '225',
            p_kindcode: '00',
            p_productrankcode: '04',
            p_countrycode: '1101',
            p_convert_kg_yn: 'Y',
            p_cert_key: process.env.REACT_APP_KAMIS_CERT_KEY,
            p_cert_id: process.env.REACT_APP_KAMIS_API_ID,
            p_returntype: 'json'
          }
        });

        if (response.data.data?.error_code === '000') {
          setPriceData(response.data.data.item);
        } else {
          setError('데이터를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('가격 정보 조회 오류:', err);
        setError('가격 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, []);

  if (loading) return (
    <div className="price-loading">
      가격 정보를 불러오는 중...
    </div>
  );

  if (error) return (
    <div className="price-error">
      {error}
      <button onClick={() => window.location.reload()}>
        다시 시도
      </button>
    </div>
  );

  if (!priceData || priceData.length === 0) {
    return <div className="no-price">가격 정보가 없습니다.</div>;
  }

  // 평균 가격과 실제 가격 데이터 분리
  const averagePrices = priceData.filter(item => item.countyname === "평균");
  const actualPrices = priceData.filter(item => 
    item.countyname !== "평균" && item.countyname !== "평년"
  );

  return (
    <div className="price-container">
      <h3>토마토 가격 정보</h3>
      <div className="price-list">
        <div className="price-section">
          <h4>최근 거래 가격</h4>
          {actualPrices.slice(-5).map((item, index) => (
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
          {averagePrices.slice(-5).map((item, index) => (
            <div key={index} className="price-item average">
              <div className="price-header">
                <span className="date">{item.yyyy}/{item.regday}</span>
              </div>
              <div className="price-details">
                <span className="price">{item.price}원</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

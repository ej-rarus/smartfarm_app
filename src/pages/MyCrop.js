import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from '../utils/auth';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";

function MyCrop() {
  const [crops, setCrops] = useState([]);
  const [allCrops, setAllCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 5;

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate('/login', { state: { from: { pathname: '/mycrop' } } });
//       return;
//     }

//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_VERSION}/crops`);
//         const sortedCrops = response.data.sort((a, b) => new Date(b.plant_date) - new Date(a.plant_date));
//         setAllCrops(sortedCrops);
//         const initialCrops = sortedCrops.slice(0, ITEMS_PER_PAGE);
//         setCrops(initialCrops);
//         setHasMore(sortedCrops.length > ITEMS_PER_PAGE);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, [navigate]);

  useEffect(() => {
    if (page === 1) return;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = page * ITEMS_PER_PAGE;
    const newCrops = allCrops.slice(startIndex, endIndex);
    setCrops(prev => [...prev, ...newCrops]);
    setHasMore(endIndex < allCrops.length);
  }, [page, allCrops]);

  const lastCropElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">내 작물 관리</h1>
      <hr style={{
        border: "none",
        height: "2px",
        backgroundColor: "gray",
        width: "13rem",
        marginTop: "0.5rem",
      }}/>
      <p className="page-content">작물 정보를 등록하고 관리하세요.</p>

      <div className="crop-list-container">
        <button
          className="std-btn"
          onClick={() => navigate("/mycrop/new")}
        >
          작물 등록
        </button>

        {crops.map((crop, index) => {
          const plantDate = new Date(crop.plant_date).toLocaleDateString("ko-KR");
          const harvestDate = crop.harvest_date ? new Date(crop.harvest_date).toLocaleDateString("ko-KR") : "수확 예정";
          
          return (
            <div 
              ref={crops.length === index + 1 ? lastCropElementRef : null}
              className="crop-card" 
              key={crop.crop_id} 
              onClick={() => navigate(`/mycrop/${crop.crop_id}`)}
            >
              <div className="crop-icon">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
              <div className="crop-info">
                <div className="crop-name">{crop.crop_name}</div>
                <div className="crop-variety">{crop.variety}</div>
                <div className="crop-status">{crop.status}</div>
                <div className="crop-dates">
                  <span>심은 날: {plantDate}</span>
                  <span>수확 예정: {harvestDate}</span>
                </div>
              </div>
            </div>
          );
        })}
        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
}

export default MyCrop; 
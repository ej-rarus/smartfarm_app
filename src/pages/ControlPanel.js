import '../App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsiveContainer ,XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

function ControlPanel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const data2 = [{
    name: 'Page A',
    uv: 40,
    pv: 24,
    amt: 24,
  },
  {
    name: 'Page B',
    uv: 30,
    pv: 13,
    amt: 22,
  },
  {
    name: 'Page C',
    uv: 20,
    pv: 98,
    amt: 22,
  },
  {
    name: 'Page D',
    uv: 27,
    pv: 39,
    amt: 20,
  },
  {
    name: 'Page E',
    uv: 18,
    pv: 48,
    amt: 21,
  },
  {
    name: 'Page F',
    uv: 23,
    pv: 38,
    amt: 25,
  },
  {
    name: 'Page G',
    uv: 34,
    pv: 43,
    amt: 21,
  },];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.39.126.121:3000/users');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">제어패널</h1>
      <hr
        style={{
          border: 'none',
          height: '2px',
          backgroundColor: 'gray',
          width: '13rem',
          marginTop: '0.5rem',
        }}
      />
        {/* 여기에 차트를 추가해줘야 합니다 */}
        <ResponsiveContainer width="90%" height={300}>
            <LineChart data={data2}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis/>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
}

export default ControlPanel;

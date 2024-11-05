import RealTimeChart from '../components/RealTimeChart';

import "../App.css";


function Dashboard () {
    return (
            <div className='page-container'>
                <h1 className='page-title'>Dashboard</h1>
                <hr style={{border: 'none', height: '2px', backgroundColor: 'gray', width:'13rem', marginTop:"0.5rem"}}/>
                <RealTimeChart/>
            </div>
    );
}

export default Dashboard;


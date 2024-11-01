import RealTimeChart from '../components/RealTimeChart';



function Dashboard () {
    return (
        <div>
            <div className='content-wrap'>
                <h1 className='page-title'>Dashboard</h1>
                <hr style={{border: 'none', height: '2px', backgroundColor: 'gray', width:'13rem', marginTop:"0.5rem"}}/>
                <RealTimeChart/>
            </div>
        </div>
    );
}

export default Dashboard;


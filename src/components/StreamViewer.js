export default function StreamViewer() {
    return (
        <div>
            <h1>Camera Stream</h1>
            <img
                src="http://localhost:3000/stream"
                alt="Camera Stream"
                style={{ width: '100%', height: 'auto' }}
            />
        </div>
    );
}

import JobRegistry from "./screens/JobRegistry";

function App() {
    return (
        <div>
            <h1 style={{ fontSize: "28px", margin: "16px 0 16px 16px", fontWeight: 600, color: "#333" }}>
                Job Registry
            </h1>
            <JobRegistry />
        </div>
    );
}

export default App;

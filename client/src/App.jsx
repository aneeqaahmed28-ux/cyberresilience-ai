import { useEffect, useState } from "react";
import AssessmentForm from "./components/AssessmentForm";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch(`${API_BASE}/api/health`)
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.message))
      .catch(() => setBackendStatus("Backend not reachable ❌"));
  }, []);

  return (
    <div className="container">
      <h1>CyberResilience AI</h1>
      <p className="status">{backendStatus}</p>
      <AssessmentForm />
    </div>
  );
}

export default App;

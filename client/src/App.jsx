import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://localhost:5001/api/health")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Backend not reachable ❌"));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>CyberResilience AI</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;

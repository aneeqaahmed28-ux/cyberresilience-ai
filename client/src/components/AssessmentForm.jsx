import { useState } from "react";
import { questions, sectors, sizes } from "../data/questions";

const API_URL = "http://localhost:5001/api/assess";

function AssessmentForm() {
  const [organisation, setOrganisation] = useState({
    name: "",
    sector: sectors[0],
    size: sizes[0],
  });
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleOrgChange = (e) => {
    setOrganisation({ ...organisation, [e.target.name]: e.target.value });
  };

  const handleAnswerChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const allAnswered = questions.every((q) => answers[q.id]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organisation,
          answers: questions.map((q) => ({
            question: q.label,
            answer: answers[q.id],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("The server returned an error.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>About your organisation</h2>

      <label>
        Organisation name
        <input
          name="name"
          value={organisation.name}
          onChange={handleOrgChange}
          placeholder="e.g. Greenfield Dental Practice"
        />
      </label>

      <label>
        Sector
        <select
          name="sector"
          value={organisation.sector}
          onChange={handleOrgChange}
        >
          {sectors.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      <label>
        Size
        <select
          name="size"
          value={organisation.size}
          onChange={handleOrgChange}
        >
          {sizes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      <h2>Resilience questions</h2>

      {questions.map((q) => (
        <label key={q.id}>
          {q.label}
          <select
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          >
            <option value="" disabled>
              Choose an answer...
            </option>
            {q.options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </label>
      ))}

      <button onClick={handleSubmit} disabled={!allAnswered || loading}>
        {loading ? "Analysing..." : "Analyse My Resilience"}
      </button>

      {!allAnswered && (
        <p className="hint">Answer all questions to enable the button.</p>
      )}

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h2>Response from backend</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default AssessmentForm;

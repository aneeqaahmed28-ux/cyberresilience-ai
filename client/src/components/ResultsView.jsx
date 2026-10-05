function ResultsView({ result, organisationName, onReset }) {
  const riskLevel = result.riskLevel || "Unknown";
  const score = result.score;
  const strengths = result.strengths || [];
  const gaps = result.gaps || [];
  const actionPlan = [...(result.actionPlan || [])].sort(
    (a, b) => a.priority - b.priority,
  );

  return (
    <div className="results">
      <div className={`risk-banner risk-${riskLevel.toLowerCase()}`}>
        <div>
          <p className="risk-label">
            Resilience risk{organisationName ? ` for ${organisationName}` : ""}
          </p>
          <h2>{riskLevel}</h2>
        </div>
        {score && (
          <p className="risk-score">
            Risk score {score.total} / {score.max}
          </p>
        )}
      </div>

      <div className="card">
        <h3>Summary</h3>
        <p>{result.summary}</p>
      </div>

      <div className="card">
        <h3>What you're doing well</h3>
        {strengths.length === 0 ? (
          <p>No clear strengths identified from these answers.</p>
        ) : (
          <ul className="strengths">
            {strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
      </div>

      <h3>Gaps to close ({gaps.length})</h3>
      {gaps.length === 0 && <p>No gaps identified.</p>}
      {gaps.map((gap) => (
        <div className="card" key={gap.area}>
          <h3>
            {gap.area}
            <span
              className={`badge badge-${String(gap.severity).toLowerCase()}`}
            >
              {gap.severity}
            </span>
          </h3>
          <p>
            <strong>Why it matters:</strong> {gap.whyItMatters}
          </p>
          <p>
            <strong>Recommendation:</strong> {gap.recommendation}
          </p>
        </div>
      ))}

      <h3>Action plan</h3>
      <ol className="plan">
        {actionPlan.map((step) => (
          <li key={`${step.priority}-${step.action}`}>
            <span className="timeframe">{step.timeframe}</span>
            <br />
            {step.action}
          </li>
        ))}
      </ol>

      <div className="actions">
        <button onClick={onReset}>Edit answers</button>
        <button className="btn-secondary" onClick={() => window.print()}>
          Print / save as PDF
        </button>
      </div>

      <p className="disclaimer">
        This is AI-generated guidance based only on the answers you gave. It is
        not a security audit or a compliance certification.
      </p>
    </div>
  );
}

export default ResultsView;

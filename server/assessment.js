const SYSTEM_PROMPT = `You are a cyber resilience advisor for small and medium organisations in the UK.
You receive an organisation profile and its answers to a short questionnaire.

Rules:
- Base your analysis ONLY on the answers given. Do not invent facts about the organisation.
- Be practical and specific. Avoid jargon, or explain it briefly.
- Do not claim the organisation is compliant or certified with any standard.
- Respond with ONLY valid JSON. No markdown, no code fences, no text before or after.

Use exactly this JSON shape:
{
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "summary": "2-3 sentence overview",
  "strengths": ["short strength", "..."],
  "gaps": [
    {
      "area": "e.g. Backups",
      "severity": "Low" | "Medium" | "High",
      "whyItMatters": "plain-English explanation",
      "recommendation": "specific action"
    }
  ],
  "actionPlan": [
    {
      "priority": 1,
      "timeframe": "This week" | "This month" | "Next 3 months",
      "action": "specific action"
    }
  ]
}`;

export function buildMessages(organisation, answers) {
  const answerLines = answers
    .map((a, i) => `${i + 1}. ${a.question}\n   Answer: ${a.answer}`)
    .join("\n");

  const userPrompt = `Organisation: ${organisation.name || "Unnamed"}
Sector: ${organisation.sector}
Size: ${organisation.size}

Questionnaire answers:
${answerLines}

Produce the JSON assessment.`;

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];
}

export function parseModelJson(text) {
  const cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/```json|```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON found in model response");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

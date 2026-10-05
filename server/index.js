import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askModel } from "./aiClient.js";
import {
  buildMessages,
  parseModelJson,
  scoreAssessment,
} from "./assessment.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend connected ✅" });
});

app.post("/api/assess", async (req, res) => {
  const { organisation, answers } = req.body;

  const valid =
    organisation &&
    Array.isArray(answers) &&
    answers.length > 0 &&
    answers.every(
      (a) =>
        a.question &&
        a.answer &&
        Number.isInteger(a.score) &&
        a.score >= 0 &&
        a.score <= 3,
    );

  if (!valid) {
    return res
      .status(400)
      .json({ error: "Missing or invalid organisation or answers." });
  }

  const overall = scoreAssessment(answers);

  try {
    const raw = await askModel(buildMessages(organisation, answers, overall), {
      maxTokens: 6000,
    });

    try {
      const assessment = parseModelJson(raw);
      assessment.riskLevel = overall.riskLevel;
      assessment.score = { total: overall.total, max: overall.max };
      return res.json(assessment);
    } catch (parseErr) {
      console.error("Could not parse model output:\n", raw);
      return res
        .status(502)
        .json({
          error: "The AI returned an unexpected format. Please try again.",
        });
    }
  } catch (err) {
    console.error(err.message);
    return res
      .status(502)
      .json({ error: "AI service error. Please try again." });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

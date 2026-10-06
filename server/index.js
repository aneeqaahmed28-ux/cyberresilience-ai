import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { askModel } from "./aiClient.js";
import {
  buildMessages,
  parseModelJson,
  scoreAssessment,
} from "./assessment.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "20kb" }));

// Limit each visitor to 20 assessments per hour
const assessLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

// Overall daily cap across all visitors, to protect the credit balance
const DAILY_LIMIT = Number(process.env.DAILY_LIMIT) || 200;
let dailyCount = 0;
let dayStamp = new Date().toDateString();

function underDailyCap() {
  const today = new Date().toDateString();
  if (today !== dayStamp) {
    dayStamp = today;
    dailyCount = 0;
  }
  return dailyCount < DAILY_LIMIT;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend connected ✅" });
});

app.post("/api/assess", assessLimiter, async (req, res) => {
  const { organisation, answers } = req.body;

  const valid =
    organisation &&
    typeof organisation === "object" &&
    Array.isArray(answers) &&
    answers.length > 0 &&
    answers.length <= 20 &&
    answers.every(
      (a) =>
        typeof a.question === "string" &&
        typeof a.answer === "string" &&
        a.question.length <= 200 &&
        a.answer.length <= 200 &&
        Number.isInteger(a.score) &&
        a.score >= 0 &&
        a.score <= 3,
    );

  if (!valid) {
    return res
      .status(400)
      .json({ error: "Missing or invalid organisation or answers." });
  }

  if (!underDailyCap()) {
    return res
      .status(503)
      .json({
        error:
          "The demo has reached its daily limit. Please try again tomorrow.",
      });
  }

  const cleanOrg = {
    name: String(organisation.name || "").slice(0, 100),
    sector: String(organisation.sector || "").slice(0, 60),
    size: String(organisation.size || "").slice(0, 60),
  };

  const overall = scoreAssessment(answers);
  dailyCount += 1;

  try {
    const raw = await askModel(buildMessages(cleanOrg, answers, overall), {
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

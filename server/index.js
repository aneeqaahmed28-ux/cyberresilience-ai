import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askModel } from "./aiClient.js";
import { buildMessages, parseModelJson } from "./assessment.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend connected ✅" });
});

app.post("/api/assess", async (req, res) => {
  const { organisation, answers } = req.body;

  if (!organisation || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Missing organisation or answers." });
  }

  try {
    const raw = await askModel(buildMessages(organisation, answers), {
      maxTokens: 6000,
    });

    try {
      const assessment = parseModelJson(raw);
      return res.json(assessment);
    } catch (parseErr) {
      console.error("Could not parse model output:\n", raw);
      return res.status(502).json({
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

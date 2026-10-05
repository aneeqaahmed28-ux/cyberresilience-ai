import dotenv from "dotenv";
dotenv.config();

const base = process.env.NEBIUS_BASE_URL.replace(/\/+$/, "");

const body = {
  model: process.env.NEBIUS_MODEL,
  messages: [
    { role: "user", content: "In one sentence, what is cyber resilience?" },
  ],
  max_tokens: 3000,
};

if (process.env.NEBIUS_DISABLE_THINKING === "true") {
  body.chat_template_kwargs = { enable_thinking: false };
}

const start = Date.now();
const res = await fetch(`${base}/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEBIUS_API_KEY}`,
  },
  body: JSON.stringify(body),
});

const data = await res.json();
const choice = data.choices?.[0];

console.log("Status:", res.status);
console.log("Seconds:", ((Date.now() - start) / 1000).toFixed(1));
console.log("Finish reason:", choice?.finish_reason);
console.log("Usage:", JSON.stringify(data.usage));
console.log("Has reasoning field:", Boolean(choice?.message?.reasoning));
console.log("ANSWER:", choice?.message?.content);
if (res.status !== 200) console.log(JSON.stringify(data, null, 2));

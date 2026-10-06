import dotenv from "dotenv";
dotenv.config();

export async function askModel(
  messages,
  { maxTokens = 6000, temperature = 0.2 } = {},
) {
  const base = process.env.NEBIUS_BASE_URL.replace(/\/+$/, "");

  const body = {
    model: process.env.NEBIUS_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  };

  if (process.env.NEBIUS_DISABLE_THINKING === "true") {
    body.chat_template_kwargs = { enable_thinking: false };
  }

  const startTime = Date.now();
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEBIUS_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Nebius error ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];
  console.log(
    "finish_reason:",
    choice?.finish_reason,
    "| seconds:",
    ((Date.now() - startTime) / 1000).toFixed(1),
    "| usage:",
    JSON.stringify(data.usage),
  );

  const content = choice?.message?.content;
  if (!content) {
    throw new Error(
      `Empty answer (finish_reason: ${choice?.finish_reason}). The token limit was probably used up by reasoning. Increase maxTokens.`,
    );
  }

  return content;
}

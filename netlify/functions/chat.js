// netlify/functions/chat.js
// Simple proxy to OpenAI Chat Completions to keep your API key secret
export const config = { path: "/api/chat" };

export default async (req) => {
  try {
    const { message } = await req.json();
    if (!message) return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are BoostHomes AI, a sharp South Florida real estate assistant. Be concise, factual, and helpful." },
          { role: "user", content: message }
        ],
        temperature: 0.4
      })
    });
    if (!r.ok) {
      const errText = await r.text();
      throw new Error(`OpenAI error ${r.status}: ${errText}`);
    }
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "...";

    return new Response(JSON.stringify({ reply }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

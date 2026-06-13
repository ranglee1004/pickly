export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const data = await response.json();
  res.status(200).json(data); // 임시: 전체 응답 확인용
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    }),
  });

  // const data = await response.json();
  // const text = data.choices?.[0]?.message?.content || "응답 없음";
  // res.status(200).json({ text });
  const data = await response.json();
  res.status(200).json(data); // 임시: 전체 응답 확인용
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const { prompt } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(200).json({ error: { message: 'GEMINI_API_KEY가 설정되지 않았습니다.' } });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // Gemini API가 에러를 반환한 경우 그대로 전달
    if (data.error) {
      return res.status(200).json({ error: data.error });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      return res.status(200).json({ error: { message: 'Gemini가 빈 응답을 반환했습니다.', raw: data } });
    }

    res.status(200).json({ text });
  } catch (e) {
    res.status(200).json({ error: { message: e.message || '서버 에러가 발생했습니다.' } });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const { prompt } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(200).json({ error: { message: 'OPENAI_API_KEY가 설정되지 않았습니다.' } });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ error: data.error });
    }

    const text = data.choices?.[0]?.message?.content || '';
    if (!text) {
      return res.status(200).json({ error: { message: 'GPT가 빈 응답을 반환했습니다.', raw: data } });
    }

    res.status(200).json({ text });
  } catch (e) {
    res.status(200).json({ error: { message: e.message || '서버 에러가 발생했습니다.' } });
  }
}

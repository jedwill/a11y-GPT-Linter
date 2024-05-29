const axios = require('axios');

async function fetchFeedback(prompt) {
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
          { role: "system", content: "You are an assistant that provides explanations and code examples for fixing accessibility issues." },
          { role: "user", content: prompt }
      ],
      max_tokens: 500
  }, {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
  });
  return response.data.choices[0].message.content.trim();
}

module.exports = { fetchFeedback };

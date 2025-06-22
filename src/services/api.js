const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export const remixContent = async (text, remixType = 'general') => {
  if (!API_KEY || API_KEY === 'your_claude_api_key_here') {
    throw new Error('Claude API key not configured. Please add your API key to .env file.');
  }

  const prompts = {
    general: `Please remix the following text in a creative and engaging way while maintaining the core message. Make it more interesting, varied, and appealing to read:

${text}`,
    
    professional: `Please rewrite the following text in a more professional and polished tone while maintaining the key information:

${text}`,
    
    casual: `Please rewrite the following text in a more casual, friendly, and conversational tone:

${text}`,
    
    creative: `Please transform the following text into a more creative and imaginative version while keeping the main idea:

${text}`
  };

  const prompt = prompts[remixType] || prompts.general;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to remix content. Please check your API key and try again.');
  }
}; 
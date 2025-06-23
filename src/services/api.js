import Anthropic from '@anthropic-ai/sdk';

// Configure the SDK to talk to our proxy server
const anthropic = new Anthropic({
  // This is a dummy key because the proxy will add the real one.
  // The SDK requires a key to be present, but it won't be used.
  apiKey: 'placeholder', 
  
  // This is required to run the SDK in a browser environment
  dangerouslyAllowBrowser: true,

  // Point the SDK to our proxy endpoint using a full URL
  baseURL: `${window.location.origin}/api`,
});

export const remixContent = async (text, remixType = 'general') => {
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
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    
    return response.content[0].text;

  } catch (error) {
    console.error('API Error in remixContent:', error);
    if (error instanceof Anthropic.APIError) {
      // The SDK provides a structured error object
      throw new Error(`API Error: ${error.status} ${error.name} - ${error.message}`);
    }
    // Re-throw other types of errors
    throw error;
  }
}; 
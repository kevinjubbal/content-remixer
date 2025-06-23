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

export const tweetsFromPost = async (text, remixType = 'general') => {
  const prompts = {
    general: `You are a social media expert and ghostwriter. 
    
    You work for a popular blogger, and your job is to take their blog post and come up with a variety of tweets to share ideas from that post. 
    
    Since you are a ghostwriter, you need to make sure you follow the style, tone, and voice of the blog post as closely and precisely as possible. 
    
    Remember, tweets cannot be longer than 280 characters.
    
    Please return each tweet separated by "---TWEET---" on its own line. Be sure to include at least five tweets. Do not use any hashtags or emojis. 
    
    Format your response exactly like this:
    ---TWEET---
    First tweet content here
    ---TWEET---
    Second tweet content here
    ---TWEET---
    Third tweet content here
    
    Here is the blog post:

${text}`,
    
    professional: `You are a social media strategist writing for an industry-leading expert.
    
    Your job is to distill the key insights of their blog post into professional, polished tweets that reflect credibility, expertise, and thought leadership.
    
    Maintain a formal, authoritative tone. Focus on clarity, value, and professionalism. Avoid slang, contractions, humor, or emojis.
    
    Tweets must be under 280 characters. Return at least five tweets.
    
    Please return each tweet separated by "---TWEET---" on its own line.
    
    Format your response exactly like this:
    ---TWEET---
    First tweet content here
    ---TWEET---
    Second tweet content here
    ---TWEET---
    Third tweet content here
    
    Here is the blog post:

${text}`,
    
    casual: `You are a friendly, relatable ghostwriter helping a blogger connect with a casual audience on Twitter.\
    
    Your job is to turn this blog post into relaxed, conversational tweets that sound like a smart friend sharing ideas. You can use light humor, rhetorical questions, and contractions.
    
    Keep it easygoing and informal, but still clear and insightful. Avoid hashtags or emojis.
    
    Tweets must be under 280 characters. Return at least five tweets.
    
    Please return each tweet separated by "---TWEET---" on its own line.
    
    Format your response exactly like this:
    ---TWEET---
    First tweet content here
    ---TWEET---
    Second tweet content here
    ---TWEET---
    Third tweet content here
    
    Here is the blog post:

${text}`,
    
    creative: `You are a creative ghostwriter with a flair for writing bold, attention-grabbing tweets for a blogger with a unique voice.
    
    Your job is to remix the blog post into memorable, witty, or unconventional tweets. Feel free to use wordplay, punchy lines, lists, metaphors, or unexpected phrasing—as long as it stays true to the blog's message.
    
    Avoid emojis or hashtags. Be surprising, expressive, and clever. Maintain a tweet length under 280 characters.
    
    Return at least five tweets.
    
    Please return each tweet separated by "---TWEET---" on its own line.
    
    Format your response exactly like this:
    ---TWEET---
    First tweet content here
    ---TWEET---
    Second tweet content here
    ---TWEET---
    Third tweet content here
    
    Here is the blog post:

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
    
    const rawText = response.content[0].text;
    const tweets = parseTweets(rawText);
    
    return {
      rawText,
      tweets
    };

  } catch (error) {
    console.error('API Error in tweetsFromPost:', error);
    if (error instanceof Anthropic.APIError) {
      // The SDK provides a structured error object
      throw new Error(`API Error: ${error.status} ${error.name} - ${error.message}`);
    }
    // Re-throw other types of errors
    throw error;
  }
};

// Helper function to parse tweets from the structured response
const parseTweets = (text) => {
  if (!text) return [];
  
  // Split by the tweet separator and filter out empty entries
  const tweets = text
    .split('---TWEET---')
    .map(tweet => tweet.trim())
    .filter(tweet => tweet.length > 0)
    // Remove any leading numbers or bullet points that might be present
    .map(tweet => tweet.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, ''));
  
  return tweets;
}; 
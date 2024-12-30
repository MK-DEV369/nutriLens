const GEMINI_API_URL = import.meta.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function generateNutritionalInsights(apiKey: string, foodItem: string): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is required');
  }
  const prompt = `
    You are a health safety assistant specializing in providing concise and practical health insights about food.  
    When given a food item: "${foodItem}", respond with:  
    1. Basic nutritional information.  
    2. Any health concerns related to sugar, salt, fat, or other factors.  
    3. Suggestions for healthier alternatives (if applicable).  
    4. Portion control tips.  
    5. How it fits into a balanced diet.
    Keep the tone friendly and informative. Focus on actionable advice and avoid unnecessary details.
    
`;


  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}
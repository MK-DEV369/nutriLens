const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const apiKey = "AIzaSyCf1pGcxOstXnvdjY2TLsN3rOj_zxNsUXg"

//       const response = await generateNutritionalInsights(rating, dict);
export async function generateNutritionalInsights(rating: string, dict: string): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const prompt2 = `
  You are a health and nutrition assistant for the Nutrilens project. Your job is to evaluate food labels scanned by users and provide tailored dietary recommendations based on their health profile.

  ### User Profile:
  - **Age**: 19  
  - **Gender**: Male  
  - **Height**: 178 cm  
  - **Weight**: 75 kg  
  - **Health Conditions**:  
    - Diabetes: Needs low sugar and carbohydrates.  
    - Obesity: Requires low calories and saturated fat.  
    - Low Blood Pressure: Benefits from high sodium intake.  
    - High Blood Pressure: Requires low sodium intake.  

  ### Task:
  Based on the scanned food label, provide the following:
  1. **Evaluation**: Assess how the food aligns or conflicts with the user's dietary needs.  
  2. **Recommendations**: Offer clear, actionable advice on whether the user should consume the product.  
  3. **Alternatives**: Suggest healthier alternatives if the product is unsuitable.  

  ### Example Context:
  - **Food Safety Rating**: ${rating}  
  - **Nutritional Information**: ${JSON.stringify(dict)}

  #### Sample Analyses:
  1. **Food item name**:  
      **Food Safety Rating**: 4
     - Sugar: 20g 
     - Sodium: 150mg   
     - Calories: 250 
     **Response**:  
     "This product contains 20g of sugar, which is unsuitable for diabetes management. Its 250 calories per serving may also hinder weight loss goals. Consider snacks with lower sugar and calorie content. Would you like alternative suggestions?"

  2. **Food item name**:  
      **Food Safety Rating**: 4 
     - Fat: 10g  
     - Sodium: 400mg
     **Response**:  
     "This item contains 10g of saturated fat, which can negatively affect blood pressure. Additionally, its 400mg of sodium may conflict with both high and low blood pressure needs. Opt for foods with less saturated fat and sodium."

  3.**Food item name**:  
      **Food Safety Rating**: 4  
     - Sugar: 2g 
     - Calcium: 200mg
     **Response**:  
     "This product is low in sugar, making it suitable for diabetes management. The 200mg of calcium supports overall health, making this a good choice for your diet."

  ### Guidelines:
  - **Use Simple Language**: Make responses clear and easy to understand.  
  - **Provide Insights**: Clearly explain why the food is suitable or not based on the user's health needs.  
  - **Actionable Advice**: Suggest practical alternatives when needed.  
  - **Neutral Recommendations**: Avoid medical advice. Encourage consulting a healthcare professional for specific concerns.  

  ### Expected Output:
  Respond in the following JSON format:
  {
    "Evaluation": "Your analysis of the food's suitability based on the profile.",
    "Recommendations": "Clear, actionable advice for the user.",
    "Alternatives": ["Alternative Food Item 1", "Alternative Food Item 2"]
  }
  `;

  

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt2,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const responseText = await response.text(); // Read response as text first
    console.log('Raw API Response:', responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Response is not valid JSON. Returning raw text.');
      return responseText; // Return raw text if JSON parsing fails
    }

    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error('Unexpected response structure from API.');
    }

    console.log('Parsed Response:', data.candidates[0].content.parts[0].text);
    const parsedData = JSON.parse(data.candidates[0].content.parts[0].text);
    const formattedResponse = `
    𝑬𝒗𝒂𝒍𝒖𝒂𝒕𝒊𝒐𝒏: ${parsedData.Evaluation}\n
    𝑹𝒆𝒄𝒐𝒎𝒎𝒆𝒏𝒅𝒂𝒕𝒊𝒐𝒏𝒔: ${parsedData.Recommendations}\n
    𝑨𝒍𝒕𝒆𝒓𝒏𝒂𝒕𝒊𝒗𝒆𝒔: ${parsedData.Alternatives.join(', ')}
    `;
    return formattedResponse;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

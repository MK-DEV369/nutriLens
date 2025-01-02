const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const apiKey = "AIzaSyCf1pGcxOstXnvdjY2TLsN3rOj_zxNsUXg"

export async function fetchUserProfile(userId: string): Promise<any> {
  try {
    const response = await fetch(`http://localhost:5001/user-profile/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

//       const response = await generateNutritionalInsights(rating, dict);
export async function generateNutritionalInsights(rating: string, dict: string, userId: string): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is required');
  }
  const userProfile = await fetchUserProfile(userId);
  const prompt2 = `
  You are a health and nutrition assistant for the Nutrilens project. 🍎 Your role is to evaluate scanned food labels and provide tailored dietary recommendations based on user health profiles.

👤 User Profile:
Age: ${userProfile.age || "Unknown"} Years

Gender: ${userProfile.gender || "Unknown"} ♂️

Height: ${userProfile.height || "Unknown"} cm 📏

Weight: ${userProfile.weight || "Unknown"} kg ⚖️

Health Conditions: ${userProfile.specialNeeds?.join(", ") || "None"}

if Diabetes: Requires low sugar and carbohydrates. 📉🍬

if Obesity: Requires low calories and saturated fat. 📉🍔

if Blood Pressure:

Needs consideration for both high and low blood pressure (this user has both conflicting conditions). 🌡️

🎯 Task:
Based on the scanned food label, provide a helpful analysis with:

Evaluation: 🧐 Assess how the food aligns or conflicts with the user's specific dietary needs. Be clear about why it's good or bad for this user.

Recommendations: 👍 Offer clear, actionable advice on whether the user should consume the product. Focus on what they should do.

Alternatives: 💡 Suggest healthier alternatives if the product isn't suitable. Provide a variety.

📝 Example Context:
Food Safety Rating: ${rating} ⚠️(This is just information to be displayed; do not use this to make decision)

Nutritional Information: ${JSON.stringify(dict)} 📊 (The JSON object containing nutritional information)

🔎 Sample Analyses:
Food item name:
Food Safety Rating: 4

Sugar: 20g

Sodium: 150mg

Calories: 250
Response:
"This product contains 20g of sugar 🍬, which is not suitable for managing diabetes. 📉 Its 250 calories may also hinder weight loss goals. 😟 Consider snacks with lower sugar and calorie content. Would you like alternative suggestions?"

Food item name:
Food Safety Rating: 4

Fat: 10g

Sodium: 400mg
Response:
"This item contains 10g of saturated fat 🥓, which can negatively affect blood pressure. 🩺 Additionally, its 400mg of sodium 🧂 may conflict with your complex needs regarding both high and low blood pressure. 🚨 Opt for foods with less saturated fat and sodium."

Food item name:
Food Safety Rating: 4

Sugar: 2g

Calcium: 200mg
Response:
"This product is low in sugar, 🍭 making it suitable for diabetes management. ✅ The 200mg of calcium 🦴 supports overall health, making this a good choice for your diet."

🧭 Guidelines:
Simple Language: Use clear and easy-to-understand language. 🗣️

Specific Insights: Explain clearly why a food is good or bad based on the user's specific needs. 🤔

Emoji usage : Use emojis in response as much as possible

Short and Simple : Keep it short and simple 


Actionable Advice: Suggest practical alternatives and advice on what the user should do. ➡️

Neutral Approach: Avoid medical advice. Encourage consulting a healthcare professional for specific concerns. 👨‍⚕️👩‍⚕️

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

    try {
      const data = JSON.parse(responseText);
      console.log('Parsed Response:', data);
      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error('Unexpected response structure from API');
      }
      const content = data.candidates[0].content.parts[0].text;
      console.log('API Content:', content);

      // Attempt to parse the content as JSON
      try {
        const parsedContent = JSON.parse(content);
        console.log('Parsed Content:', parsedContent);

        const formattedResponse = `\
          𝑬𝒗𝒂𝒍𝒖𝒂𝒕𝒊𝒐𝒏: ${parsedContent.Evaluation || 'N/A'}\n\
          𝑹𝒆𝒄𝒐𝒎𝒎𝒆𝒏𝒅𝒂𝒕𝒊𝒐𝒏𝒔: ${parsedContent.Recommendations || 'N/A'}\n\
          𝑨𝒍𝒕𝒆𝒓𝒏𝒂𝒕𝒊𝒗𝒆𝒔: ${parsedContent.Alternatives?.join(', ') || 'N/A'}`;

        return formattedResponse;
      } catch (contentParseError) {
        console.error('Error parsing API content:', contentParseError);
        return `Error parsing API response. Please check the API output.`;
      }
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      return `Failed to parse API response. Please check the API output.`;
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return `Error calling Gemini API: ${error}`;
  }
}

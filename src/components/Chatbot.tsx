import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Initial chat history with both parts
const initialHistory = [
  {
    role: "user",
    parts: [{
      text: `You are a health and nutrition assistant for the Nutrilens project. You analyze food labels scanned by the user and provide personalized dietary recommendations based on their health profile. The user is:  
- Age: 19  
- Gender: Male  
- Special Needs: Diabetes, Obesity, Low Blood Pressure, High Blood Pressure  
- Height: 178 cm  
- Weight: 75 kg  

When the user scans a food label, evaluate the nutritional data (e.g., sugar, sodium, calories, fat content) and give a response tailored to their health conditions. Provide clear guidance, avoid medical advice, and suggest healthier alternatives when necessary.

Example Context and Expected Outputs:  

1. Scanned Food Label:  
   - Sugar: 20g per serving  
   - Sodium: 150mg per serving  
   - Calories: 250 per serving  

   Response:  
   "This product contains 20g of sugar per serving, which is not ideal given your diabetes management plan. Additionally, with 250 calories per serving, it might not align with weight management goals. For a healthier option, look for snacks with lower sugar content and fewer calories. Let me know if you'd like me to suggest alternatives!"  

2. Scanned Food Label:  
   - Fat: 10g saturated fat per serving  
   - Sodium: 400mg per serving  

   Response:  
   "This item contains 10g of saturated fat, which is high and not ideal for maintaining healthy blood pressure. It also has 400mg of sodium, which may impact both high and low blood pressure concerns. Consider choosing foods with unsaturated fats and reduced sodium levels for better health."  

3. Scanned Food Label:  
   - Sugar: 2g per serving  
   - Calcium: 200mg per serving  

   Response:  
   "This product is low in sugar, making it suitable for managing diabetes, and it provides 200mg of calcium, which supports overall health. This could be a good option to include in your diet!"  

General Guidelines:  
- Always explain why a food product is suitable or not based on the user's needs.  
- Use friendly, easy-to-understand language.  
- Provide actionable suggestions for healthier alternatives when needed.  
- Avoid medical advice and suggest consulting a healthcare professional for any specific health concerns.`
    }],
  },
  {
    role: "model",
    parts: [{
      text: "Okay, I understand! I'm ready to act as your Nutrilens health and nutrition assistant. I'll analyze food labels you scan and provide personalized recommendations based on your profile:\n\n*   Age: 19\n*   Gender: Male\n*   Special Needs: Diabetes, Obesity, Low Blood Pressure, High Blood Pressure\n*   Height: 178 cm\n*   Weight: 75 kg\n\nLet's get started! Please provide me with the nutritional information from the food label you have scanned. I'll analyze it and give you feedback. I'll be focusing on how the:\n\n*   Sugar: affects your diabetes and weight management goals.\n*   Sodium: affects both your low and high blood pressure.\n*   Calories and Fat: relate to your obesity management.\n\nI'll also look for good things like calcium, fiber, and protein, and point out if they are present. I'm here to help you make informed choices!"
    }],
  }
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your NutriLens assistant. How can I help you today? You can share food label information with me, and I'll analyze it based on your health profile.",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession] = useState(() => 
    model.startChat({
      generationConfig,
      history: initialHistory,
    })
  );

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage(input);
      const response = result.response;
      const botMessage: Message = {
        text: response.text(),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        text: "I'm sorry, I encountered an error. Please try again.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col max-h-[600px]">
          <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">NutriLens Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-emerald-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${message.isBot ? 'flex justify-start' : 'flex justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <p className="text-sm">Analyzing nutritional information...</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share food label information..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-colors transform hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
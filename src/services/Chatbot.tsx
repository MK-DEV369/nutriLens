import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Settings } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ConfigModal } from './ConfigModal';
import { generateNutritionalInsights } from '../services/gemini';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your NutriLens assistant. Tell me about any food item, and I'll provide nutritional insights, health considerations, and suggestions for healthier alternatives!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('geminiApiKey', newKey);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      setIsConfigOpen(true);
      return;
    }

    const userMessage: Message = {
      text: input.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateNutritionalInsights(apiKey, input);
      
      const botMessage: Message = {
        text: response,
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: error instanceof Error 
          ? `Error: ${error.message}` 
          : "Sorry, I couldn't process your request at the moment. Please try again.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col max-h-[600px]">
            {/* Header */}
            <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">NutriLens Assistant</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsConfigOpen(true)}
                  className="p-1 hover:bg-emerald-700 rounded-full transition-colors"
                  aria-label="Open settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-emerald-700 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
              {messages.map((message, index) => (
                <ChatMessage key={index} {...message} />
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a food item..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
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
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
      </div>

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </>
  );
} 
{/*const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "\n\"You are a health and nutrition assistant for the Nutrilens project. You analyze food labels scanned by the user and provide personalized dietary recommendations based on their health profile. The user is:  \n- Age: 19  \n- Gender: Male  \n- Special Needs: Diabetes, Obesity, Low Blood Pressure, High Blood Pressure  \n- Height: 178 cm  \n- Weight: 75 kg  \n\nWhen the user scans a food label, evaluate the nutritional data (e.g., sugar, sodium, calories, fat content) and give a response tailored to their health conditions. Provide clear guidance, avoid medical advice, and suggest healthier alternatives when necessary.\"  \n\n*Example Context and Expected Outputs:*  \n\n1. *Scanned Food Label:*  \n   - Sugar: 20g per serving  \n   - Sodium: 150mg per serving  \n   - Calories: 250 per serving  \n\n   *Response:*  \n   \"This product contains 20g of sugar per serving, which is not ideal given your diabetes management plan. Additionally, with 250 calories per serving, it might not align with weight management goals. For a healthier option, look for snacks with lower sugar content and fewer calories. Let me know if you’d like me to suggest alternatives!\"  \n\n2. *Scanned Food Label:*  \n   - Fat: 10g saturated fat per serving  \n   - Sodium: 400mg per serving  \n\n   *Response:*  \n   \"This item contains 10g of saturated fat, which is high and not ideal for maintaining healthy blood pressure. It also has 400mg of sodium, which may impact both high and low blood pressure concerns. Consider choosing foods with unsaturated fats and reduced sodium levels for better health.\"  \n\n3. *Scanned Food Label:*  \n   - Sugar: 2g per serving  \n   - Calcium: 200mg per serving  \n\n   *Response:*  \n   \"This product is low in sugar, making it suitable for managing diabetes, and it provides 200mg of calcium, which supports overall health. This could be a good option to include in your diet!\"  \n\n*General Guidelines:*  \n- Always explain why a food product is suitable or not based on the user's needs.  \n- Use friendly, easy-to-understand language.  \n- Provide actionable suggestions for healthier alternatives when needed.  \n- Avoid medical advice and suggest consulting a healthcare professional for any specific health concerns.  \n\n---\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, I understand! I'm ready to act as your Nutrilens health and nutrition assistant. I'll analyze food labels you scan and provide personalized recommendations based on your profile:\n\n*   *Age:* 19\n*   *Gender:* Male\n*   *Special Needs:* Diabetes, Obesity, Low Blood Pressure, High Blood Pressure\n*   *Height:* 178 cm\n*   *Weight:* 75 kg\n\nLet's get started! Please provide me with the nutritional information from the food label you have scanned. I'll analyze it and give you feedback. I'll be focusing on how the:\n\n*   *Sugar:* affects your diabetes and weight management goals.\n*   *Sodium:* affects both your low and high blood pressure.\n*   *Calories and Fat:* relate to your obesity management.\n\nI'll also look for good things like calcium, fiber, and protein, and point out if they are present. I'm here to help you make informed choices!\n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();*/}
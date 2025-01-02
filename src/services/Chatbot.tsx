import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Settings, Loader2, AlertCircle, Maximize, Minimize } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ConfigModal } from './ConfigModal';
import { generateNutritionalInsights } from '../services/gemini';
import { useUser } from '@clerk/clerk-react';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const CustomAlert = ({ message }: { message: string }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center space-x-2">
    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
    <p className="text-red-700 text-sm">{message}</p>
  </div>
);

export function Chatbot() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "👋 Hi! I'm your NutriLens assistant. I can help you understand the nutritional value of any food and suggest healthier alternatives!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('geminiApiKey', newKey);
    setError('');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!apiKey) {
      setIsConfigOpen(true);
      return;
    }
    if (!user) {
      setError('User is not authenticated. Please log in.');
      return;
    }

    setError('');
    const userMessage: Message = {
      text: input.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const analysis = JSON.parse(localStorage.getItem('analysis') || '');
      const rating = analysis[0];
      const dict = analysis[1];

      const response = await generateNutritionalInsights(rating, dict, user.id);

      const botMessage: Message = {
        text: response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      {error && <CustomAlert message={error} />}

      {isOpen ? (
        <div
          className={`bg-white rounded-lg shadow-xl ${
            isExpanded ? 'w-full max-w-screen-lg h-[80vh]' : 'w-80 sm:w-96 h-[600px]'
          } flex flex-col transition-all duration-300 ease-in-out`}
        >
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">NutriLens Assistant</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsConfigOpen(true)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Open settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                aria-label={isExpanded ? 'Minimize chat' : 'Maximize chat'}
              >
                {isExpanded ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about any food..."
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
      />
    </div>
  );
}

export default Chatbot;

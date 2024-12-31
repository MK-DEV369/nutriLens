import React from 'react';

interface ChatMessageProps {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatMessage({ text, isBot, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isBot ? 'bg-gray-100 text-gray-800' : 'bg-emerald-600 text-white'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{text}</p>
        <span className="text-xs opacity-75 mt-1 block">
          {timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}
import React from 'react';
import { AboutUs } from './AboutUs';

export function HomePage() {
  const handleAnalyzeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/analyze';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              NutriLens
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Your intelligent nutrition companion for making informed dietary choices.
            Analyze food labels instantly and get personalized recommendations.
          </p>
          <button
            onClick={handleAnalyzeClick}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition transform hover:scale-105"
          >
            Start Analyzing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Smart Label Analysis",
              description: "Upload food labels for instant nutritional insights"
            },
            {
              title: "Health Recommendations",
              description: "Get personalized food suggestions based on your needs"
            },
            {
              title: "Nutrition Chatbot Integrated",
              description: "Identify healthy and unhealthy nutrients in your food"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <AboutUs />
    </div>
  );
}
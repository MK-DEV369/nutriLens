import React, { useState } from 'react';

interface GoalsModalProps {
    onSave: (data: {
    targetWeight: string;
    dailyCalories: string;
    proteinGoal: string;
    carbsGoal: string;
    fatGoal: string;
    timeline: string;
    activityLevel: string;
    }) => Promise<void>;
}

export default function GoalsModal({ onSave }: GoalsModalProps) {
    const [targetWeight, setTargetWeight] = useState<string>('');
    const [dailyCalories, setDailyCalories] = useState<string>('');
    const [proteinGoal, setProteinGoal] = useState<string>('');
    const [carbsGoal, setCarbsGoal] = useState<string>('');
    const [fatGoal, setFatGoal] = useState<string>('');
    const [timeline, setTimeline] = useState<string>('');
    const [activityLevel, setActivityLevel] = useState<string>('');
    const activityLevels = [
    'Sedentary',
    'Lightly Active',
    'Moderately Active',
    'Very Active',
    'Extra Active'
    ];
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
        targetWeight,
        dailyCalories,
        proteinGoal,
        carbsGoal,
        fatGoal,
        timeline,
        activityLevel
        });
    };
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Set Your Fitness Goals</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">
                Target Weight (kg)
                <input
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
                />
            </label>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700">
                Daily Calorie Goal
                <input
                type="number"
                value={dailyCalories}
                onChange={(e) => setDailyCalories(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
                />
            </label>
            </div>
            <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Protein (g)
                <input
                    type="number"
                    value={proteinGoal}
                    onChange={(e) => setProteinGoal(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    required
                />
                </label>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Carbs (g)
                <input
                    type="number"
                    value={carbsGoal}
                    onChange={(e) => setCarbsGoal(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    required
                />
                </label>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">
                Fat (g)
                <input
                    type="number"
                    value={fatGoal}
                    onChange={(e) => setFatGoal(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    required
                />
                </label>
            </div>
        </div>
            <div>
            <label className="block text-sm font-medium text-gray-700">
                Timeline (weeks)
                <input
                type="number"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
                />
            </label>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700">
                Activity Level
                <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
                >
                <option value="">Select activity level</option>
                {activityLevels.map((level) => (
                <option key={level} value={level}>
                    {level}
                </option>
                ))}
                </select>
            </label>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
            <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
                Save Goals
            </button>
            </div>
        </form>
        </div>
    </div>
);
}
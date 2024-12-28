import React, { useEffect, useState } from 'react';

interface OnSaveProps {
  (data: {
    age: string;
    gender: string;
    specialNeeds: string[];
    weight: string;
    height: string;
  }): Promise<void>;
}

export default function Modal({ onSave }: { onSave: OnSaveProps }) {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [specialNeeds, setSpecialNeeds] = useState<string[]>([]);
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({ age, gender, specialNeeds, weight, height });
      setAge('');
      setGender('');
      setSpecialNeeds([]);
      setWeight('');
      setHeight('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSpecialNeedsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setSpecialNeeds((prev: string[]) =>
      checked ? [...prev, value] : prev.filter((need) => need !== value)
    );
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGender = e.target.value;
    setGender(selectedGender);

    if (selectedGender === 'Male') {
      setSpecialNeeds((prev) => prev.filter((need) => need !== 'Pregnancy'));
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Enter Your Details</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <select
            value={gender}
            onChange={handleGenderChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <fieldset className="space-y-2">
            <legend className="font-semibold">Special Needs</legend>
            {['Diabetes', 'Obesity', 'High BP', 'Pregnancy', 'Hypertension'].map((need) => (
              <label key={need} className="block">
                <input
                  type="checkbox"
                  value={need}
                  onChange={handleSpecialNeedsChange}
                  checked={specialNeeds.includes(need)}
                  disabled={need === 'Pregnancy' && gender === 'Male'}
                  className="mr-2"
                />
                {need}
              </label>
            ))}
          </fieldset>

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className={`w-full bg-emerald-500 text-white p-2 rounded hover:bg-emerald-600 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}
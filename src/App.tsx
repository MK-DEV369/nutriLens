import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { AnalyzePage } from './components/AnalyzePage';
import Modal from './components/Modal';
import { Chatbot } from './services/Chatbot';
import CalorieHistory from './components/CalorieHistory';

function App() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/check-user-data/${user.id}`)
        .then((response) => {
          if (!response.data.exists) {
            setShowModal(true);
          }
        })
        .catch(() => {
          setShowModal(true);
        });
    } else {
      setShowModal(false);
    }
  }, [user]);

  const handleSaveData = async (formData: Record<string, unknown>) => {
    if (user) {
      try {
        const numericData = {
          ...formData,
          age: Number(formData.age),
          weight: Number(formData.weight),
          height: Number(formData.height),
        };
        await axios.post(`http://localhost:5000/api/user-data`, {
          clerkId: user.id,
          ...numericData,
        });
        setShowModal(false);
        alert('Data saved successfully!');
      } catch (error) {
        alert('Failed to save data. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/history" element={<CalorieHistory />} />
      </Routes>
      {showModal && <Modal onSave={handleSaveData} />}
      <Chatbot />
    </div>
  );
}

export default App;

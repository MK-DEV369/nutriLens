import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { AnalyzePage } from './components/AnalyzePage';
import Modal from './components/Modal';
import { Chatbot } from './services/Chatbot';
import CalorieHistory from './components/CalorieHistory';

// Function to detect if the device is mobile
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return isMobileDevice() ? 'http://192.168.1.3:5000' : 'http://localhost:5000';
  }
  return '/api'; // For production, assuming your frontend and backend are hosted together
};

function App() {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  const apiUrl = getApiUrl();

  useEffect(() => {
    if (user) {
      axios
        .get(`${apiUrl}/api/check-user-data/${user.id}`)
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
    if (!user) return;
  
    try {
      const numericData = {
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
      };
  
      // Use axios interceptors for error handling
      axios.interceptors.request.use(
        (config) => {
          console.log('Request sent:', config.url);
          return config;
        },
        (error) => {
          console.error('Error in request:', error.message);
          throw error;
        }
      );
  
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          console.error('Response error:', error.message);
          if (error.response && error.response.status === 500) {
            alert('Server error occurred while saving data. Please try again.');
          } else if (error.request) {
            alert('Network error occurred while saving data. Please check your internet connection.');
          } else if (error.code === 'ECONNABORTED') {
            alert('Request timeout. Please try again.');
          }
          throw error;
        }
      );
  
      const response = await axios.post(`${apiUrl}/user-data`, {
        clerkId: user.id,
        ...numericData,
      });
  
      console.log('Data saved successfully:', response.data);
  
      setShowModal(false);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error in handleSaveData:', error);
      if (axios.isCancel(error)) {
        alert('Operation was cancelled.');
      } else if (error === 'ECONNABORTED') {
        alert('Request timeout. Please try again.');
      } else {
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
import React, { useState } from 'react';
import { Camera, Upload} from 'lucide-react';
import CropModal from './CropModal';
import { CameraModal } from './CameraModal';
import { Blob } from 'buffer';

export function AnalyzePage() {
  const [foodName, setFoodName] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [calories, setCalories] = useState<number>(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowCropModal(true);
    }
  };

  const handleProcess = async () => {    
    console.log("Starting handleProcess");
    if (!selectedFile || !servingSize || !foodName) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append('weight', servingSize);
    formData.append('foodName', foodName);
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      console.log("Sending request to http://localhost:5001/api/upload");
      const response = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });
      console.log("Response received:", response.status, response.statusText);
      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Error:', errorData);
          throw new Error(errorData.error || 'Network response was not ok');
        } else {
          const errorMessage = await response.text();
          console.error('Error:', errorMessage);
          throw new Error(errorMessage);
        }
      }
  

      const data = await response.json();
      localStorage.setItem('analysis', JSON.stringify(data));
      setAnalysisResult(data);
      setCalories(data.calories);

      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the request.');
    } finally {
      setLoading(false);
    }
  };
  const calculateExerciseTimes = (calories:any) => {
    const caloriesPerMinute = {
      walking: 5,
      jogging: 10,
      cycling: 8,
      swimming: 9,
    };
    const times = {
      walking: (calories / caloriesPerMinute.walking).toFixed(2) + " min",
      jogging: (calories / caloriesPerMinute.jogging).toFixed(2) + " min",
      cycling: (calories / caloriesPerMinute.cycling).toFixed(2) + " min",
      swimming: (calories / caloriesPerMinute.swimming).toFixed(2) + " min",
    };
    return times;
  };
  const exerciseTimes = analysisResult ? calculateExerciseTimes(analysisResult[1].ENERGY) : {
    walking: "NA", jogging: "NA", cycling: "NA", swimming: "NA"
  };

  const handleDragOver = (event: React.DragEvent) => {
      event.preventDefault();
    };
  
    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        setSelectedFile(file);
      }
    };
  
    const handleSaveCroppedImage = (croppedImage: any) => {
      setSelectedFile(croppedImage);
      setShowCropModal(false);
      alert('Image cropped successfully!');
    };
  
    const handleCaptureImage = async (blob: Blob) => {
      const blobArray = await blob.arrayBuffer();
      const file = new File([new Uint8Array(blobArray)], 'captured-image.png', { type: 'image/png' });
      setSelectedFile(file);
      setShowCropModal(true);
      setShowCameraModal(false);
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Food Label</h2>
            <div 
              className="border-2 border-dashed border-emerald-200 rounded-lg p-8 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-12 h-12 text-emerald-600" />
                <p className="text-gray-600">
                  {selectedFile ? selectedFile.name : "Drag and drop your image here or"}
                </p>
                <div className="flex gap-4">
                  <label className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    Upload File
                  </label>
                  <button 
                    onClick={() => setShowCameraModal(true)}
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Use Camera
                  </button>
                    {showCropModal && selectedFile && (
                      <CropModal
                        imageFile={selectedFile}
                        onClose={() => setShowCropModal(false)}
                        onSave={handleSaveCroppedImage}
                      />
                    )}
                    <CameraModal
                      isOpen={showCameraModal}
                      onClose={() => setShowCameraModal(false)}
                      onCapture={handleCaptureImage}
                    />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter food name"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Serving Size (grams)</label>
                <input
                  type="number"
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Enter serving size"
                />
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={loading}
              className={`mt-4 w-full ${loading ? 'bg-emerald-400' : 'bg-green-600 hover:bg-green-700'
                } text-white py-2 px-4 rounded-lg transition-all shadow-lg`}
            >
              {loading ? 'Processing...' : 'Process'}
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-slate-800 text-xl font-semibold mb-4 border-b border-slate-200 pb-2">
              Analysis Results
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="loader border-t-4 border-b-4 border-emerald-600 rounded-full w-12 h-12 animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {analysisResult ? (
                  <>
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                      <h3 className="text-emerald-800 text-lg font-semibold mb-2">
                        Final Rating
                      </h3>
                      <div className="flex items-center">
                        <p className="text-emerald-700 text-2xl font-bold">
                          {analysisResult[0]}
                        </p>
                        <div className="ml-2 h-8 w-1 bg-emerald-300 rounded-full"></div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg">
                      <div className="border border-slate-200 rounded-lg divide-y divide-slate-200">
                        <h3 className="text-slate-700 text-lg font-semibold p-4">
                          Nutritional Info
                        </h3>
                        <ul className="divide-y divide-slate-200">
                          {Object.entries(analysisResult[1]).map(([key, value]) => (
                            <li key={key} className="flex justify-between p-3 hover:bg-slate-100 transition-colors">
                              <span className="font-medium text-slate-600 capitalize">
                                {key.replace(/_/g, ' ')}
                              </span>
                              <span className="text-emerald-600 font-semibold">
                                {value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Upload an image to see the results.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { activity: 'Walking', time: exerciseTimes.walking, icon: '🚶‍♀' },
            { activity: 'Jogging', time: exerciseTimes.jogging, icon: '🏃‍♀' },
            { activity: 'Cycling', time: exerciseTimes.cycling, icon: '🚴‍♀' },
            { activity: 'Swimming', time: exerciseTimes.swimming, icon: '🏊‍♀' },
          ].map((exercise, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl mb-4">{exercise.icon}</span>
                <h3 className="text-xl font-semibold text-emerald-800">{exercise.time}</h3>
                <p className="text-gray-600">of {exercise.activity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

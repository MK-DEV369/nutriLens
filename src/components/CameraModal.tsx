import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Blob } from 'buffer';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (image: Blob) => void;
}

export function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = React.createRef<HTMLVideoElement>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      openCamera();
    } else {
      closeCamera();
    }
  }, [isOpen]);

  const openCamera = async () => {
    try {
      console.log('Attempting to open camera');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia is not supported in this browser.');
        throw new Error('getUserMedia is not supported by your browser.');
      }
      console.log('getUserMedia is supported');
  
      const constraints = { video: { facingMode: 'environment' }, audio: false };
      console.log('Constraints:', JSON.stringify(constraints));
  
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      setError(null);
      console.log('Camera opened successfully');
    } catch (err: any) {
      console.error('Error accessing the camera:', err);
      setError(err.message);
  
      if (err.name === 'NotAllowedError') {
        alert('Camera access was denied. Please allow permissions in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        alert('No camera found. Please ensure your device has a camera.');
      } else if (err.name === 'NotReadableError') {
        alert('The camera is already in use by another application.');
      } else {
        alert(`An unexpected error occurred: ${err.message}`);
      }
    }
  };
  
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (stream && stream.getVideoTracks().length > 0) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const imageCapture = new (window as any).ImageCapture(videoTrack);
        imageCapture.takePhoto()
          .then((blob: Blob) => {
            console.log('Photo captured successfully');
            onCapture(blob);
            closeCamera();
          })
          .catch((error: Error) => {
            console.error('Error capturing photo:', error);
            alert('Failed to capture photo. Please try again.');
          });
      }
    }
  };
  

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-md">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition">
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Take a Photo</h2>
            {stream ? (
              <div className="flex justify-center mb-4">
                <video autoPlay playsInline ref={videoRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <Camera className="w-12 h-12 text-emerald-600 animate-pulse" />
              </div>
            )}
            <button 
              onClick={handleCapture}
              disabled={!stream}
              className="mt-6 w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50 cursor-not-allowed"
            >
              Capture
            </button>
          </div>
        </div>
      )}
    </>
  );
}
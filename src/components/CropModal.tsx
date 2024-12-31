import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CropModalProps {
  imageFile: File | null;
  onClose: () => void;
  onSave: (croppedImage: File) => void;
}

const CropModal: React.FC<CropModalProps> = ({ imageFile, onClose, onSave }) => {
  const [crop, setCrop] = useState<Crop>({ unit: "%", x: 0, y: 0, width: 50, height: 50 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleImageLoad = () => {
    if (!completedCrop) {
      setCrop({
        unit: "%",
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      });
    }
  };

  const generateCroppedImage = () => {
    if (!completedCrop || !imageRef.current || !previewCanvasRef.current) {
      console.error("Incomplete crop or missing references.");
      return;
    }

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    if (!ctx || !completedCrop.width || !completedCrop.height) {
      console.error("Canvas context is missing or crop dimensions are invalid.");
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(completedCrop.width);
    canvas.height = Math.floor(completedCrop.height);

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob(async (blob) => {
      if (blob) {
        const croppedImage = new File([blob], 'cropped-img.png', { type: blob.type });
        onSave(croppedImage);
      }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-10 max-w-full w-[90%] md:w-[600px] max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Crop Your Image</h2>
        <div className="flex justify-center mb-4">
          {imageFile && (
            <ReactCrop
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={(c) => setCompletedCrop(c as PixelCrop)}
              className="max-w-full"
            >
              <img
                ref={imageRef}
                src={URL.createObjectURL(imageFile)}
                alt="Crop Preview"
                onLoad={handleImageLoad}
                className="max-w-full max-h-96"
              />
            </ReactCrop>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={generateCroppedImage}
            className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
          >
            Save
          </button>
        </div>
        <canvas ref={previewCanvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default CropModal;

import React, { useCallback } from 'react';

const ImageUploader = ({ onUpload, label = "Upload Image", accept = "image/*" }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="upload-container">
      <label className="upload-button">
        {label}
        <input 
          type="file" 
          accept={accept} 
          onChange={handleFileChange} 
          hidden 
        />
      </label>
    </div>
  );
};

export default ImageUploader;

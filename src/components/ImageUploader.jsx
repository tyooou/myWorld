import React, { useState } from 'react';

export default function ImageUploader({ onSave }) {
  const [imageURL, setImageURL] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageURL(reader.result);
      if (onSave) onSave(file, reader.result); // File and base64
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label>
        <strong>📷 Add Photo:</strong>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'block', marginTop: '0.5rem' }}
        />
      </label>

      {imageURL && (
        <div style={{ marginTop: '1rem' }}>
          <p><em>Preview:</em></p>
          <img
            src={imageURL}
            alt="Memory"
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              borderRadius: '8px',
              border: '2px solid #ccc',
              boxShadow: '2px 2px 8px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      )}
    </div>
  );
}

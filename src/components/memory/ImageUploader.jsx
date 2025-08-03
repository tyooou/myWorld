import React, { useState } from "react";
import SystemLabel from "../system/SystemLabel";
import SystemUpload from "../system/SystemUpload";

export default function ImageUploader({ newMemory, onSave }) {
  const [imagePreviews, setImagePreviews] = useState(
    newMemory.files?.map((f) => f) || []
  );
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const previews = [...newMemory.files];
    let loaded = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push({ file, preview: reader.result });
        loaded++;

        if (loaded === files.length) {
          setImagePreviews(previews.map((p) => p.preview));
          if (onSave) onSave(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <SystemLabel text="Add Photos:" />
      <SystemUpload
        text="Choose file"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {imagePreviews.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <em>Previews:</em>
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {imagePreviews.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Uploaded ${idx + 1}`}
                onClick={() => setSelectedImage(url)}
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  border: "2px solid #ccc",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            cursor: "zoom-out",
          }}
        >
          <img
            src={selectedImage}
            alt="Full view"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              boxShadow: "0 0 20px rgba(255,255,255,0.2)",
            }}
          />
        </div>
      )}
    </div>
  );
}

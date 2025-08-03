import React, { useState } from "react";
import SystemLabel from "../system/SystemLabel";
import SystemUpload from "../system/SystemUpload";

export default function ImageUploader({ onSave }) {
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
  console.log(files);

    const previews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push({ file, preview: reader.result });

        // Wait until all files are processed
        if (previews.length === files.length) {
          setImagePreviews(previews.map((p) => p.preview));
          if (onSave) onSave(previews); // pass array of {file, preview}
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
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  borderRadius: "6px",
                  border: "2px solid #ccc",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// utils/storage.js
export const saveMemories = (memories) => {
  try {
    localStorage.setItem('memories', JSON.stringify(memories));
  } catch (error) {
    console.error('Error saving memories:', error);
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      alert('Storage limit reached. Please delete some memories.');
    }
  }
};

export const loadMemories = () => {
  try {
    const saved = localStorage.getItem('memories');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading memories:', error);
    return [];
  }
};

export const saveFileToStorage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        data: event.target.result.split(',')[1] // Base64 encoded data
      };
      resolve(fileData);
    };
    reader.readAsDataURL(file);
  });
};

export const getFileUrl = (fileData) => {
  if (typeof fileData === 'string') {
    // Already a URL or path
    return fileData;
  } else if (fileData && fileData.data) {
    // Convert base64 back to data URL
    return `data:${fileData.type};base64,${fileData.data}`;
  }
  return '';
};
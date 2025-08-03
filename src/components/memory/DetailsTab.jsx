import React, { useState, useEffect } from 'react';

export default function DetailsTab({
  newMemory,
  setNewMemory,
  tags,
  selectedTag,
  setSelectedTag,
  showCustomInput,
  setShowCustomInput,
  customTag,
  setCustomTag,
  customTagColor,
  setCustomTagColor,
  addCustomTag,
  deleteTag
}) {
  // Initialize date with current date if not already set
  useEffect(() => {
    if (!newMemory.date) {
      const today = new Date();
      // Format as YYYY-MM-DD (ISO format for date inputs)
      const formattedDate = today.toISOString().split('T')[0];
      setNewMemory(prev => ({ ...prev, date: formattedDate }));
    }
  }, [setNewMemory]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (!selectedDate) {
      // If date is cleared, reset to today's date
      const today = new Date().toISOString().split('T')[0];
      setNewMemory(prev => ({ ...prev, date: today }));
      return;
    }
    setNewMemory(prev => ({ ...prev, date: selectedDate }));
  };

  return (
    <div>
      {/* Title Input */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <input
        type="text"
        value={newMemory.title}
        onChange={e => setNewMemory({ ...newMemory, title: e.target.value })}
        placeholder="Memory title"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-3"
        required
      />

      {/* Date Input - Compulsory */}
      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
      <input
        type="date"
        value={newMemory.date || new Date().toISOString().split('T')[0]}
        onChange={handleDateChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-3"
        required
      />

      {/* Visibility Toggle */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Visibility:</label>
        <div className="inline-flex border border-gray-300 rounded-full overflow-hidden">
          <button
            type="button"
            onClick={() => setNewMemory({ ...newMemory, isPrivate: true })}
            className={`px-3 py-1 text-sm ${newMemory.isPrivate ? 'bg-blue-600 text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
          >
            Private
          </button>
          <button
            type="button"
            onClick={() => setNewMemory({ ...newMemory, isPrivate: false })}
            className={`px-3 py-1 text-sm ${!newMemory.isPrivate ? 'bg-green-600 text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
          >
            Public
          </button>
        </div>
      </div>

      <label className="block text-[9px] ml-[0.125rem]">Tags</label>
      <div className="flex flex-col gap-2 mb-3">
        {tags.map((tag) => (
          <div key={tag.id} className="relative">
            <button
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
              className={`px-3 py-1 text-xs rounded-md ${selectedTag === tag.id ? 'ring-2 ring-offset-1' : ''}`}
              style={{
                backgroundColor: tag.colour,
                color: '#fff',
                border: `1px solid ${tag.colour}`,
                boxShadow: selectedTag === tag.id ? `0 0 0 3px ${tag.colour}66` : 'none',
              }}
            >
              {tag.tag_name}
            </button>
            <div className="absolute -top-1 -right-1 ">
              <button 
                className="text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                onClick={() => deleteTag(tag.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Tag Button */}
      {!showCustomInput && (
        <button
          type="button"
          onClick={() => setShowCustomInput(true)}
          className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          + Add Custom Tag
        </button>
      )}

      {/* Custom Tag Input */}
      {showCustomInput && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Custom tag"
            className="flex-grow px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="color"
            value={customTagColor}
            onChange={(e) => setCustomTagColor(e.target.value)}
            className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
          />
          <button
            type="button"
            onClick={addCustomTag}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowCustomInput(false)}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
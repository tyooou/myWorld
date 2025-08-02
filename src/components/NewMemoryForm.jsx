import React, { useState, useRef, useEffect } from 'react';
import DetailsTab from './DetailsTab';
import VoiceMemoRecorder from './VoiceMemoRecorder';
import ImageUploader from './ImageUploader';
import JournalEntry from './JournalEntry';

const FORM_WIDTH = 380;
const FORM_HEIGHT = 520;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export default function NewMemoryForm({
  newMemory,
  setNewMemory,
  onFileChange,
  onVoiceMemo,
  onSave,
  onCancel
}) {
  const [pos, setPos] = useState({ x: 60, y: 60 });
  const dragData = useRef({ dragging: false, originX: 0, originY: 0, startX: 0, startY: 0 });
  const [activeTab, setActiveTab] = useState('details');

  const [tags, setTags] = useState(() => {
    try {
      const saved = localStorage.getItem('memoryTags');
      return saved ? JSON.parse(saved) : [
        { id: 1, tag_name: 'School', colour: '#3498db' },
        { id: 2, tag_name: 'Family', colour: '#e74c3c' },
        { id: 3, tag_name: 'Travel', colour: '#2ecc71' }
      ];
    } catch {
      return [
        { id: 1, tag_name: 'School', colour: '#3498db' },
        { id: 2, tag_name: 'Family', colour: '#e74c3c' },
        { id: 3, tag_name: 'Travel', colour: '#2ecc71' }
      ];
    }
  });

  const [selectedTag, setSelectedTag] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [customTagColor, setCustomTagColor] = useState('#ff69b4');

  useEffect(() => {
    localStorage.setItem('memoryTags', JSON.stringify(tags));
  }, [tags]);

  const addCustomTag = () => {
    if (!customTag.trim()) return;
    const newId = Date.now();
    setTags([...tags, { id: newId, tag_name: customTag.trim(), colour: customTagColor }]);
    setCustomTag('');
    setCustomTagColor('#ff69b4');
    setShowCustomInput(false);
  };

  const deleteTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id));
    if (selectedTag === id) setSelectedTag(null);
  };

  const handleMouseDown = e => {
    dragData.current = {
      dragging: true,
      originX: e.clientX,
      originY: e.clientY,
      startX: pos.x,
      startY: pos.y
    };
    e.preventDefault();
  };

  const handleMouseMove = e => {
    if (!dragData.current.dragging) return;
    const dx = e.clientX - dragData.current.originX;
    const dy = e.clientY - dragData.current.originY;
    const rawX = dragData.current.startX + dx;
    const rawY = dragData.current.startY + dy;
    const x = clamp(rawX, 0, window.innerWidth - FORM_WIDTH);
    const y = clamp(rawY, 0, window.innerHeight - FORM_HEIGHT);
    setPos({ x, y });
  };

  const handleMouseUp = () => {
    dragData.current.dragging = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <DetailsTab
            tags={tags}
            setTags={setTags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            newMemory={newMemory}
            setNewMemory={setNewMemory}
            showCustomInput={showCustomInput}
            setShowCustomInput={setShowCustomInput}
            customTag={customTag}
            setCustomTag={setCustomTag}
            customTagColor={customTagColor}
            setCustomTagColor={setCustomTagColor}
            addCustomTag={addCustomTag}
            deleteTag={deleteTag}
          />
        );

      case 'journal':
        return (
          <JournalEntry
            journal={newMemory.journal}
            setJournal={(val) => setNewMemory({ ...newMemory, journal: val })}
          />
        );

      case 'voice':
        return <VoiceMemoRecorder onSave={() => console.log("Saved voice memo")} />;

      case 'pictures':
        return <ImageUploader onSave={() => console.log("Saved Pics)")} />;

      default:
        return null;
    }
  };

  return (
    <div
      className="absolute z-[1000] bg-[#fffbe6] text-black border-2 border-gray-700 rounded-lg shadow-xl"
      style={{ top: pos.y, left: pos.x, width: `${FORM_WIDTH}px`, userSelect: 'none' }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="cursor-move bg-yellow-400 p-2 rounded-t-lg border-b border-gray-400"
      >
        <strong>📝 Create New Memory</strong>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        {['details', 'journal', 'voice', 'pictures'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center px-2 py-1 text-sm font-medium cursor-pointer select-none ${
              activeTab === tab ? 'bg-white font-bold' : 'bg-gray-100'
            }`}
          >
            {tab.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 overflow-y-auto" style={{ maxHeight: `${FORM_HEIGHT - 150}px` }}>
        {renderTabContent()}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 p-3 border-t border-gray-300">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
        >
          Save Memory
        </button>
      </div>
    </div>
  );
}

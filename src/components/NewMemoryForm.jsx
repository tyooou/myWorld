import React, { useState, useRef, useEffect } from 'react';

const FORM_WIDTH = 320;
const FORM_HEIGHT = 480; // adjust if your form is taller
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export default function NewMemoryForm({
  newMemory,
  setNewMemory,
  onFileChange,
  onVoiceMemo,
  onSave,
  onCancel
}) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const dragData = useRef({
    dragging: false,
    originX: 0,
    originY: 0,
    startX: 0,
    startY: 0
  });

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

    // clamp so the form never goes out of screen bounds
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

  return (
    <div
      className="memory-form-container"
      style={{
        position: 'absolute',
        top: pos.y,
        left: pos.x,
        zIndex: 2000,
        width: '320px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        background: '#fff',
        borderRadius: '4px',
        pointerEvents: 'auto'
      }}
    >
      <div
        className="memory-form-header"
        onMouseDown={handleMouseDown}
        style={{
          cursor: 'move',
          padding: '8px 12px',
          borderBottom: '1px solid #ddd',
          background: '#f5f5f5',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '16px' }}>Create New Memory</h2>
      </div>
      <div className="memory-form" style={{ padding: '12px' }}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={newMemory.title}
            onChange={e => setNewMemory({ ...newMemory, title: e.target.value })}
            placeholder="Memory title"
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="isJournal"
            checked={newMemory.isJournal}
            onChange={e => setNewMemory({ ...newMemory, isJournal: e.target.checked })}
          />
          <label htmlFor="isJournal">Journal Entry</label>
        </div>
        <div className="form-group">
          <label>Add Files</label>
          <input type="file" multiple onChange={onFileChange} />
          {newMemory.files.length > 0 && (
            <div className="file-list">
              {newMemory.files.map((f, i) => (
                <div key={i}>{f.name}</div>
              ))}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Voice Memo</label>
          <button onClick={onVoiceMemo} className="voice-memo-btn">
            {newMemory.voiceMemo ? 'Replace Voice Memo' : 'Add Voice Memo'}
          </button>
          {newMemory.voiceMemo && <div className="voice-memo-indicator">Voice memo added</div>}
        </div>
        <div className="form-actions" style={{ textAlign: 'right', marginTop: '12px' }}>
          <button onClick={onCancel} className="cancel-btn" style={{ marginRight: '8px' }}>
            Cancel
          </button>
          <button onClick={onSave} className="save-btn">
            Save Memory
          </button>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

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
  return (
    <div>
      {/* Title Input */}
      <label>Title</label>
      <input
        type="text"
        value={newMemory.title}
        onChange={e => setNewMemory({ ...newMemory, title: e.target.value })}
        placeholder="Memory title"
        style={{ width: '100%', marginTop: 4, marginBottom: 10 }}
      />

      {/* Visibility Toggle */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 'bold', marginRight: 10 }}>Visibility:</label>
        <div
          style={{
            display: 'inline-flex',
            border: '1px solid #ccc',
            borderRadius: '20px',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <div
            onClick={() => setNewMemory({ ...newMemory, isPrivate: true })}
            style={{
              padding: '6px 12px',
              backgroundColor: newMemory.isPrivate ? '#3498db' : '#f0f0f0',
              color: newMemory.isPrivate ? '#fff' : '#333',
              fontWeight: newMemory.isPrivate ? 'bold' : 'normal',
            }}
          >
            Private
          </div>
          <div
            onClick={() => setNewMemory({ ...newMemory, isPrivate: false })}
            style={{
              padding: '6px 12px',
              backgroundColor: !newMemory.isPrivate ? '#2ecc71' : '#f0f0f0',
              color: !newMemory.isPrivate ? '#fff' : '#333',
              fontWeight: !newMemory.isPrivate ? 'bold' : 'normal',
            }}
          >
            Public
          </div>
        </div>
      </div>

      {/* Tag Section */}
      <label style={{ fontWeight: 'bold' }}>Tags</label>
      <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map((tag) => (
          <div key={tag.id} style={{ position: 'relative', display: 'inline-block' }}>
            <button
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '500',
                border: `1px solid ${tag.colour}`,
                backgroundColor: tag.colour,
                color: '#fff',
                boxShadow: selectedTag === tag.id ? `0 0 0 3px ${tag.colour}66` : 'none',
                cursor: 'pointer'
              }}
            >
              {tag.tag_name}
            </button>
            <button
              onClick={() => deleteTag(tag.id)}
              title="Delete tag"
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                width: '18px',
                height: '18px',
                fontSize: '12px',
                background: '#fff',
                color: '#e74c3c',
                borderRadius: '9999px',
                border: '1px solid #e74c3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add Custom Tag Button */}
      {!showCustomInput && (
        <button
          onClick={() => setShowCustomInput(true)}
          style={{
            marginTop: '10px',
            padding: '6px 10px',
            fontSize: '12px',
            borderRadius: '6px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + Add Custom Tag
        </button>
      )}

      {/* Custom Tag Input */}
      {showCustomInput && (
        <div
          style={{
            marginTop: '10px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Custom tag"
            style={{
              padding: '6px',
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              flex: '1 1 auto'
            }}
          />
          <input
            type="color"
            value={customTagColor}
            onChange={(e) => setCustomTagColor(e.target.value)}
            style={{
              padding: '6px',
              width: '40px',
              height: '40px',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />
          <button
            type="button"
            onClick={addCustomTag}
            style={{
              backgroundColor: '#2ecc71',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowCustomInput(false)}
            style={{
              backgroundColor: '#e0e0e0',
              color: '#333',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

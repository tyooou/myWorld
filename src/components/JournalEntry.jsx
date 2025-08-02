import React from 'react';

export default function JournalEntryInput({ journal, setJournal }) {
  return (
    <div>
      <label>Journal Entry</label>
      <textarea
        value={journal || ''}
        onChange={(e) => setJournal(e.target.value)}
        rows={8}
        style={{ width: '100%', resize: 'vertical', marginTop: 6 }}
        placeholder="Write your journal entry here..."
      />
    </div>
  );
}

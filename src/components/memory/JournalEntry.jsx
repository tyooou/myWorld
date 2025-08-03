import React from "react";
import SystemTextArea from "../system/SystemTextArea";
import SystemLabel from "../system/SystemLabel";

export default function JournalEntryInput({ journal, setJournal }) {
  return (
    <div>
      <SystemLabel text="Journal Entry" />
      <SystemTextArea
        value={journal}
        placeholder="Write your journal entry here..."
        onChange={(e) => setJournal(e.target.value)}
      />
    </div>
  );
}

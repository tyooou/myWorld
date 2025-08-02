import React, { useState, useRef } from 'react';

export default function VoiceMemoRecorder({ onSave }) {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      if (onSave) onSave(blob); // send blob back to parent (e.g. attach to pin)
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? '🛑 Stop Recording' : '🎙️ Start Recording'}
      </button>

      {audioURL && (
        <div>
          <p>Preview:</p>
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
}

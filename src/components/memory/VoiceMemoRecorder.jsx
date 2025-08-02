import React, { useState, useRef } from "react";
import SystemButton from "../system/SystemButton";
import SystemAudio from "../system/SystemAudio";
import SystemLabel from "../system/SystemLabel";

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
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
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
    <div className="flex flex-col">
      {audioURL && (
        <div>
          <SystemLabel text="Voice Memo Preview" />
          <SystemAudio audioURL={audioURL} />
        </div>
      )}
      <SystemButton
        onClick={recording ? stopRecording : startRecording}
        text={recording ? "🛑 Stop Recording" : "🎙️ Start Recording"}
      />
    </div>
  );
}

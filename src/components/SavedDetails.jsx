import React, { useState, useRef, useEffect } from "react";
import DetailsTab from "./DetailsTab";
import VoiceMemoRecorder from "./VoiceMemoRecorder";
import ImageUploader from "./ImageUploader";
import JournalEntry from "./JournalEntry";
import SystemButton from "../system/SystemButton";
import SystemPanel from "../system/SystemPanel";
import SystemTabs from "../system/SystemTabs";
import SystemAudio from "../system/SystemAudio";
import NewMemoryForm from "./NewMemoryForm";

const FORM_WIDTH = 380;
const FORM_HEIGHT = 520;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export default function SavedDetails({
  memory,
  setNewMemory,
  perms,
  newMemory,

  onFileChange,
  onVoiceMemo,
  onSave,
  onCancel,
}) {
  const [pos, setPos] = useState({ x: 60, y: 60 });
  const dragData = useRef({
    dragging: false,
    originX: 0,
    originY: 0,
    startX: 0,
    startY: 0,
  });
  const [activeTab, setActiveTab] = useState("details");
  console.log("SavedDetails newMemory:", memory);

  const [tags, setTags] = useState(() => {
    try {
      const saved = localStorage.getItem("memoryTags");
      return saved
        ? JSON.parse(saved)
        : [
            { id: 1, tag_name: "School", colour: "#3498db" },
            { id: 2, tag_name: "Family", colour: "#e74c3c" },
            { id: 3, tag_name: "Travel", colour: "#2ecc71" },
          ];
    } catch {
      return [
        { id: 1, tag_name: "School", colour: "#3498db" },
        { id: 2, tag_name: "Family", colour: "#e74c3c" },
        { id: 3, tag_name: "Travel", colour: "#2ecc71" },
      ];
    }
  });

  const [selectedTag, setSelectedTag] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [customTagColor, setCustomTagColor] = useState("#ff69b4");
  const [showform, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem("memoryTags", JSON.stringify(tags));
  }, [tags]);

  const addCustomTag = () => {
    if (!customTag.trim()) return;
    const newId = Date.now();
    setTags([
      ...tags,
      { id: newId, tag_name: customTag.trim(), colour: customTagColor },
    ]);
    setCustomTag("");
    setCustomTagColor("#ff69b4");
    setShowCustomInput(false);
  };

  const deleteTag = (id) => {
    setTags(tags.filter((tag) => tag.id !== id));
    if (selectedTag === id) setSelectedTag(null);
  };

  const handleMouseDown = (e) => {
    dragData.current = {
      dragging: true,
      originX: e.clientX,
      originY: e.clientY,
      startX: pos.x,
      startY: pos.y,
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragData.current.dragging) return;
    const dx = e.clientX - dragData.current.originX;
    const dy = e.clientY - dragData.current.originY;
    const rawX = dragData.current.startX + dx;
    const rawY = dragData.current.startY + dy;
    const x = clamp(rawX, 0, window.innerWidth);
    const y = clamp(rawY, 0, window.innerHeight);
    setPos({ x, y });
  };

  const handleMouseUp = () => {
    dragData.current.dragging = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "Details":
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

      case "Journal":
        return (
          <JournalEntry
            journal={newMemory.journal}
            setJournal={(val) => setNewMemory({ ...newMemory, journal: val })}
          />
        );

      case "Voice":
        return (
          <VoiceMemoRecorder onSave={() => console.log("Saved voice memo")} />
        );

      case "Pictures":
        return <ImageUploader onSave={() => console.log("Saved Pics)")} />;

      default:
        return null;
    }
  };

  const options = ["Details", "Journal", "Voice", "Pictures"];

  return (
    <SystemPanel
      title={memory.title || "Untitled Memory"}
      onMouseDown={(e) => handleMouseDown(e)}
      style={{ left: pos.x, top: pos.y, position: "fixed" }}
    >
      <div
        className="p-3 overflow-y-auto max-w-[500px]"
        style={{ maxHeight: FORM_HEIGHT - 150 }}
      >
        <h4 className="text-sm font-medium mb-2 ">Journal:</h4>
        <memory className="Journal">{memory.journal}</memory>

        {/* Display images from public folder */}
        {memory.files && memory.files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Attached Images:</h4>
            <div className="grid grid-cols-2 gap-2">
              {memory.files.map((filename, index) => (
                <div key={index} className="relative">
                  <img
                    src={`/${filename}`}
                    alt={`Memory image ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display voice memo if it exists */}
        {memory.voiceMemo && (
          <div className="mt-4 flex flex-col">
            <h4 className="text-sm font-medium mb-2">Voice Memo:</h4>
            <SystemAudio audioURL={memory.voiceMemo} />
          </div>
        )}
      </div>

      {perms && (
        <div className="flex justify-end gap-2 p-3 border-t border-gray-300">
          <SystemButton onClick={() => setShowForm(true)} text="Edit" />
        </div>
      )}

      {showform && (
        <NewMemoryForm
          newMemory={newMemory}
          setNewMemory={setNewMemory}
          onFileChange={onFileChange}
          onVoiceMemo={onVoiceMemo}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
    </SystemPanel>
  );
}

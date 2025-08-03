import React from "react";
import SysButton from "../system/SystemButton";
import SystemTextInput from "../system/SystemTextInput";

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
  deleteTag,
}) {
  return (
    <div>
      {/* Title Input */}
      <label className="block text-[9px] mb-1 ml-[0.125rem]">Title</label>
      <SystemTextInput
        value={newMemory.title}
        placeholder="Enter title here."
        onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
      />

      {/* Visibility Toggle */}
      <div className="mt-3 mb-3">
        <label className="block text-[9px] mb-1 ml-[0.125rem]">
          Visibility
        </label>
        <div className="inline-flex border border-gray-300 -full overflow-hidden cursor-pointer select-none">
          <div
            onClick={() => setNewMemory({ ...newMemory, isPrivate: false })}
            className={`px-3 py-1  ${
              !newMemory.isPrivate
                ? "bg-green-500 text-white font-bold"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Public
          </div>
          <div
            onClick={() => setNewMemory({ ...newMemory, isPrivate: true })}
            className={`px-3 py-1 ${
              newMemory.isPrivate
                ? "bg-blue-500 text-white font-bold"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Private
          </div>
        </div>
      </div>

      <label className="block text-[9px] ml-[0.125rem]">Tags</label>
      <div className="flex flex-col gap-2 mb-3">
        {tags.map((tag) => (
          <div key={tag.id} className="relative">
            <button
              type="button"
              onClick={() =>
                setSelectedTag(selectedTag === tag.id ? null : tag.id)
              }
              className={`px-3 py-1 -md  font-medium border ${
                selectedTag === tag.id
                  ? `ring-4 ring-opacity-40`
                  : "border-transparent"
              }`}
              style={{
                backgroundColor: tag.colour,
                borderColor: tag.colour,
                color: "#fff",
                boxShadow:
                  selectedTag === tag.id ? `0 0 0 3px ${tag.colour}66` : "none",
              }}
            >
              {tag.tag_name}
            </button>
            <div className="absolute -top-1 -right-1 ">
              <SysButton text={"\u2715"} onClick={() => deleteTag(tag.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Tag Button */}
      {!showCustomInput && (
        <button
          onClick={() => setShowCustomInput(true)}
          className="mt-2 px-3 py-1   bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          + Add Custom Tag
        </button>
      )}

      {/* Custom Tag Input */}
      {showCustomInput && (
        <div className="mt-2 flex flex-wrap gap-2 items-center">
          <SystemTextInput
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Enter tag name."
          />
          <input
            type="color"
            value={customTagColor}
            onChange={(e) => setCustomTagColor(e.target.value)}
            className="w-7
             h-7 p-0 border border-gray-300 cursor-pointer"
            title="Pick a color"
          />
          <SysButton text="Add" onClick={addCustomTag} />
          <SysButton text="Cancel" onClick={() => setShowCustomInput(false)} />
        </div>
      )}
    </div>
  );
}

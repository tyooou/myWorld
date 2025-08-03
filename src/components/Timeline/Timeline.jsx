import React, { useState, useEffect, useRef } from "react";
import SystemButton from "../system/SystemButton";

export default function Timeline({
  memories,
  onClose,
  onMemoryClick,
  selectedMemoryId,
}) {
  const [minYear, setMinYear] = useState(0);
  const [maxYear, setMaxYear] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);
  const timelineRef = useRef(null);
  const memoryRefs = useRef([]);

  // Reset refs array when memories change
  useEffect(() => {
    memoryRefs.current = [];
  }, [memories]);

  // Calculate min and max years from memories
  useEffect(() => {
    if (memories.length > 0) {
      const years = memories.map((mem) => new Date(mem.date).getFullYear());
      setMinYear(Math.min(...years));
      setMaxYear(Math.max(...years));

      // Set initial selected year to the most recent year
      if (selectedYear === null) {
        setSelectedYear(Math.max(...years));
      }
    }
  }, [memories]);

  // Scroll to closest memory for selected year
  useEffect(() => {
    if (selectedYear !== null && timelineRef.current && memories.length > 0) {
      // Sort memories by date
      const sortedMemories = [...memories].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Find the closest memory to the selected year in the sorted array
      let closestIndex = -1;
      let minDiff = Infinity;

      sortedMemories.forEach((memory, index) => {
        const memoryYear = new Date(memory.date).getFullYear();
        const diff = Math.abs(memoryYear - selectedYear);

        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      // Scroll to the closest memory card
      if (closestIndex !== -1 && memoryRefs.current[closestIndex]) {
        memoryRefs.current[closestIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedYear, memories]);

  // Generate year dots for the timeline
  const generateYearDots = () => {
    if (!minYear || !maxYear) return null;

    const years = [];
    for (let year = minYear; year <= maxYear; year++) {
      years.push(year);
    }

    return (
      <div className="flex justify-between w-full px-4">
        {years.map((year) => (
          <div
            key={year}
            className="relative cursor-pointer group"
            style={{ flex: 1 }}
            onClick={() => setSelectedYear(year)}
          >
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div
                className={`w-3 h-3 transition-all ${
                  selectedYear === year
                    ? "bg-blue-500 scale-125"
                    : "bg-gray-400 group-hover:bg-blue-300"
                }`}
              ></div>
              <div
                className={`text-center mt-1 transition-colors ${
                  selectedYear === year
                    ? "font-bold text-blue-600"
                    : "text-gray-600 group-hover:text-blue-500"
                }`}
              >
                {year}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Get first image from memory files
  const getFirstImage = (memory) => {
    if (!memory.files) return null;
    return memory.files.find((file) =>
      typeof file === "string"
        ? file.match(/\.(jpeg|jpg|gif|png)$/)
        : file.type.startsWith("image/")
    );
  };

  // Sort memories by date for rendering
  const sortedMemories = [...memories].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div
      className="bg-white border border-gray-300 shadow-lg p-4 font-[pixel] text-[9px] p-4"
      style={{ height: "40vh", width: "100%" }}
    >
      {/* Close button */}
      <div className="absolute top-2 right-2">
        <SystemButton text={"\u2715"} onClick={onClose} />
      </div>

      {/* Timeline bar with year dots */}
      <div className="relative">
        <div className="absolute top-3 left-0 right-0 h-1 bg-gray-300"></div>
        {generateYearDots()}
      </div>

      {/* Memories scrollable area - Added margin-top to push cards lower */}
      <div
        ref={timelineRef}
        className="mt-12 flex overflow-x-auto space-x-4 pb-4" // Changed mt-8 to mt-12
        style={{ height: "calc(100% - 60px)" }}
      >
        {sortedMemories.map((memory, index) => {
          const memoryYear = new Date(memory.date).getFullYear();
          // Calculate the difference for the current memory
          const diff = Math.abs(memoryYear - selectedYear);
          // Find the minimum difference among all memories
          const minDiff =
            memories.length > 0
              ? Math.min(
                  ...memories.map((m) =>
                    Math.abs(new Date(m.date).getFullYear() - selectedYear)
                  )
                )
              : Infinity;
          const isClosest = selectedYear !== null && diff === minDiff;
          const isSelected = selectedMemoryId === memory.id;

          return (
            <div
              key={index}
              ref={(el) => (memoryRefs.current[index] = el)}
              className={`flex-shrink-0 w-64 h-full border overflow-hidden cursor-pointer transform transition-all ${
                isSelected
                  ? "border-blue-500 scale-105 shadow-lg"
                  : selectedYear === memoryYear
                  ? "border-blue-500 scale-105 shadow-md"
                  : isClosest
                  ? "border-blue-300 shadow-sm"
                  : "border-gray-200"
              }`}
              onClick={() => {
                setSelectedYear(memoryYear);
                onMemoryClick(memory);
              }}
            >
              {/* Memory title - Added gradient background */}
              <div className="p-2 border-b border-gray-200 truncate bg-gradient-to-r from-blue-900 to-green-500">
                <h3 className="font-medium text-white">{memory.title}</h3>
                <p className="text-white opacity-80">
                  {new Date(memory.date).toLocaleDateString()}
                </p>
              </div>

              {/* Memory image */}
              <div className="h-4/5 overflow-hidden flex items-center justify-center bg-gray-100">
                {getFirstImage(memory) ? (
                  <img
                    src={
                      typeof getFirstImage(memory) === "string"
                        ? `/${getFirstImage(memory)}`
                        : URL.createObjectURL(getFirstImage(memory))
                    }
                    alt={memory.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    No image available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

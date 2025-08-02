import React, { useRef, useState, useEffect } from "react";

function SystemAudio({ audioURL }) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio && audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    audio?.addEventListener("timeupdate", updateProgress);
    return () => audio?.removeEventListener("timeupdate", updateProgress);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  return (
    <div
      className="
        w-[260px] bg-gray-200 select-none font-[pixel] text-[9px] 
        border-t-2 border-t-white border-l-2 border-l-white 
        border-r-2 border-r-black border-b-2 border-b-black
      "
    >
      <div className="p-[0.125rem]">
        <div className="border border-dotted p-1">
          <div className="mb-2">
            <div
              onClick={togglePlay}
              className="
                cursor-pointer text-center text-black
                border-t-2 border-t-white active:border-t-black 
                border-l-2 border-l-white active:border-l-black 
                border-r-2 border-r-black active:border-r-white 
                border-b-2 border-b-black active:border-b-white 
                bg-gray-200 p-[0.125rem] w-fit mx-auto
              "
            >
              <div className="border border-dotted px-2 py-[0.125rem]">
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </div>
            </div>
          </div>

          <div
            ref={progressRef}
            onClick={handleSeek}
            className="
              w-full h-[10px] bg-white border border-black 
              shadow-[inset_1px_1px_0px_#000] cursor-pointer relative
            "
          >
            <div
              className="h-full bg-blue-600"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <audio ref={audioRef} src={audioURL} preload="auto" />
        </div>
      </div>
    </div>
  );
}

export default SystemAudio;

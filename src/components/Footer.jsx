import { useEffect, useState } from "react";

function Footer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full z-10 bg-gray-300 p-[0.125rem]">
      <div
        className="
          w-full h-6 relative flex items-center justify-between px-1
          text-[9px] font-[pixel] bg-gray-200
          border-t-[1px] border-t-white
          border-l-[1px] border-l-white
          border-b-[1px] border-b-gray-500
          border-r-[1px] border-r-gray-500
        "
      >
        {/* Left */}
        <span className="text-gray-500 ">v1.10</span>

        {/* Center */}
        <span className="text-gray-500 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          © 2025 myWorld Corporations
        </span>

        {/* Right */}
        <div
          className="
            px-2 py-[1px] bg-gray-300 text-[9px] font-[pixel] flex items-center
            border-t-[1px] border-t-gray-500
            border-l-[1px] border-l-gray-500
            border-b-[1px] border-b-white
            border-r-[1px] border-r-white
          "
        >
          {time}
        </div>
      </div>
    </div>
  );
}

export default Footer;

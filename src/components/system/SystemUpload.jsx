function SystemUpload({ text, type, accept, onChange }) {
  return (
    <div
      className="
        border-t-2 border-t-white active:border-t-black 
        border-l-2 border-l-white active:border-l-black 
        border-r-2 border-r-black active:border-r-white 
        border-b-2 border-b-black active:border-b-white 
        bg-gray-200"
    >
      <div className="p-[0.125rem]">
        <div className="relative border-dotted border p-[0.25rem] text-center text-black">
          <input
            type={type}
            accept={accept}
            multiple
            onChange={onChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 overflow-hidden cursor-pointer"
          />
          {text}
        </div>
      </div>
    </div>
  );
}

export default SystemUpload;

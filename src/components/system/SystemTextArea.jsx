function SystemTextArea({ value, placeholder = "", onChange }) {
  return (
    <div
      className="w-full bg-white p-[0.125rem]
        border-t-1 border-t-gray-300
        border-l-1 border-l-gray-300
        border-r-1 border-r-white
        border-b-1 border-b-white"
    >
      <textarea
        value={value}
        onChange={onChange}
        rows={8}
        placeholder={placeholder}
        className="w-full h-full border border-transparent border-dotted focus:border-gray-400 focus:outline-none p-[0.125rem] resize-vertical"
      />
    </div>
  );
}

export default SystemTextArea;

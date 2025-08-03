function SystemTextInput({ value, placeholder = "OK", onChange }) {
  return (
    <div
      className="w-full bg-white p-[0.125rem]
        border-t-1 border-t-gray-300
        border-l-1 border-l-gray-300
        border-r-1 border-r-white
        border-b-1 border-b-white"
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full border border-transparent border-dotted focus:border-gray-400 focus:outline-none p-[0.125rem]"
      />
    </div>
  );
}

export default SystemTextInput;

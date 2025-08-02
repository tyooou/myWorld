import SystemButton from "./SystemButton";

function SystemPanel({
  children,
  title = "",
  icon = null,
  onMouseDown = () => {},
  style = {},
}) {
  return (
    <div
      style={style}
      className="z-[1000] bg-white text-black select-none border-t-1 border-l-1 border-l-gray-200 border-t-gray-200 border-b-1 border-r-1 border-r-black border-b-black pt-[0.125rem] pb-[0.125rem] pl-[0.125rem] font-[pixel] text-[9px]"
    >
      <div className="bg-gray-200">
        <div className="pr-[0.125rem]">
          <div
            className="p-1 bg-gradient-to-r from-blue-900 to-green-500 text-white font-[pixel] flex justify-between items-center"
            onMouseDown={onMouseDown}
          >
            <span className="font-bold ml-2">{title}</span>
            <SystemButton text={" x "} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default SystemPanel;

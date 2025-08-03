function SystemTabs({ options, setActive, activeTab }) {
  return (
    <div className="flex border-b border-b-gray-500">
      {options.map((tab) => (
        <div
          key={tab}
          onClick={() => setActive(tab)}
          className={`text-[9px] p-1 pl-2 cursor-pointer select-none px-2 border-r border-r-gray-400 ${
            activeTab === tab ? "bg-blue-500 text-white" : ""
          }`}
        >
          <span className="underline">{tab[0]}</span>
          {tab.slice(1)}
        </div>
      ))}
    </div>
  );
}

export default SystemTabs;

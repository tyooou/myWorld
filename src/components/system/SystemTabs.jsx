function SystemTabs({ options, setActive, activeTab }) {
  return (
    <div className="flex space-x-2">
      {options.map((tab) => (
        <div
          key={tab}
          onClick={() => setActive(tab)}
          className={`text-[9px] p-1 cursor-pointer select-none px-2 ${
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

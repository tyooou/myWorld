function Header({ onShowProfile, onShowFriends, }) {
  return (
    <div className="absolute top-0 left-0 w-full bg-gray-200 text-gray-800 flex flex-col z-10 text-[9px] ">
      <div className="bg-gradient-to-r from-blue-900 to-green-500 text-white p-1 font-[pixel]">
        myWorld
      </div>
      <div className="flex space-x-2 p-1 font-[pixel]">
        <button onClick={onShowProfile}>Profile</button>
        <button onClick={onShowFriends}>Friends</button>
        <button></button>
      </div>
    </div>
  );
 }
 
 export default Header;
 
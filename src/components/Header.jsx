function Header({ onShowProfile, onShowFriends, }) {
  return (
    <div className="absolute top-0 left-0 w-full bg-gray-200 text-gray-800 flex flex-col z-10 text-xs font-pixel-arial">
      <div className="bg-gradient-to-r from-blue-900 to-green-500 text-white p-1">
        myWorld
      </div>
      <div className="flex space-x-2 p-1">
        <button onClick={onShowProfile}>Profile</button>
        <button onClick={onShowFriends}>Friends</button>
        <button></button>
      </div>
    </div>
  );
 }
 
 
 export default Header;
 
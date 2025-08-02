import React from 'react';


const friends = [
 {
   name: 'Alice Johnson',
   email: 'alice.j@example.com',
   role: 'Friend',
 },
 {
   name: 'Bob Smith',
   email: 'bob.smith@example.com',
   role: 'Close Friend',
 },
 {
   name: 'Charlie Lee',
   email: 'charlie.lee@example.com',
   role: 'Bestie',
 },
];


export default function FriendsList() {
 return (
   <div className="max-w-md mx-auto bg-white rounded-xl shadow p-4 space-y-4">
     <h2 className="text-xl font-bold text-gray-800 mb-2">Friends</h2>
     {friends.map((friend, idx) => (
       <div key={idx} className="flex items-center gap-4">
         <img
           src={friend.avatar}
           alt={friend.name}
           className="w-12 h-12 rounded-full object-cover"
         />
         <div className="flex-1">
           <p className="font-medium text-gray-800">{friend.name}</p>
           <p className="text-sm text-gray-500">{friend.email}</p>
           <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1 inline-block">
             {friend.role}
           </span>
         </div>
       </div>
     ))}
   </div>
 );
}



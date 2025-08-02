import React from 'react';


export default function Profile() {
 return (
   <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md max-w-md">
     <div className="flex-1">
       <h2 className="text-lg font-semibold text-gray-800">John Doe</h2>
       <p className="text-sm text-gray-500">john.doe@example.com</p>
       <span className="mt-1 inline-block text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5">
         Member
       </span>
     </div>
   </div>
 );
}

import React from 'react';
import { Server, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 py-3 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Server className="text-blue-400" size={24} />
          <h1 className="text-xl font-semibold">Smart City VLAN Manager</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-1 rounded-full hover:bg-gray-700 transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="bg-blue-500 rounded-full p-1">
              <User size={18} />
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
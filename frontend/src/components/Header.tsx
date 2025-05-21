import React from 'react';
import { Bell } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = () => {

  const { vlans } = useNetwork();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md w-full z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          
          <div className="ml-4 flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold">SC</span>
            </div>
            <h1 className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">
              Smart City VLAN Manager
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white cursor-pointer" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </div>
          
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-700 font-medium">A</span>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex items-center overflow-x-auto">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">VLANs:</span>
        {vlans.map(vlan => (
          <div 
            key={vlan.id}
            className="flex items-center px-3 py-1 mr-2 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${vlan.color}20`, color: vlan.color }}
          >
            {vlan.name}
            <span className="ml-1 px-1.5 rounded-full text-white text-xs" style={{ backgroundColor: vlan.color }}>
              {vlan.id}
            </span>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
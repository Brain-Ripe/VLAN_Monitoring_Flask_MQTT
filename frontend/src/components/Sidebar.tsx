import React from 'react';
import { Server } from 'lucide-react';

interface SidebarProps {
  menuItems: {
    id: string;
    label: string;
    icon: React.ReactNode;
  }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Server className="text-blue-400" size={24} />
          <h1 className="text-xl font-bold">VLAN Manager</h1>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-700 rounded-lg p-3">
          <h3 className="font-medium text-sm text-gray-300 mb-2">System Status</h3>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-300">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
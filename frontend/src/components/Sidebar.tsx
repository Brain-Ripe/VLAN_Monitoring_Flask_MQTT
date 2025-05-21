import React from 'react';
import { Home, Network, Shield, Server, Wifi, Wind } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, setActiveTab }) => {
  const { vlans } = useNetwork();

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'network', name: 'Network Topology', icon: Network },
    { id: 'vlans', name: 'VLAN Management', icon: Server },
    { id: 'devices', name: 'Device Management', icon: Wifi },
    { id: 'security', name: 'Security', icon: Shield },
    
  ];

  return (
    <aside className={`fixed top-0 bg-gray-800 text-white h-full z-20 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 md:static`}>
      <div className="h-full overflow-y-auto">
        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Wind className="mr-2" />
            <span>Smart City Network</span>
          </h2>
        </div>
        
        <nav className="mt-4">
          <ul>
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-sm font-medium ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } transition duration-150 ease-in-out`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="px-6 py-4 mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Active VLANs
          </h3>
          <ul className="mt-3 space-y-2">
            {vlans.map(vlan => (
              <li key={vlan.id} className="flex items-center justify-between">
                <span className="text-sm">{vlan.name}</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: vlan.color }}>
                  {vlan.id}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="px-6 py-4 mt-auto border-t border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs font-medium text-gray-400">Network Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
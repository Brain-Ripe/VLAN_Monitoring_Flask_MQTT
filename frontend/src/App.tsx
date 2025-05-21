import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import NetworkTopology from './components/network/NetworkTopology';
import VlanManagement from './components/network/VlanManagement';
import DeviceManagement from './components/network/DeviceManagement';
import { NetworkProvider } from './context/NetworkContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'network':
        return <NetworkTopology />;
      case 'vlans':
        return <VlanManagement />;
      case 'devices':
        return <DeviceManagement />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This section is under development.
            </p>
          </div>
        );
    }
  };

  return (
    <NetworkProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className={`flex-1 overflow-y-auto ${sidebarOpen ? 'md:ml-64' : ''} transition-all duration-300`}>
            {renderContent()}
          </main>
        </div>
      </div>
    </NetworkProvider>
  );
}

export default App;
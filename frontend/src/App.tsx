import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  Server, 
  BarChart3, 
  Settings, 
  Layers, 
  Thermometer, 
  Car, 
  Wind 
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { fetchDevices, fetchVlans, fetchRules, simulateDevice } from './api';

function App() {
  const [devices, setDevices] = useState({});
  const [vlans, setVlans] = useState({});
  const [rules, setRules] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [devicesData, vlansData, rulesData] = await Promise.all([
          fetchDevices(),
          fetchVlans(),
          fetchRules()
        ]);
        
        setDevices(devicesData);
        setVlans(vlansData);
        setRules(rulesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to connect to the backend server. Make sure the Flask server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async (deviceData) => {
    try {
      const result = await simulateDevice(deviceData);
      
      // Update local state with new device data
      setDevices(prev => ({
        ...prev,
        [result.device.data.device_id]: result.device
      }));
      
      // Update VLAN assignments
      if (result.vlan) {
        setVlans(prev => ({
          ...prev,
          [result.device.data.device_id]: result.vlan
        }));
      }
      
      return result;
    } catch (err) {
      console.error('Error simulating device:', err);
      throw err;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity size={20} /> },
    { id: 'devices', label: 'Devices', icon: <Wifi size={20} /> },
    { id: 'vlans', label: 'VLAN Management', icon: <Layers size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar 
        menuItems={menuItems} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-red-300">Connection Error</h3>
              <p className="text-red-200">{error}</p>
              <p className="mt-2 text-red-200">
                Make sure to start the Flask backend with: <code className="bg-red-950 px-2 py-1 rounded">cd backend && python app.py</code>
              </p>
            </div>
          )}
          
          {!loading && !error && (
            <Dashboard 
              activeTab={activeTab}
              devices={devices}
              vlans={vlans}
              rules={rules}
              onSimulate={handleSimulate}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
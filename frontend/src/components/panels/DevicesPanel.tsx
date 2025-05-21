import React, { useState } from 'react';
import { 
  Wifi, 
  Search, 
  Filter, 
  Thermometer, 
  Car, 
  Wind, 
  Camera, 
  AlertTriangle 
} from 'lucide-react';

interface DevicesPanelProps {
  devices: Record<string, any>;
  vlans: Record<string, any>;
  onSimulate: (deviceData: any) => Promise<any>;
}

const DevicesPanel: React.FC<DevicesPanelProps> = ({ devices, vlans, onSimulate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorData, setSimulatorData] = useState({
    device_id: '',
    name: '',
    type: 'sensor',
    temperature: 25,
    traffic: 50,
    airQuality: 100,
    location: 'City Center'
  });
  
  const getDeviceIcon = (device) => {
    const type = device.topic.split('/')[1] || '';
    
    if (type.includes('traffic') || device.data.traffic) {
      return <Car size={20} className="text-yellow-400" />;
    } else if (type.includes('environment') || device.data.temperature) {
      return <Thermometer size={20} className="text-red-400" />;
    } else if (type.includes('security') || device.data.camera) {
      return <Camera size={20} className="text-purple-400" />;
    } else {
      return <Wifi size={20} className="text-blue-400" />;
    }
  };
  
  const getDeviceType = (device) => {
    if (device.data.traffic) return 'Traffic';
    if (device.data.temperature) return 'Environment';
    if (device.data.camera) return 'Security';
    return device.topic.split('/')[1] || 'Unknown';
  };
  
  const filteredDevices = Object.entries(devices).filter(([id, device]) => {
    const matchesSearch = id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (device.data.name && device.data.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    
    const type = getDeviceType(device).toLowerCase();
    return matchesSearch && type.includes(filterType.toLowerCase());
  });
  
  const handleSimulatorChange = (e) => {
    const { name, value } = e.target;
    setSimulatorData(prev => ({
      ...prev,
      [name]: name === 'temperature' || name === 'traffic' || name === 'airQuality' 
        ? parseInt(value) 
        : value
    }));
  };
  
  const handleSimulate = async () => {
    try {
      await onSimulate(simulatorData);
      setShowSimulator(false);
      setSimulatorData({
        device_id: '',
        name: '',
        type: 'sensor',
        temperature: 25,
        traffic: 50,
        airQuality: 100,
        location: 'City Center'
      });
    } catch (err) {
      console.error('Error simulating device:', err);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">Device Management</h2>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="traffic">Traffic</option>
            <option value="environment">Environment</option>
            <option value="security">Security</option>
          </select>
          
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {showSimulator ? 'Cancel' : 'Add Device'}
          </button>
        </div>
      </div>
      
      {showSimulator && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Device Simulator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Device ID</label>
              <input
                type="text"
                name="device_id"
                value={simulatorData.device_id}
                onChange={handleSimulatorChange}
                placeholder="Leave empty for auto-generated ID"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Device Name</label>
              <input
                type="text"
                name="name"
                value={simulatorData.name}
                onChange={handleSimulatorChange}
                placeholder="e.g., Traffic Sensor 1"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
              <select
                name="type"
                value={simulatorData.type}
                onChange={handleSimulatorChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sensor">Generic Sensor</option>
                <option value="traffic">Traffic</option>
                <option value="environment">Environment</option>
                <option value="security">Security</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={simulatorData.location}
                onChange={handleSimulatorChange}
                placeholder="e.g., Main Street"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Temperature ({simulatorData.temperature}°C)
              </label>
              <input
                type="range"
                name="temperature"
                min="0"
                max="50"
                value={simulatorData.temperature}
                onChange={handleSimulatorChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Traffic Level ({simulatorData.traffic}%)
              </label>
              <input
                type="range"
                name="traffic"
                min="0"
                max="100"
                value={simulatorData.traffic}
                onChange={handleSimulatorChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Air Quality ({simulatorData.airQuality} AQI)
              </label>
              <input
                type="range"
                name="airQuality"
                min="0"
                max="300"
                value={simulatorData.airQuality}
                onChange={handleSimulatorChange}
                className="w-full"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={handleSimulate}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Simulate Device
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-4 py-3 font-semibold">Device ID</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">VLAN</th>
                <th className="px-4 py-3 font-semibold">Last Seen</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map(([id, device]) => (
                <tr key={id} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(device)}
                      <div>
                        <div className="font-medium">{device.data.name || id}</div>
                        <div className="text-xs text-gray-400">{id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getDeviceType(device)}</td>
                  <td className="px-4 py-3">
                    {vlans[id] ? (
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                        VLAN {vlans[id].vlan_id}
                      </span>
                    ) : (
                      <span className="bg-gray-600/50 text-gray-400 px-2 py-1 rounded text-xs">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(device.timestamp * 1000).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Active</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {device.data.temperature && (
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full text-xs flex items-center">
                          <Thermometer size={12} className="mr-1" />
                          {device.data.temperature}°C
                        </span>
                      )}
                      {device.data.traffic && (
                        <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full text-xs flex items-center">
                          <Car size={12} className="mr-1" />
                          {device.data.traffic}%
                        </span>
                      )}
                      {device.data.airQuality && (
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs flex items-center">
                          <Wind size={12} className="mr-1" />
                          {device.data.airQuality} AQI
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredDevices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No devices found. Try adding a device using the simulator.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DevicesPanel;
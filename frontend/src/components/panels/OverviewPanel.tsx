import React from 'react';
import { 
  Layers, 
  Wifi, 
  AlertTriangle, 
  Clock, 
  Thermometer,
  Car,
  Wind
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OverviewPanelProps {
  devices: Record<string, any>;
  vlans: Record<string, any>;
  onSimulate: (deviceData: any) => Promise<any>;
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({ devices, vlans, onSimulate }) => {
  const deviceCount = Object.keys(devices).length;
  const vlanCount = new Set(Object.values(vlans).map(v => v.vlan_id)).size;
  
  // Count devices by type
  const deviceTypes = Object.values(devices).reduce((acc, device) => {
    const type = device.topic.split('/')[1] || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  // Count VLANs by ID
  const vlanDistribution = Object.values(vlans).reduce((acc, vlan) => {
    acc[vlan.vlan_id] = (acc[vlan.vlan_id] || 0) + 1;
    return acc;
  }, {});
  
  // Prepare chart data
  const chartData = {
    labels: Object.keys(vlanDistribution).map(id => `VLAN ${id}`),
    datasets: [
      {
        label: 'Devices per VLAN',
        data: Object.values(vlanDistribution),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'VLAN Distribution',
        color: 'white',
      },
    },
    scales: {
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.7)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  const handleSimulateTraffic = async () => {
    const trafficLevel = Math.floor(Math.random() * 100);
    await onSimulate({
      device_id: `traffic-sensor-${Math.floor(Math.random() * 1000)}`,
      name: "Traffic Sensor",
      type: "traffic",
      traffic: trafficLevel,
      location: "Main Street",
      battery: 85
    });
  };

  const handleSimulateEnvironment = async () => {
    const temperature = Math.floor(15 + Math.random() * 25);
    await onSimulate({
      device_id: `env-sensor-${Math.floor(Math.random() * 1000)}`,
      name: "Environment Sensor",
      type: "environment",
      temperature: temperature,
      humidity: Math.floor(30 + Math.random() * 50),
      airQuality: Math.floor(50 + Math.random() * 150),
      location: "City Park"
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Devices</p>
              <h3 className="text-2xl font-bold">{deviceCount}</h3>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <Wifi className="text-blue-400" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active VLANs</p>
              <h3 className="text-2xl font-bold">{vlanCount}</h3>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <Layers className="text-purple-400" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Last Update</p>
              <h3 className="text-lg font-bold">{new Date().toLocaleTimeString()}</h3>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <Clock className="text-green-400" size={24} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">VLAN Distribution</h3>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Simulate Devices</h3>
          <div className="space-y-3">
            <button
              onClick={handleSimulateTraffic}
              className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Car size={20} className="text-yellow-400" />
                <span>Traffic Sensor</span>
              </div>
              <span className="text-xs bg-gray-600 px-2 py-1 rounded">Add</span>
            </button>
            
            <button
              onClick={handleSimulateEnvironment}
              className="w-full flex items-center justify-between bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Thermometer size={20} className="text-red-400" />
                <span>Environment Sensor</span>
              </div>
              <span className="text-xs bg-gray-600 px-2 py-1 rounded">Add</span>
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Recent Activity</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {Object.entries(devices).slice(-3).reverse().map(([id, device]) => (
                <div key={id} className="text-xs bg-gray-700/50 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{device.data.name || id}</span>
                    <span className="text-gray-400">{new Date(device.timestamp * 1000).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-gray-400 mt-1">
                    VLAN: {vlans[id]?.vlan_id || 'Unassigned'}
                  </div>
                </div>
              ))}
              
              {Object.keys(devices).length === 0 && (
                <div className="text-xs text-gray-500 italic">
                  No device activity yet. Try simulating a device.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Recent VLAN Assignments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="pb-2">Device ID</th>
                <th className="pb-2">VLAN</th>
                <th className="pb-2">Assigned At</th>
                <th className="pb-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(vlans).slice(-5).reverse().map(([deviceId, vlan]) => {
                const device = devices[deviceId];
                return (
                  <tr key={deviceId} className="border-b border-gray-700/50">
                    <td className="py-3">{deviceId}</td>
                    <td className="py-3">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        VLAN {vlan.vlan_id}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(vlan.timestamp * 1000).toLocaleTimeString()}
                    </td>
                    <td className="py-3">
                      {device?.topic.split('/')[1] || 'unknown'}
                    </td>
                  </tr>
                );
              })}
              
              {Object.keys(vlans).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500 italic">
                    No VLAN assignments yet. Try simulating a device.
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

export default OverviewPanel;
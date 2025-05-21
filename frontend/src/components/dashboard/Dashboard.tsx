import React from 'react';
import { Cpu, Wifi, AlertTriangle, Clock, Activity } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import StatusCard from './StatusCard';
import VlanUsageChart from './VlanUsageChart';
import DeviceStatusChart from './DeviceStatusChart';
import TrafficTrend from './TrafficTrend';

const Dashboard: React.FC = () => {
  const { devices } = useNetwork();
  
  // Calculate device status counts
  const onlineCount = devices.filter(d => d.status === 'online').length;
  const offlineCount = devices.filter(d => d.status === 'offline').length;
  const warningCount = devices.filter(d => d.status === 'warning').length;
  const maintenanceCount = devices.filter(d => d.status === 'maintenance').length;
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300">Smart City Network Overview</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="Online Devices"
          value={onlineCount}
          change={{ value: 2.5, isPositive: true }}
          icon={Wifi}
          color="text-green-500"
          bgColor="bg-green-100 dark:bg-green-900 dark:bg-opacity-20"
        />
        
        <StatusCard
          title="Offline Devices"
          value={offlineCount}
          change={{ value: 0.8, isPositive: false }}
          icon={Cpu}
          color="text-red-500"
          bgColor="bg-red-100 dark:bg-red-900 dark:bg-opacity-20"
        />
        
        <StatusCard
          title="Warning Devices"
          value={warningCount}
          change={{ value: 1.2, isPositive: false }}
          icon={AlertTriangle}
          color="text-amber-500"
          bgColor="bg-amber-100 dark:bg-amber-900 dark:bg-opacity-20"
        />
        
        <StatusCard
          title="Maintenance Devices"
          value={maintenanceCount}
          change={{ value: 0, isPositive: true }}
          icon={Clock}
          color="text-gray-500"
          bgColor="bg-gray-100 dark:bg-gray-700"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Network Traffic Trends
          </h3>
          <TrafficTrend />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Wifi className="h-5 w-5 mr-2 text-blue-500" />
            Device Status Distribution
          </h3>
          <DeviceStatusChart />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">VLAN Usage</h3>
        <VlanUsageChart />
      </div>
    </div>
  );
};

export default Dashboard;
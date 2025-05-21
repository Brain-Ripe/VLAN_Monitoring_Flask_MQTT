import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { Search, Filter, Edit, Trash, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

const DeviceManagement: React.FC = () => {
  const { devices, vlans } = useNetwork();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vlanFilter, setVlanFilter] = useState<number | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'maintenance': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  const getVlanById = (id: number) => {
    return vlans.find(vlan => vlan.id === id);
  };

  const getDeviceTypeLabel = (type: string) => {
    switch (type) {
      case 'router': return 'Router';
      case 'switch': return 'Switch';
      case 'accessPoint': return 'Access Point';
      case 'sensor': return 'Sensor';
      case 'camera': return 'Camera';
      case 'controller': return 'Controller';
      default: return type;
    }
  };

  // Apply filters
  const filteredDevices = devices.filter(device => {
    // Search filter
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    
    // VLAN filter
    const matchesVlan = vlanFilter === 'all' || device.vlanId === vlanFilter;
    
    // Type filter
    const matchesType = typeFilter === 'all' || device.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesVlan && matchesType;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Device Management</h2>
        <p className="text-gray-600 dark:text-gray-300">Monitor and manage network devices</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="warning">Warning</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">VLAN</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={vlanFilter}
              onChange={(e) => setVlanFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            >
              <option value="all">All VLANs</option>
              {vlans.map(vlan => (
                <option key={vlan.id} value={vlan.id}>VLAN {vlan.id} - {vlan.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Device Type</label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="router">Router</option>
              <option value="switch">Switch</option>
              <option value="accessPoint">Access Point</option>
              <option value="sensor">Sensor</option>
              <option value="camera">Camera</option>
              <option value="controller">Controller</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Filter className="h-4 w-4" />
            <span>
              {filteredDevices.length} {filteredDevices.length === 1 ? 'device' : 'devices'} found
            </span>
          </div>
          
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
            Add New Device
          </button>
        </div>
        
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Device Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">VLAN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDevices.map(device => {
                const vlan = getVlanById(device.vlanId);
                
                return (
                  <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{device.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {getDeviceTypeLabel(device.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(device.status)}
                        <span className={`ml-1.5 text-sm capitalize
                          ${device.status === 'online' ? 'text-green-600 dark:text-green-400' : ''}
                          ${device.status === 'offline' ? 'text-red-600 dark:text-red-400' : ''}
                          ${device.status === 'warning' ? 'text-amber-600 dark:text-amber-400' : ''}
                          ${device.status === 'maintenance' ? 'text-gray-600 dark:text-gray-400' : ''}
                        `}>
                          {device.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {device.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vlan && (
                        <div className="flex items-center">
                          <div 
                            className="h-2.5 w-2.5 rounded-full mr-2"
                            style={{ backgroundColor: vlan.color }}
                          ></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {vlan.name} ({vlan.id})
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {device.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredDevices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No devices found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceManagement;
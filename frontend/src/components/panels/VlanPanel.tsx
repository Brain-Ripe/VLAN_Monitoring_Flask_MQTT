import React, { useState } from 'react';
import { Layers, Info, AlertTriangle } from 'lucide-react';

interface VlanPanelProps {
  vlans: Record<string, any>;
  devices: Record<string, any>;
  rules: Record<string, any>;
}

const VlanPanel: React.FC<VlanPanelProps> = ({ vlans, devices, rules }) => {
  const [selectedVlan, setSelectedVlan] = useState<number | null>(null);
  
  // Group devices by VLAN
  const vlanGroups = Object.entries(vlans).reduce((acc, [deviceId, vlan]) => {
    const vlanId = vlan.vlan_id;
    if (!acc[vlanId]) {
      acc[vlanId] = [];
    }
    acc[vlanId].push({ deviceId, ...vlan });
    return acc;
  }, {});
  
  // Get unique VLAN IDs
  const uniqueVlans = Object.keys(vlanGroups).map(Number).sort((a, b) => a - b);
  
  // Get VLAN color based on ID
  const getVlanColor = (vlanId) => {
    const colors = {
      10: 'blue',
      20: 'green',
      30: 'yellow',
      40: 'purple',
      50: 'pink',
      60: 'indigo',
      70: 'red',
      80: 'orange',
      90: 'teal',
      100: 'gray'
    };
    
    return colors[vlanId] || 'blue';
  };
  
  // Get rule description for a VLAN
  const getVlanRuleDescription = (vlanId) => {
    for (const [param, levels] of Object.entries(rules)) {
      for (const [level, rule] of Object.entries(levels)) {
        if (rule.vlan === vlanId) {
          return `${param} ${level} (${rule.threshold}+)`;
        }
      }
    }
    return 'Default assignment';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">VLAN Management</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Layers className="mr-2" size={20} />
            Active VLANs
          </h3>
          
          <div className="space-y-2">
            {uniqueVlans.length > 0 ? (
              uniqueVlans.map(vlanId => {
                const deviceCount = vlanGroups[vlanId].length;
                const color = getVlanColor(vlanId);
                const colorClasses = {
                  blue: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
                  green: 'bg-green-500/20 border-green-500/30 text-green-300',
                  yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
                  purple: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
                  pink: 'bg-pink-500/20 border-pink-500/30 text-pink-300',
                  indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
                  red: 'bg-red-500/20 border-red-500/30 text-red-300',
                  orange: 'bg-orange-500/20 border-orange-500/30 text-orange-300',
                  teal: 'bg-teal-500/20 border-teal-500/30 text-teal-300',
                  gray: 'bg-gray-500/20 border-gray-500/30 text-gray-300'
                };
                
                return (
                  <button
                    key={vlanId}
                    onClick={() => setSelectedVlan(selectedVlan === vlanId ? null : vlanId)}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors ${
                      selectedVlan === vlanId
                        ? `${colorClasses[color]} border-2`
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full bg-${color}-500`}></div>
                      <span>VLAN {vlanId}</span>
                    </div>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                      {deviceCount} {deviceCount === 1 ? 'device' : 'devices'}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="text-gray-500 text-center py-4">
                No active VLANs. Add devices to see VLAN assignments.
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700">
            <h4 className="text-sm font-medium text-gray-400 mb-3">VLAN Assignment Rules</h4>
            <div className="space-y-2">
              {Object.entries(rules).map(([param, levels]) => (
                <div key={param} className="bg-gray-700 rounded-lg p-3">
                  <h5 className="font-medium mb-2 capitalize">{param}</h5>
                  <div className="space-y-1 text-sm">
                    {Object.entries(levels).map(([level, rule]) => (
                      <div key={level} className="flex justify-between">
                        <span className="text-gray-400 capitalize">{level}:</span>
                        <div>
                          <span className="text-gray-300">{rule.threshold}+</span>
                          <span className="ml-2 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs">
                            VLAN {rule.vlan}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">
            {selectedVlan !== null 
              ? `VLAN ${selectedVlan} Devices` 
              : 'Select a VLAN to view devices'}
          </h3>
          
          {selectedVlan !== null ? (
            <>
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info size={18} className="text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium">VLAN {selectedVlan} Assignment Rule</h4>
                    <p className="text-sm text-gray-400">
                      {getVlanRuleDescription(selectedVlan)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-700">
                      <th className="pb-2 font-medium">Device ID</th>
                      <th className="pb-2 font-medium">Name</th>
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Assignment Time</th>
                      <th className="pb-2 font-medium">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vlanGroups[selectedVlan]?.map(vlan => {
                      const device = devices[vlan.deviceId];
                      if (!device) return null;
                      
                      return (
                        <tr key={vlan.deviceId} className="border-b border-gray-700/50">
                          <td className="py-3">{vlan.deviceId}</td>
                          <td className="py-3">{device.data.name || 'Unnamed'}</td>
                          <td className="py-3">{device.topic.split('/')[1] || 'unknown'}</td>
                          <td className="py-3 text-gray-400">
                            {new Date(vlan.timestamp * 1000).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(device.data).filter(([key]) => 
                                !['device_id', 'name', 'type', 'location'].includes(key)
                              ).map(([key, value]) => (
                                <span key={key} className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Layers size={48} className="mb-4 opacity-50" />
              <p>Select a VLAN from the list to view assigned devices</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">VLAN Network Topology</h3>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 flex items-center justify-center bg-blue-500/20 border border-blue-500/30 rounded-lg mb-4">
              <Server size={48} className="text-blue-400" />
            </div>
            <div className="text-center mb-6">
              <h4 className="font-medium">Core Router</h4>
              <p className="text-sm text-gray-400">192.168.1.1</p>
            </div>
            
            <div className="w-full border-t border-gray-600 mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {uniqueVlans.slice(0, 6).map(vlanId => {
                const color = getVlanColor(vlanId);
                const deviceCount = vlanGroups[vlanId].length;
                
                return (
                  <div key={vlanId} className="flex flex-col items-center">
                    <div className={`w-16 h-16 flex items-center justify-center bg-${color}-500/20 border border-${color}-500/30 rounded-lg mb-3`}>
                      <Layers size={32} className={`text-${color}-400`} />
                    </div>
                    <h4 className="font-medium">VLAN {vlanId}</h4>
                    <p className="text-sm text-gray-400">{deviceCount} devices</p>
                    
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {vlanGroups[vlanId].slice(0, 3).map(vlan => (
                        <div key={vlan.deviceId} className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                          {vlan.deviceId.substring(0, 2)}
                        </div>
                      ))}
                      {deviceCount > 3 && (
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                          +{deviceCount - 3}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VlanPanel;
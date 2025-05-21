import React, { useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { Edit, Trash, Plus, Check, X, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

const VlanManagement: React.FC = () => {
  const { vlans, devices } = useNetwork();
  const [editingVlanId, setEditingVlanId] = useState<number | null>(null);

  const getDeviceCountByVlanId = (vlanId: number) => {
    return devices.filter(device => device.vlanId === vlanId).length;
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'high': return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case 'medium': return <ShieldCheck className="h-4 w-4 text-blue-500" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">VLAN Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage and configure Virtual LANs</p>
        </div>
        
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          Create VLAN
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subnet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Devices</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Traffic Load</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Security</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {vlans.map(vlan => (
                <tr key={vlan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-full text-white"
                      style={{ backgroundColor: vlan.color }}
                    >
                      {vlan.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingVlanId === vlan.id ? (
                      <input 
                        type="text" 
                        className="w-full px-2 py-1 border rounded" 
                        defaultValue={vlan.name}
                      />
                    ) : (
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2"
                          style={{ backgroundColor: vlan.color }}
                        ></div>
                        <span className="font-medium text-gray-900 dark:text-white">{vlan.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {editingVlanId === vlan.id ? (
                      <input 
                        type="text" 
                        className="w-full px-2 py-1 border rounded" 
                        defaultValue={vlan.subnet}
                      />
                    ) : vlan.subnet}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {getDeviceCountByVlanId(vlan.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${vlan.trafficLoad}%`, 
                            backgroundColor: vlan.trafficLoad > 80 ? '#EF4444' : vlan.color 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{vlan.trafficLoad}%</span>
                      {vlan.trafficLoad > 80 && (
                        <Zap className="ml-1 h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingVlanId === vlan.id ? (
                      <select className="w-full px-2 py-1 border rounded" defaultValue={vlan.securityLevel}>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    ) : (
                      <div className="flex items-center">
                        {getSecurityIcon(vlan.securityLevel)}
                        <span className="ml-1 capitalize text-sm text-gray-600 dark:text-gray-400">
                          {vlan.securityLevel}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {editingVlanId === vlan.id ? (
                      <input 
                        type="text" 
                        className="w-full px-2 py-1 border rounded" 
                        defaultValue={vlan.department}
                      />
                    ) : vlan.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingVlanId === vlan.id ? (
                      <div className="flex space-x-2 justify-end">
                        <button className="p-1 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setEditingVlanId(null)}
                          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2 justify-end">
                        <button 
                          onClick={() => setEditingVlanId(vlan.id)}
                          className="p-1 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">VLAN Configuration Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
              <p>Separate critical infrastructure into high-security VLANs</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
              <p>Implement proper access control between VLANs</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
              <p>Monitor traffic loads and adjust network resources accordingly</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">•</div>
              <p>Regularly audit VLAN security settings and policies</p>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">VLAN Traffic Alerts</h3>
          <div className="space-y-4">
            {vlans
              .filter(vlan => vlan.trafficLoad > 70)
              .map(vlan => (
                <div key={vlan.id} className="flex items-center p-3 rounded-lg bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-100 dark:border-red-800">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      High traffic on VLAN {vlan.id} ({vlan.name})
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Current load: {vlan.trafficLoad}% - Consider load balancing or expansion
                    </p>
                  </div>
                </div>
              ))}
            
            {vlans.filter(vlan => vlan.trafficLoad > 70).length === 0 && (
              <div className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border border-green-100 dark:border-green-800">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  All VLANs are operating within normal traffic parameters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VlanManagement;
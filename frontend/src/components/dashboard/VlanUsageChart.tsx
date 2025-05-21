import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { vlanDistributionData } from '../../utils/mockData';

const VlanUsageChart: React.FC = () => {
  const { vlans } = useNetwork();

  return (
    <div className="relative">
      <div className=" flex items-end space-x-2">
        {vlanDistributionData.datasets[0].data.map((value, index) => {
          const vlan = vlans[index];
          const percentage = (value / Math.max(...vlanDistributionData.datasets[0].data)) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-t-md transition-all duration-500 ease-in-out hover:opacity-90"
                style={{ 
                  height: `${percentage}%`, 
                  backgroundColor: vlan.color,
                  minHeight: '10%'
                }}
              ></div>
              <div 
                className="w-full text-center mt-2 py-1 px-2 rounded text-xs font-medium truncate"
                style={{ color: vlan.color }}
              >
                VLAN {vlan.id}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {vlans.map(vlan => (
          <div key={vlan.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: vlan.color }}>{vlan.name}</span>
              <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: vlan.color }}>
                {vlan.id}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
              <span>{vlan.devices.length} devices</span>
              <span>{vlan.subnet}</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className="h-2 rounded-full" 
                style={{ 
                  width: `${vlan.trafficLoad}%`, 
                  backgroundColor: vlan.color 
                }}
              ></div>
            </div>
            <div className="mt-1 flex justify-between text-xs">
              <span>Load: {vlan.trafficLoad}%</span>
              <span className="capitalize">{vlan.securityLevel} security</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VlanUsageChart;
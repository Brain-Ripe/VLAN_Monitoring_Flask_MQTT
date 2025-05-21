import React from 'react';
import { useNetwork } from '../../context/NetworkContext';


const DeviceStatusChart: React.FC = () => {
  const { devices } = useNetwork();
  
  // Calculate percentages
  const total = devices.length;
  const statuses = [
    { 
      name: 'Online', 
      count: devices.filter(d => d.status === 'online').length,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    { 
      name: 'Offline', 
      count: devices.filter(d => d.status === 'offline').length,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    },
    { 
      name: 'Warning', 
      count: devices.filter(d => d.status === 'warning').length,
      color: 'bg-amber-500',
      textColor: 'text-amber-500'
    },
    { 
      name: 'Maintenance', 
      count: devices.filter(d => d.status === 'maintenance').length,
      color: 'bg-gray-500',
      textColor: 'text-gray-500'
    }
  ];

  // Calculate percentages and create the donut chart
  return (
    <div className="flex flex-col items-center md:flex-row md:items-start md:justify-around">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {/* Create a donut chart with SVG */}
          <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="3.8"></circle>
          
          {statuses.map((status, i) => {
            const percentage = (status.count / total) * 100;
            // Calculate the dash array and offset for each segment
            const dashArray = 2 * Math.PI * 15.915;
            let dashOffset = dashArray;
            
            // Accumulate previous segments' percentages
            for (let j = 0; j < i; j++) {
              dashOffset -= (statuses[j].count / total) * dashArray;
            }
            
            return (
              <circle 
                key={status.name}
                cx="18" 
                cy="18" 
                r="15.915" 
                fill="none" 
                stroke={status.color.replace('bg-', 'text-')} 
                strokeWidth="3.8"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset - (percentage / 100) * dashArray}
                // Rotate to start from the top
                className="stroke-current origin-center -rotate-90 transform"
              ></circle>
            );
          })}
          
          <text x="18" y="21" textAnchor="middle" className="text-[15px] font-bold fill-current text-gray-800 dark:text-white">
            {total}
          </text>
          <text x="18" y="26" textAnchor="middle" className="text-[5px] fill-current text-gray-500 dark:text-gray-400">
            devices
          </text>
        </svg>
      </div>
      
      <div className="mt-6 md:mt-0 grid grid-cols-2 gap-4">
        {statuses.map(status => (
          <div key={status.name} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${status.color} mr-2`}></div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{status.name}</p>
              <p className={`text-lg font-semibold ${status.textColor}`}>
                {status.count} <span className="text-xs text-gray-500">({((status.count / total) * 100).toFixed(1)}%)</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceStatusChart;
import React, { useMemo } from 'react';
import { BarChart3, PieChart, LineChart, Activity } from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AnalyticsPanelProps {
  devices: Record<string, any>;
  vlans: Record<string, any>;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ devices, vlans }) => {
  // Prepare data for charts
  const vlanDistribution = useMemo(() => {
    const distribution = {};
    
    Object.values(vlans).forEach(vlan => {
      const vlanId = vlan.vlan_id;
      distribution[vlanId] = (distribution[vlanId] || 0) + 1;
    });
    
    return {
      labels: Object.keys(distribution).map(id => `VLAN ${id}`),
      datasets: [
        {
          label: 'Devices per VLAN',
          data: Object.values(distribution),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [vlans]);
  
  const deviceTypeDistribution = useMemo(() => {
    const distribution = {};
    
    Object.values(devices).forEach(device => {
      let type = 'Unknown';
      
      if (device.data.traffic) type = 'Traffic';
      else if (device.data.temperature) type = 'Environment';
      else if (device.data.camera) type = 'Security';
      else type = device.topic.split('/')[1] || 'Unknown';
      
      distribution[type] = (distribution[type] || 0) + 1;
    });
    
    return {
      labels: Object.keys(distribution),
      datasets: [
        {
          label: 'Device Types',
          data: Object.values(distribution),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [devices]);
  
  const temperatureData = useMemo(() => {
    const tempDevices = Object.values(devices)
      .filter(device => device.data.temperature)
      .sort((a, b) => a.timestamp - b.timestamp);
    
    return {
      labels: tempDevices.map(device => 
        new Date(device.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      ),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: tempDevices.map(device => device.data.temperature),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [devices]);
  
  const trafficData = useMemo(() => {
    const trafficDevices = Object.values(devices)
      .filter(device => device.data.traffic)
      .sort((a, b) => a.timestamp - b.timestamp);
    
    return {
      labels: trafficDevices.map(device => 
        new Date(device.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      ),
      datasets: [
        {
          label: 'Traffic Level (%)',
          data: trafficDevices.map(device => device.data.traffic),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [devices]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      title: {
        display: true,
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
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold">VLAN Distribution</h3>
          </div>
          <div className="h-64">
            {Object.keys(vlans).length > 0 ? (
              <Pie data={vlanDistribution} options={pieOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No VLAN data available
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart size={20} className="text-green-400" />
            <h3 className="text-lg font-semibold">Device Type Distribution</h3>
          </div>
          <div className="h-64">
            {Object.keys(devices).length > 0 ? (
              <Pie data={deviceTypeDistribution} options={pieOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No device data available
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <LineChart size={20} className="text-red-400" />
            <h3 className="text-lg font-semibold">Temperature Trends</h3>
          </div>
          <div className="h-64">
            {temperatureData.labels.length > 0 ? (
              <Line data={temperatureData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No temperature data available
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <LineChart size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold">Traffic Level Trends</h3>
          </div>
          <div className="h-64">
            {trafficData.labels.length > 0 ? (
              <Line data={trafficData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No traffic data available
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 size={20} className="text-purple-400" />
          <h3 className="text-lg font-semibold">VLAN Assignment Analytics</h3>
        </div>
        
        <div className="h-80">
          <Bar 
            data={vlanDistribution} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: {
                  ...chartOptions.plugins.title,
                  text: 'Devices per VLAN',
                },
              },
            }} 
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Most Used VLAN</h4>
            {Object.keys(vlans).length > 0 ? (
              (() => {
                const vlanCounts = {};
                Object.values(vlans).forEach(vlan => {
                  vlanCounts[vlan.vlan_id] = (vlanCounts[vlan.vlan_id] || 0) + 1;
                });
                
                const mostUsedVlanId = Object.entries(vlanCounts)
                  .sort((a, b) => b[1] - a[1])[0][0];
                
                return (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">VLAN {mostUsedVlanId}</span>
                    </div>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                      {vlanCounts[mostUsedVlanId]} devices
                    </span>
                  </div>
                );
              })()
            ) : (
              <div className="text-gray-500 text-sm">No data available</div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Most Common Device Type</h4>
            {Object.keys(devices).length > 0 ? (
              (() => {
                const typeCounts = {};
                Object.values(devices).forEach(device => {
                  let type = 'Unknown';
                  
                  if (device.data.traffic) type = 'Traffic';
                  else if (device.data.temperature) type = 'Environment';
                  else if (device.data.camera) type = 'Security';
                  else type = device.topic.split('/')[1] || 'Unknown';
                  
                  typeCounts[type] = (typeCounts[type] || 0) + 1;
                });
                
                const mostCommonType = Object.entries(typeCounts)
                  .sort((a, b) => b[1] - a[1])[0];
                
                return (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">{mostCommonType[0]}</span>
                    </div>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                      {mostCommonType[1]} devices
                    </span>
                  </div>
                );
              })()
            ) : (
              <div className="text-gray-500 text-sm">No data available</div>
            )}
          </div>
          
          <div className="bg-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Latest Assignment</h4>
            {Object.keys(vlans).length > 0 ? (
              (() => {
                const latestVlan = Object.entries(vlans)
                  .sort((a, b) => b[1].timestamp - a[1].timestamp)[0];
                
                const deviceId = latestVlan[0];
                const vlanData = latestVlan[1];
                const device = devices[deviceId];
                
                return (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate max-w-[150px]">
                        {device?.data.name || deviceId}
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                        VLAN {vlanData.vlan_id}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(vlanData.timestamp * 1000).toLocaleString()}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-gray-500 text-sm">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
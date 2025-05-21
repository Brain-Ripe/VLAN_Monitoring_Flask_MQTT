import React from 'react';
import DevicesPanel from './panels/DevicesPanel';
import VlanPanel from './panels/VlanPanel';
import AnalyticsPanel from './panels/AnalyticsPanel';
import SettingsPanel from './panels/SettingsPanel';
import OverviewPanel from './panels/OverviewPanel';

interface DashboardProps {
  activeTab: string;
  devices: Record<string, any>;
  vlans: Record<string, any>;
  rules: Record<string, any>;
  onSimulate: (deviceData: any) => Promise<any>;
}

const Dashboard: React.FC<DashboardProps> = ({
  activeTab,
  devices,
  vlans,
  rules,
  onSimulate
}) => {
  const renderPanel = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <OverviewPanel 
            devices={devices} 
            vlans={vlans} 
            onSimulate={onSimulate} 
          />
        );
      case 'devices':
        return (
          <DevicesPanel 
            devices={devices} 
            vlans={vlans} 
            onSimulate={onSimulate} 
          />
        );
      case 'vlans':
        return (
          <VlanPanel 
            vlans={vlans} 
            devices={devices} 
            rules={rules} 
          />
        );
      case 'analytics':
        return (
          <AnalyticsPanel 
            devices={devices} 
            vlans={vlans} 
          />
        );
      case 'settings':
        return (
          <SettingsPanel 
            rules={rules} 
          />
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="h-full">
      {renderPanel()}
    </div>
  );
};

export default Dashboard;
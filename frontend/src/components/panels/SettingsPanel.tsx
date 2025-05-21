import React, { useState } from 'react';
import { Settings, Save, AlertTriangle } from 'lucide-react';
import { updateRules } from '../../api';

interface SettingsPanelProps {
  rules: Record<string, any>;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ rules }) => {
  const [editedRules, setEditedRules] = useState(rules);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const handleRuleChange = (
    parameter: string,
    level: string,
    field: 'threshold' | 'vlan',
    value: number
  ) => {
    setEditedRules(prev => ({
      ...prev,
      [parameter]: {
        ...prev[parameter],
        [level]: {
          ...prev[parameter][level],
          [field]: value
        }
      }
    }));
  };
  
  const handleSaveRules = async () => {
    try {
      setIsSaving(true);
      setSaveStatus(null);
      
      await updateRules(editedRules);
      
      setSaveStatus({
        success: true,
        message: 'VLAN assignment rules updated successfully'
      });
    } catch (error) {
      console.error('Error saving rules:', error);
      setSaveStatus({
        success: false,
        message: 'Failed to update rules. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <Settings className="mr-2" size={24} />
          System Settings
        </h2>
        
        <button
          onClick={handleSaveRules}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
      
      {saveStatus && (
        <div className={`p-4 rounded-lg ${
          saveStatus.success ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
        }`}>
          <div className="flex items-center space-x-2">
            {saveStatus.success ? (
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            ) : (
              <AlertTriangle size={16} className="text-red-400" />
            )}
            <span className={saveStatus.success ? 'text-green-300' : 'text-red-300'}>
              {saveStatus.message}
            </span>
          </div>
        </div>
      )}
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">VLAN Assignment Rules</h3>
        <p className="text-gray-400 mb-6">
          Configure the thresholds and VLAN assignments for different parameters. 
          These rules determine how devices are automatically assigned to VLANs based on their data.
        </p>
        
        {Object.entries(editedRules).map(([parameter, levels]) => (
          <div key={parameter} className="mb-8">
            <h4 className="text-md font-medium mb-3 capitalize border-b border-gray-700 pb-2">
              {parameter} Parameters
            </h4>
            
            <div className="space-y-4">
              {Object.entries(levels).map(([level, rule]) => (
                <div key={level} className="bg-gray-700 p-4 rounded-lg">
                  <h5 className="font-medium mb-3 capitalize flex items-center">
                    <span className={`h-3 w-3 rounded-full mr-2 ${
                      level === 'high' ? 'bg-red-500' : 
                      level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></span>
                    {level} {parameter}
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Threshold Value
                      </label>
                      <input
                        type="number"
                        value={rule.threshold}
                        onChange={(e) => handleRuleChange(
                          parameter, 
                          level, 
                          'threshold', 
                          parseInt(e.target.value)
                        )}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Values {level === 'high' ? 'above' : 'between'} this threshold will be assigned to this VLAN
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Assign to VLAN
                      </label>
                      <input
                        type="number"
                        value={rule.vlan}
                        onChange={(e) => handleRuleChange(
                          parameter, 
                          level, 
                          'vlan', 
                          parseInt(e.target.value)
                        )}
                        min="1"
                        max="4094"
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        VLAN ID to assign (1-4094)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">System Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 border-b border-gray-700 pb-2">MQTT Configuration</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  MQTT Broker
                </label>
                <input
                  type="text"
                  value="localhost"
                  disabled
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg opacity-70"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  MQTT Port
                </label>
                <input
                  type="number"
                  value="1883"
                  disabled
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg opacity-70"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  MQTT Topic
                </label>
                <input
                  type="text"
                  value="smartcity/#"
                  disabled
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg opacity-70"
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              To change MQTT settings, edit the .env file in the backend directory
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 border-b border-gray-700 pb-2">API Configuration</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  API URL
                </label>
                <input
                  type="text"
                  value="http://localhost:5000/api"
                  disabled
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg opacity-70"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Polling Interval
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value="5"
                    disabled
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg opacity-70"
                  />
                  <span className="ml-2 text-gray-400">seconds</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              To change API settings, edit the src/api/index.ts file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
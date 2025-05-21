import React, { createContext, useState, useContext } from 'react';
import { Device, VLANNetwork, NetworkNode, NetworkLink } from '../types';
import { vlans, devices, networkNodes, networkLinks } from '../utils/mockData';

interface NetworkContextType {
  vlans: VLANNetwork[];
  devices: Device[];
  networkNodes: NetworkNode[];
  networkLinks: NetworkLink[];
  selectedVlan: number | null;
  selectedDevice: string | null;
  setSelectedVlan: (id: number | null) => void;
  setSelectedDevice: (id: string | null) => void;
  filteredNodes: NetworkNode[];
  filteredLinks: NetworkLink[];
  getVlanById: (id: number) => VLANNetwork | undefined;
  getDeviceById: (id: string) => Device | undefined;
  getDevicesByVlanId: (vlanId: number) => Device[];
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedVlan, setSelectedVlan] = useState<number | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const getVlanById = (id: number) => vlans.find(vlan => vlan.id === id);
  
  const getDeviceById = (id: string) => devices.find(device => device.id === id);
  
  const getDevicesByVlanId = (vlanId: number) => 
    devices.filter(device => device.vlanId === vlanId);

  // Filter nodes and links based on selected VLAN or show all if none selected
  const filteredNodes = selectedVlan 
    ? networkNodes.filter(node => node.vlanId === selectedVlan)
    : networkNodes;

  const filteredLinks = selectedVlan
    ? networkLinks.filter(link => {
        // Include links that are within the selected VLAN or connect to a node in the selected VLAN
        const isInVlan = link.vlanId === selectedVlan;
        const connectsToVlan = !isInVlan && 
          (networkNodes.find(n => n.id === link.source)?.vlanId === selectedVlan || 
           networkNodes.find(n => n.id === link.target)?.vlanId === selectedVlan);
        
        return isInVlan || connectsToVlan;
      })
    : networkLinks;
  
  return (
    <NetworkContext.Provider value={{
      vlans,
      devices,
      networkNodes,
      networkLinks,
      selectedVlan,
      selectedDevice,
      setSelectedVlan,
      setSelectedDevice,
      filteredNodes,
      filteredLinks,
      getVlanById,
      getDeviceById,
      getDevicesByVlanId,
    }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
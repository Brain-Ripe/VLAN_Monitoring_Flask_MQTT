export interface Device {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'accessPoint' | 'sensor' | 'camera' | 'controller';
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  ip: string;
  location: string;
  vlanId: number;
}

export interface VLANNetwork {
  id: number;
  name: string;
  subnet: string;
  description: string;
  devices: string[]; // Device IDs
  color: string;
  trafficLoad: number; // 0-100
  securityLevel: 'low' | 'medium' | 'high';
  department: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: Device['type'];
  status: Device['status'];
  x: number;
  y: number;
  vlanId: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  strength: number;
  vlanId: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}
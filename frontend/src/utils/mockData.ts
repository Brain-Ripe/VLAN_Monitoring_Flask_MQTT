import { Device, VLANNetwork, NetworkNode, NetworkLink } from '../types';

// Generate random positions for network visualization
const generatePosition = () => ({
  x: Math.floor(Math.random() * 800),
  y: Math.floor(Math.random() * 600),
});

// VLAN Networks
export const vlans: VLANNetwork[] = [
  {
    id: 10,
    name: 'Traffic Management',
    subnet: '10.10.0.0/24',
    description: 'Network for traffic lights and sensors',
    devices: ['dev-001', 'dev-002', 'dev-003', 'dev-008', 'dev-012'],
    color: '#3B82F6', // blue
    trafficLoad: 72,
    securityLevel: 'high',
    department: 'Transportation'
  },
  {
    id: 20,
    name: 'Public Safety',
    subnet: '10.20.0.0/24',
    description: 'Network for surveillance cameras and emergency services',
    devices: ['dev-004', 'dev-005', 'dev-013'],
    color: '#EF4444', // red
    trafficLoad: 85,
    securityLevel: 'high',
    department: 'Public Safety'
  },
  {
    id: 30,
    name: 'Utility Management',
    subnet: '10.30.0.0/24',
    description: 'Network for power, water, and waste management',
    devices: ['dev-006', 'dev-007', 'dev-009', 'dev-015'],
    color: '#10B981', // green
    trafficLoad: 45,
    securityLevel: 'medium',
    department: 'Utilities'
  },
  {
    id: 40,
    name: 'Public WiFi',
    subnet: '10.40.0.0/24',
    description: 'Network for citizen internet access',
    devices: ['dev-010', 'dev-011', 'dev-014'],
    color: '#F59E0B', // amber
    trafficLoad: 90,
    securityLevel: 'low',
    department: 'IT Services'
  },
  {
    id: 50,
    name: 'Public WiFi',
    subnet: '10.40.0.0/24',
    description: 'Network for citizen internet access',
    devices: ['dev-010', 'dev-011'],
    color: '#F59E0B', // amber
    trafficLoad: 70,
    securityLevel: 'low',
    department: 'IT Services'
  },
   
];

// Devices
export const devices: Device[] = [
  { id: 'dev-001', name: 'Traffic Controller Alpha', type: 'controller', status: 'online', ip: '10.10.0.10', location: 'Main Street & 5th Ave', vlanId: 10 },
  { id: 'dev-002', name: 'Traffic Light Sensor 1', type: 'sensor', status: 'online', ip: '10.10.0.11', location: 'Main Street & 5th Ave', vlanId: 10 },
  { id: 'dev-003', name: 'Traffic Light Sensor 2', type: 'sensor', status: 'warning', ip: '10.10.0.12', location: 'Broadway & 10th Ave', vlanId: 10 },
  { id: 'dev-004', name: 'City Hall Camera', type: 'camera', status: 'online', ip: '10.20.0.10', location: 'City Hall', vlanId: 20 },
  { id: 'dev-005', name: 'Downtown Router', type: 'router', status: 'online', ip: '10.20.0.1', location: 'Downtown NOC', vlanId: 20 },
  { id: 'dev-006', name: 'Power Grid Sensor', type: 'sensor', status: 'online', ip: '10.30.0.10', location: 'Central Power Station', vlanId: 30 },
  { id: 'dev-007', name: 'Water Management System', type: 'controller', status: 'offline', ip: '10.30.0.11', location: 'Water Treatment Plant', vlanId: 30 },
  { id: 'dev-008', name: 'West Side Switch', type: 'switch', status: 'online', ip: '10.10.0.2', location: 'West Side Distribution Center', vlanId: 10 },
  { id: 'dev-009', name: 'Waste Management Sensor', type: 'sensor', status: 'online', ip: '10.30.0.12', location: 'Recycling Center', vlanId: 30 },
  { id: 'dev-010', name: 'Park WiFi AP 1', type: 'accessPoint', status: 'online', ip: '10.40.0.10', location: 'Central Park', vlanId: 40 },
  { id: 'dev-011', name: 'Library WiFi AP', type: 'accessPoint', status: 'online', ip: '10.40.0.11', location: 'Central Library', vlanId: 40 },
  { id: 'dev-012', name: 'Traffic Camera Junction', type: 'camera', status: 'online', ip: '10.10.0.13', location: 'Highway 101 Exit', vlanId: 10 },
  { id: 'dev-013', name: 'Emergency Services Router', type: 'router', status: 'online', ip: '10.20.0.2', location: 'Emergency Response Center', vlanId: 20 },
  { id: 'dev-014', name: 'City Square WiFi AP', type: 'accessPoint', status: 'warning', ip: '10.40.0.12', location: 'Central Square', vlanId: 40 },
  { id: 'dev-015', name: 'Solar Grid Controller', type: 'controller', status: 'maintenance', ip: '10.30.0.13', location: 'Solar Farm North', vlanId: 30 },
];

// Network Nodes for visualization
export const networkNodes: NetworkNode[] = devices.map(device => ({
  id: device.id,
  label: device.name,
  type: device.type,
  status: device.status,
  vlanId: device.vlanId,
  ...generatePosition()
}));

// Network Links for visualization
export const networkLinks: NetworkLink[] = [
  { source: 'dev-001', target: 'dev-002', strength: 0.8, vlanId: 10 },
  { source: 'dev-001', target: 'dev-003', strength: 0.8, vlanId: 10 },
  { source: 'dev-001', target: 'dev-008', strength: 0.5, vlanId: 10 },
  { source: 'dev-008', target: 'dev-012', strength: 0.7, vlanId: 10 },
  { source: 'dev-004', target: 'dev-005', strength: 0.9, vlanId: 20 },
  { source: 'dev-005', target: 'dev-013', strength: 0.6, vlanId: 20 },
  { source: 'dev-006', target: 'dev-007', strength: 0.7, vlanId: 30 },
  { source: 'dev-007', target: 'dev-009', strength: 0.8, vlanId: 30 },
  { source: 'dev-009', target: 'dev-015', strength: 0.5, vlanId: 30 },
  { source: 'dev-010', target: 'dev-011', strength: 0.4, vlanId: 40 },
  { source: 'dev-011', target: 'dev-014', strength: 0.6, vlanId: 40 },
  { source: 'dev-005', target: 'dev-008', strength: 0.3, vlanId: 0 }, // Cross-VLAN connection
  { source: 'dev-013', target: 'dev-007', strength: 0.2, vlanId: 0 }, // Cross-VLAN connection
  { source: 'dev-008', target: 'dev-011', strength: 0.2, vlanId: 0 }, // Cross-VLAN connection
];

// Traffic data over time (24 hours)
export const trafficData = {
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  datasets: [
    {
      label: 'Traffic Management VLAN',
      data: [42, 38, 35, 30, 25, 32, 40, 55, 62, 68, 72, 70, 65, 68, 72, 75, 80, 85, 75, 68, 60, 55, 50, 45],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2
    },
    {
      label: 'Public Safety VLAN',
      data: [65, 60, 55, 50, 48, 50, 55, 60, 65, 70, 75, 80, 82, 85, 80, 78, 75, 80, 85, 82, 80, 75, 70, 68],
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 2
    },
    {
      label: 'Utility Management VLAN',
      data: [30, 32, 35, 32, 30, 28, 30, 35, 40, 42, 45, 48, 50, 52, 50, 48, 45, 42, 40, 38, 35, 32, 30, 28],
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2
    },
    {
      label: 'Public WiFi VLAN',
      data: [25, 20, 15, 10, 8, 10, 15, 25, 35, 45, 60, 75, 85, 90, 88, 85, 80, 85, 80, 70, 55, 45, 35, 30],
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2
    },
  ]
};

// Device status distribution
export const deviceStatusData = {
  labels: ['Online', 'Offline', 'Warning', 'Maintenance'],
  datasets: [
    {
      label: 'Device Status',
      data: [
        devices.filter(d => d.status === 'online').length,
        devices.filter(d => d.status === 'offline').length,
        devices.filter(d => d.status === 'warning').length,
        devices.filter(d => d.status === 'maintenance').length,
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.6)', // green
        'rgba(239, 68, 68, 0.6)',  // red
        'rgba(245, 158, 11, 0.6)', // amber
        'rgba(107, 114, 128, 0.6)' // gray
      ],
      borderWidth: 1
    }
  ]
};

// VLAN Device distribution
export const vlanDistributionData = {
  labels: vlans.map(vlan => vlan.name),
  datasets: [
    {
      label: 'Number of Devices',
      data: vlans.map(vlan => vlan.devices.length),
      backgroundColor: vlans.map(vlan => `${vlan.color}99`),
      borderWidth: 1
    }
  ]
};
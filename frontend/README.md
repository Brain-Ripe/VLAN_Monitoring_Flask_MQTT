# Smart City VLAN Management System

This project implements a smart city monitoring system that dynamically assigns VLANs to IoT devices based on their data parameters. The system uses MQTT for IoT data transmission, Flask for the backend, and React for the frontend.

## Features

- MQTT integration for real-time IoT device data collection
- Dynamic VLAN assignment based on configurable parameters
- Real-time data visualization dashboard
- Device management and monitoring interface
- Customizable VLAN assignment rules
- Simulation tools for testing without physical devices

## Architecture

The system consists of three main components:

1. **Flask Backend**
   - Handles MQTT communication with IoT devices
   - Processes incoming data and assigns VLANs based on rules
   - Provides REST API endpoints for the frontend

2. **React Frontend**
   - Interactive dashboard for monitoring devices and VLANs
   - Data visualization with charts and graphs
   - Device simulation tools
   - VLAN rule configuration interface

3. **MQTT Broker**
   - Handles publish/subscribe messaging between IoT devices and the backend
   - Supports multiple topics for different device types

## Getting Started

### Prerequisites

- Node.js
- Python 3.7+
- MQTT broker (optional for local development, as simulation is available)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the Flask backend:
   ```
   cd backend
   python app.py
   ```

2. Start the React frontend:
   ```
   npm run dev
   ```

3. Open your browser and navigate to the local development server URL

## Usage

### Device Simulation

The application includes a device simulator that allows you to test VLAN assignment without physical IoT devices:

1. Navigate to the "Devices" tab
2. Click "Add Device"
3. Configure the device parameters
4. Click "Simulate Device"

### VLAN Rule Configuration

You can customize the VLAN assignment rules:

1. Navigate to the "Settings" tab
2. Modify the threshold values and VLAN assignments
3. Click "Save Changes"

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/devices` - Get all registered devices
- `GET /api/vlans` - Get all VLAN assignments
- `GET /api/rules` - Get current VLAN assignment rules
- `POST /api/rules` - Update VLAN assignment rules
- `POST /api/simulate` - Simulate a device data transmission

## MQTT Topics

The system subscribes to the following MQTT topics:

- `smartcity/#` - All smart city devices
- `smartcity/traffic` - Traffic sensors
- `smartcity/environment` - Environmental sensors
- `smartcity/security` - Security devices

## License

This project is licensed under the MIT License - see the LICENSE file for details.
from flask import Flask, request, jsonify
from flask_cors import CORS
import paho.mqtt.client as mqtt
import json
import time
import threading
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MQTT Configuration
MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "smartcity/#")

# In-memory data store
devices = {}
vlan_assignments = {}
vlan_rules = {
    "temperature": {
        "high": {"threshold": 30, "vlan": 10},
        "medium": {"threshold": 20, "vlan": 20},
        "low": {"threshold": 0, "vlan": 30}
    },
    "traffic": {
        "high": {"threshold": 80, "vlan": 40},
        "medium": {"threshold": 50, "vlan": 50},
        "low": {"threshold": 0, "vlan": 60}
    },
    "airQuality": {
        "high": {"threshold": 150, "vlan": 70},
        "medium": {"threshold": 100, "vlan": 80},
        "low": {"threshold": 0, "vlan": 90}
    }
}

# MQTT Callbacks
def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        device_id = payload.get("device_id")
        
        if not device_id:
            print("Received message without device_id, ignoring")
            return
            
        # Store device data
        devices[device_id] = {
            "timestamp": time.time(),
            "data": payload,
            "topic": msg.topic
        }
        
        # Assign VLAN based on rules
        assign_vlan(device_id, payload)
        
        print(f"Received data from {device_id}: {payload}")
    except Exception as e:
        print(f"Error processing message: {e}")

def assign_vlan(device_id, data):
    # Default VLAN
    vlan_id = 100
    
    # Check for name-based assignment
    if "name" in data:
        name = data["name"].lower()
        if "traffic" in name:
            vlan_id = 40
        elif "environment" in name:
            vlan_id = 20
        elif "security" in name:
            vlan_id = 30
    
    # Check for parameter-based assignment
    for param, rules in vlan_rules.items():
        if param in data:
            value = data[param]
            
            # Find appropriate VLAN based on thresholds
            for level, rule in rules.items():
                if value >= rule["threshold"]:
                    vlan_id = rule["vlan"]
                    break
    
    # Store VLAN assignment
    vlan_assignments[device_id] = {
        "vlan_id": vlan_id,
        "timestamp": time.time(),
        "reason": f"Assigned based on data parameters: {data}"
    }

# API Routes
@app.route('/api/devices', methods=['GET'])
def get_devices():
    return jsonify(devices)

@app.route('/api/vlans', methods=['GET'])
def get_vlans():
    return jsonify(vlan_assignments)

@app.route('/api/rules', methods=['GET'])
def get_rules():
    return jsonify(vlan_rules)

@app.route('/api/rules', methods=['POST'])
def update_rules():
    new_rules = request.json
    global vlan_rules
    vlan_rules = new_rules
    
    # Reassign VLANs based on new rules
    for device_id, device_data in devices.items():
        assign_vlan(device_id, device_data["data"])
    
    return jsonify({"status": "success", "rules": vlan_rules})

@app.route('/api/simulate', methods=['POST'])
def simulate_device():
    data = request.json
    device_id = data.get("device_id", f"sim-{int(time.time())}")
    
    # Create simulated MQTT message
    topic = f"smartcity/{data.get('type', 'sensor')}"
    payload = {
        "device_id": device_id,
        **data
    }
    
    # Process like an MQTT message
    devices[device_id] = {
        "timestamp": time.time(),
        "data": payload,
        "topic": topic
    }
    
    # Assign VLAN
    assign_vlan(device_id, payload)
    
    return jsonify({
        "status": "success", 
        "device": devices[device_id],
        "vlan": vlan_assignments.get(device_id)
    })

def start_mqtt_client():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_forever()
    except Exception as e:
        print(f"Failed to connect to MQTT broker: {e}")
        print(f"Will continue without MQTT connection. Use simulation API instead.")

if __name__ == '__main__':
    # Start MQTT client in a separate thread
    mqtt_thread = threading.Thread(target=start_mqtt_client)
    mqtt_thread.daemon = True
    mqtt_thread.start()
    
    # Start Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
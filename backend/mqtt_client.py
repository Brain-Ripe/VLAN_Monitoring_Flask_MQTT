from flask import Flask, request, jsonify
import paho.mqtt.client as mqtt
import threading

app = Flask(__name__)

# MQTT Settings
MQTT_BROKER = "localhost"  # Use localhost as we're running Mosquitto locally
MQTT_PORT = 1883
MQTT_TOPIC = "iot/vlan"

# Store devices and VLAN assignments in-memory (for now)
devices = {}

# MQTT callback when connection is established
def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")
    # Subscribe to the desired topic
    client.subscribe(MQTT_TOPIC)

# MQTT callback when a message is received
def on_message(client, userdata, msg):
    device_info = msg.payload.decode()  # Decode the message
    print(f"Received message: {device_info}")
    
    # Assign VLAN based on the device ID
    device_id = device_info
    vlan_id = hash(device_id) % 10 + 1  # Simple VLAN assignment logic
    
    # Store the device and its VLAN assignment
    devices[device_id] = vlan_id
    
    print(f"Assigned VLAN {vlan_id} to {device_id}")

# Initialize MQTT client and set callbacks
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

# Connect to the MQTT broker
def start_mqtt_client():
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_forever()  # Start listening for messages

# Start MQTT client in a separate thread so it doesn't block the Flask app
mqtt_thread = threading.Thread(target=start_mqtt_client)
mqtt_thread.start()

# Flask route to assign VLAN (already implemented)
@app.route('/assign_vlan', methods=['POST'])
def assign_vlan():
    data = request.get_json()
    device_id = data.get("device_id")
    
    if not device_id:
        return jsonify({"error": "Device ID is required"}), 400
    
    # Return the VLAN assigned to this device
    vlan_id = devices.get(device_id, "Device not found")
    
    return jsonify({
        "device_id": device_id,
        "vlan_assigned": vlan_id
    })

# Flask route to get all devices and their VLANs
@app.route('/get_devices', methods=['GET'])
def get_devices():
    return jsonify(devices)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)

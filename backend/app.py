from flask import Flask, request, jsonify
import paho.mqtt.client as mqtt
import threading
import json

app = Flask(__name__)

# In-memory device VLAN store
devices = {}

# MQTT Settings
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "iot/vlan"

# Handle MQTT connection
def on_connect(client, userdata, flags, rc):
    print(f"✅ Connected to MQTT broker with result code {rc}")
    client.subscribe(MQTT_TOPIC)
    print(f"📡 Subscribed to topic: {MQTT_TOPIC}")

# Handle incoming MQTT message
def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        device_id = payload.get("device_id")
        device_type = payload.get("type", "unknown")
        location = payload.get("location", "unknown")
        message_rate = payload.get("message_rate", 0)

        if not device_id:
            print("❌ Invalid payload, missing device_id")
            return

        vlan_id = hash(device_id + device_type + location) % 10 + 1  # smarter hash

        devices[device_id] = {
            "vlan": vlan_id,
            "type": device_type,
            "location": location,
            "message_rate": message_rate
        }

        print(f"📥 {device_id} metadata received. Assigned VLAN {vlan_id} ✅")
    except json.JSONDecodeError:
        print("❌ Failed to parse JSON MQTT message")

# Start MQTT client in background thread
def start_mqtt():
    mqtt_client = mqtt.Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
    mqtt_client.loop_forever()

mqtt_thread = threading.Thread(target=start_mqtt)
mqtt_thread.daemon = True
mqtt_thread.start()

# API: Get VLAN for specific device
@app.route("/assign_vlan", methods=["POST"])
def assign_vlan():
    data = request.get_json()
    device_id = data.get("device_id")
    if not device_id:
        return jsonify({"error": "device_id required"}), 400
    vlan = devices.get(device_id)
    if vlan is None:
        return jsonify({"message": "Device not found yet via MQTT"}), 404
    return jsonify({"device_id": device_id, "vlan": vlan})

# API: Get all device-to-VLAN mappings
@app.route("/get_devices", methods=["GET"])
def get_all_devices():
    return jsonify(devices)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

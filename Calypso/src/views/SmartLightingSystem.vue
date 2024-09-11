<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Lighting System</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="relation-section">
          <h4>Sensor Detection</h4>
          <div class="sensor-detection-diagram position-relative">
            <img src="@/assets/Smart Lighting Algo.png" alt="Relation View" class="relation-image">
            <button class="btn btn-primary position-absolute bottom-0 end-0 m-3" @click="openConditionModal">Adjust
              Condition</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="map-section">
          <h4>Floorplan</h4>
          <div class="mb-3">
            <select v-model="selectedImage" class="form-select">
              <option v-for="(image, index) in images" :key="index" :value="image.value">{{ image.label }}</option>
            </select>
          </div>
          <div class="map-container">
            <img :src="getImagePath(selectedImage)" alt="Map View" class="map-image">
            <div class="slider-container" v-if="showSlider()">
              <label class="switch">
                <input type="checkbox" v-model="allOn">
                <span class="slider round"></span>
              </label>
              <span class="slider-label">{{ allOn ? 'ALL OFF' : 'ALL ON' }}</span>
            </div>
            <div v-for="(sensor, index) in currentSensors" :key="index" class="sensor-icon"
              :style="{ top: sensor.top, left: sensor.left }" @click="toggleModal(sensor)">
              <img :src="require('@/assets/lighting.png')" alt="Lighting Icon" class="lighting-icon" />
              <span :class="['status-dot', sensor.isOnline ? 'online' : 'offline']"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-md-3" v-for="device in devices" :key="device.id">
        <div class="device-status-card">
          <h5>{{ device.name }}</h5>
          <p class="status" :class="{ 'text-success': device.isOnline, 'text-danger': !device.isOnline }">
            {{ device.isOnline ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Dialog -->
    <div v-if="showModal" class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal">×</button>
          </div>
          <div class="modal-body text-center">
            <!-- On/Off Buttons -->
            <button @click="setZoneState(true, currentSensor)" class="btn btn-primary mb-3">ON</button>
            <button @click="setZoneState(false, currentSensor)" class="btn btn-danger mb-3">OFF</button>

            <!-- Sliders for B05-11/12 -->
            <div v-if="selectedImage === 'B05-11-12_full_empty.png'" class="zone-control">
              <h5>{{ currentSensor.name }} Control</h5>
              <label>Color Temperature (Level 1): {{ currentSensor.level1 }}</label>
              <input type="range" v-model="currentSensor.level1" min="0" max="100" step="100" />

              <label>Dimming (Level 2): {{ currentSensor.level2 }}</label>
              <input type="range" v-model="currentSensor.level2" min="0" max="100" />

              <!-- Set Button -->
              <button @click="updateZone(currentSensor)" class="btn btn-success mt-3">Set</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SmartLightingSystem',
  data() {
    return {
      devices: [],
      selectedImage: 'B05-07_empty.png',
      images: [
        { value: 'B05-07_empty.png', label: 'B05-07' },
        { value: 'B05-08_empty_light.png', label: 'B05-08' },
        { value: 'B05-09_full_lighting.png', label: 'B05-09' },
        { value: 'B05-11-12_full_empty.png', label: 'B05-11/12' }
      ],
      sensors: {
        'B05-07_empty.png': [
          { top: '47%', left: '50%', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131065' },
          { top: '40%', left: '45%', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D130904' },
          { top: '35%', left: '40%', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D099018' },
          { top: '30%', left: '35%', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131721' },
          { top: '25%', left: '30%', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131940' },
          { top: '17%', left: '35%', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131774' }
        ],
        'B05-08_empty_light.png': [
          { top: '48%', left: '53%', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131508' },
          { top: '51%', left: '45%', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131142' },
          { top: '45%', left: '40%', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131803' },
          { top: '39%', left: '35%', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131818' },
          { top: '33%', left: '31%', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131201' },
          { top: '27%', left: '26%', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131779' }
        ],
        'B05-09_full_lighting.png': [
          { top: '50%', left: '51%', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131824' },
          { top: '46%', left: '44%', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131793' },
          { top: '42%', left: '37%', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131870' },
          { top: '37%', left: '31%', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131050' },
          { top: '32%', left: '25%', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D139009' },
          { top: '23%', left: '29%', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131156' }
        ],
        'B05-11-12_full_empty.png': [
          { top: '38%', left: '63%', name: 'Zone 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED0100001704', level1: 0, level2: 0 },
          { top: '28%', left: '56%', name: 'Zone 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED010000166B', level1: 0, level2: 0 },
          { top: '42%', left: '47%', name: 'Zone 7', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED010000170F', level1: 0, level2: 0 },
          { top: '38%', left: '52%', name: 'Zone 8', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED010000173B', level1: 0, level2: 0 },
          { top: '25%', left: '65%', name: 'Zone 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED0100001713', level1: 0, level2: 0 },
          { top: '21%', left: '69.5%', name: 'Zone 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED0100001720', level1: 0, level2: 0 },
          { top: '50%', left: '36.5%', name: 'Zone 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED0100001716', level1: 0, level2: 0 },
          { top: '46%', left: '42%', name: 'Zone 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED0100001711', level1: 0, level2: 0 },
        ],
      },
      showModal: false,
      modalTitle: '',
      currentSensor: null,

      // ALL ON toggle
      allOn: false
    };
  },
  computed: {
    currentSensors() {
      return this.sensors[this.selectedImage] || [];
    }
  },
  methods: {
    toggleModal(sensor) {
      this.modalTitle = sensor.name;
      this.currentSensor = sensor;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    // Function to send switch command for specific sensors
    async sendSwitchCommand(deviceEUI, switchStates) {
      try {
        console.log('Sending switch command to device:', deviceEUI, 'with states:', switchStates);
        const response = await axios.post('https://hammerhead-app-kva7n.ondigitalocean.app/command/ws503', {
          deviceEui: deviceEUI,
          switchStates: switchStates
        });
        if (response && response.data) {
          console.log('Switch command response:', response.data);
          const sensor = this.currentSensors.find(s => s.deviceEUI === deviceEUI);
          if (sensor) {
            sensor.isOnline = switchStates.every(state => state === 1);
          }
        } else {
          console.warn('Switch command sent but no data returned from server');
        }
      } catch (error) {
        console.error('Error sending switch command:', error);
      }
    },
    // Function to toggle all devices ON or OFF
    async toggleAllDevices() {
      if (['B05-07_empty.png', 'B05-08_empty_light.png', 'B05-09_full_lighting.png'].includes(this.selectedImage)) {
        // Use sendSwitchCommand for B05-07, B05-08, and B05-09
        const switchStates = this.allOn ? [1, 1, 1] : [0, 0, 0];  // 1 for ON, 0 for OFF
        for (const sensor of this.currentSensors) {
          await this.sendSwitchCommand(sensor.deviceEUI, switchStates);  // Send command for each sensor
        }
      } else {
        // For other floorplans, use the default API for turning devices ON/OFF
        const apiUrl = this.allOn
          ? `https://lumani.rshare.io/device/on`
          : `https://lumani.rshare.io/device/off`;

        const deviceIds = this.currentSensors.reduce((acc, sensor, index) => {
          acc[`deviceId${index + 1}`] = sensor.deviceEUI;  // Construct deviceId1, deviceId2, ...
          return acc;
        }, {});

        try {
          const response = await axios.post(apiUrl, deviceIds);
          console.log('All devices state response:', response.data);

          // Update the online status of each sensor based on the action
          this.currentSensors.forEach(sensor => sensor.isOnline = this.allOn);
        } catch (error) {
          console.error('Error setting all devices state:', error);
        }
      }
    },
    // Function to handle zone state changes (ON/OFF)
    async setZoneState(state, sensor) {
      if (['B05-07_empty.png', 'B05-08_empty_light.png', 'B05-09_full_lighting.png'].includes(this.selectedImage)) {
        // Send switch command using sendSwitchCommand for B05-07, B05-08, and B05-09
        const switchStates = state ? [1, 1, 1] : [0, 0, 0];  // Use 1 for ON and 0 for OFF
        await this.sendSwitchCommand(sensor.deviceEUI, switchStates);
      } else {
        // For other floorplans, use the default API for turning devices ON/OFF
        const apiUrl = state
          ? `https://lumani.rshare.io/device/on`
          : `https://lumani.rshare.io/device/off`;

        try {
          const response = await axios.post(apiUrl, { deviceId: sensor.deviceEUI });
          console.log('Individual device state response:', response.data);

          // Update the sensor status locally
          sensor.isOnline = state;
        } catch (error) {
          console.error('Error setting individual device state:', error);
        }
      }
    },
    // Function to update zone dimming for B05-11/12
    async updateZone(sensor) {
      const apiUrl = `https://lumani.rshare.io/device/dim`;

      // Prepare the JSON payload with the deviceId and dimming levels
      const payload = {
        deviceId: sensor.deviceEUI,
        level1: sensor.level1,  // The current level1 (color temperature or brightness)
        level2: sensor.level2   // The current level2 (dimming level)
      };

      try {
        // Send the POST request to update the dimming levels
        const response = await axios.post(apiUrl, payload);
        console.log('Zone dimming response:', response.data);

        // Handle any additional actions after the update (e.g., UI updates)
      } catch (error) {
        console.error('Error updating zone dimming:', error);
      }

      // Close the modal after sending the update
      this.closeModal();
    },
    getImagePath(image) {
      return require(`@/assets/Sub System and Icons/V2/${image}`);
    },
    showSlider() {
      return this.selectedImage !== 'B05-11-12_empty.jpg';
    }
  },
  watch: {
    allOn() {
      this.toggleAllDevices();
    }
  }
};
</script>

<style scoped>
.container-fluid {
  width: 100%;
  padding-bottom: 10%;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
}

.row {
  display: flex;
  justify-content: space-between;
}

.relation-section,
.map-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 100%;
}

.relation-image,
.map-image {
  width: 100%;
  height: auto;
  transition: transform 0.1s ease-out;
}

.map-container {
  overflow: hidden;
  height: 100%;
  position: relative;
}

.sensor-icon {
  position: absolute;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 1;
}

.status-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  z-index: 2;
}

.online {
  background-color: green;
}

.offline {
  background-color: red;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal.d-block {
  display: block;
}

.modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  width: 500px;
}

.device-status-card {
  background-color: #e9f7fd;
  padding: 15px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.device-status-card h5 {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.device-status-card .status {
  font-size: 1.5rem;
  font-weight: bold;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

/* Slider Container */
.slider-container {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.slider-label {
  font-weight: bold;
}

.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: green;
}

input:checked+.slider:before {
  transform: translateX(14px);
}

.zone-control input[type="range"] {
  width: 80%;
  margin: 10px 0;
}

.zone-control label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}
</style>

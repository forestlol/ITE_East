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
              <span class="slider-label">ALL ON</span>
            </div>
            <div v-for="(sensor, index) in currentSensors" :key="index" class="sensor-icon"
              :style="{ top: sensor.top, left: sensor.left }" @click="toggleModal(sensor)">
              <!-- Apply square-bar class only for B05-11-12_empty_V3.jpg and the first two sensors -->
              <div :class="(selectedImage === 'B05-11-12_empty_V3.jpg' && index < 2) ? 'square-bar' : 'vertical-bar'"></div>
              <!-- Always show the status dot -->
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
    <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>
    <div v-if="showModal" class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal">×</button>
          </div>
          <div class="modal-body text-center">
            <!-- On/Off Buttons -->
            <button @click="setSwitch(true, currentSensor)" class="btn btn-primary mb-3">ON</button>
            <button @click="setSwitch(false, currentSensor)" class="btn btn-danger mb-3">OFF</button>

            <!-- Sliders for B05-11/12 -->
            <div v-if="selectedImage === 'B05-11-12_empty_V3.jpg'" class="zone-control">
              <h5>{{ currentSensor.name }} Control</h5>
              <label>Color Temperature (Level 1): {{ currentSensor.level1 }}</label>
              <input type="range" v-model="currentSensor.level1" min="0" max="100" />
              
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
      selectedImage: 'B05-07_empty_V3.jpg',
      images: [
        { value: 'B05-07_empty_V3.jpg', label: 'B05-07' },
        { value: 'B05-08_empty_V3.jpg', label: 'B05-08' },
        { value: 'B05-09_empty_V3.jpg', label: 'B05-09' },
        { value: 'B05-11-12_empty_V3.jpg', label: 'B05-11/12' }
      ],
      sensors: {
        'B05-07_empty_V3.jpg': [
          { top: '40%', left: '35%', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131065' },
          { top: '40%', left: '40%', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D130904' },
          { top: '40%', left: '45%', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D099018' },
          { top: '40%', left: '50%', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131721' },
          { top: '40%', left: '55%', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131940' },
          { top: '40%', left: '60%', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131774' }
        ],
        'B05-08_empty_V3.jpg': [
          { top: '40%', left: '30%', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131508' },
          { top: '40%', left: '35%', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131142' },
          { top: '40%', left: '40%', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131803' },
          { top: '40%', left: '45%', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131818' },
          { top: '40%', left: '50%', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131201' },
          { top: '40%', left: '55%', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131779' }
        ],
        'B05-09_empty_V3.jpg': [
          { top: '40%', left: '30%', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131824' },
          { top: '40%', left: '35%', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131793' },
          { top: '40%', left: '40%', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131870' },
          { top: '40%', left: '45%', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131050' },
          { top: '40%', left: '50%', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D139009' },
          { top: '40%', left: '55%', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131156' }
        ],
        'B05-11-12_empty_V3.jpg': [
          { top: '55%', left: '67%', name: 'Zone 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED0100001704', level1: 0, level2: 0 },
          { top: '32%', left: '67%', name: 'Zone 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED010000166B', level1: 0, level2: 0 },
          { top: '44%', left: '73%', name: 'Zone 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED0100001713', level1: 0, level2: 0 },
          { top: '44%', left: '78%', name: 'Zone 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '0004ED0100001720', level1: 0, level2: 0 },
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
    async setSwitch(state, sensor) {
      sensor.isOnline = state;
      const switchStates = Array(3).fill(state ? 1 : 0);
      await this.sendSwitchCommand(sensor.deviceEUI, switchStates);
      this.closeModal(); // Close the modal after action
    },
    async sendSwitchCommand(deviceEUI, switchStates) {
      try {
        console.log('Sending switch command to device:', deviceEUI, 'with states:', switchStates);
        const response = await axios.post('https://hammerhead-app-kva7n.ondigitalocean.app/command/ws503', {
          deviceEui: deviceEUI,
          switchStates: switchStates
        });
        if (response && response.data) {
          console.log('Switch command response:', response.data);
          // Optionally, handle the response data here, e.g., check if a status flag is returned
        } else {
          console.warn('Switch command sent but no data returned from server');
        }
      } catch (error) {
        console.error('Error sending switch command:', error);
      }
    },
    async updateZone(sensor) {
      // Log the data being sent to the API
      const payload = {
        deviceId: sensor.deviceEUI,
        level1: sensor.level1,
        level2: sensor.level2
      };
      console.log('Sending zone update with payload:', payload);

      try {
        const response = await axios.post('https://lumani.rshare.io/device/dim', payload);
        console.log('Zone update response:', response.data);
        // Optionally handle response if needed
      } catch (error) {
        console.error('Error updating zone:', error);
      }
      this.closeModal();
    },
    getImagePath(image) {
      return require(`@/assets/Sub System and Icons/V2/${image}`);
    },
    showSlider() {
      return this.selectedImage !== 'B05-11-12_empty.jpg';
    },
    async toggleAllDevices() {
      const sensors = this.currentSensors;
      for (const sensor of sensors) {
        sensor.isOnline = this.allOn;
        const switchStates = Array(3).fill(this.allOn ? 1 : 0);
        await this.sendSwitchCommand(sensor.deviceEUI, switchStates);
      }
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

.vertical-bar {
  width: 18px; /* Adjust the width of the bar to make it wider */
  height: 200px;
  background-color: #f39c12;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.square-bar {
  width: 300px !important; /* Force the width to be 300px */
  height: 95px;
  background-color: #f39c12;
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.status-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  z-index: 2; /* Ensure it appears above other elements */
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

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px 20px;
}

.btn-close {
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
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
  background-color: #2196F3;
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

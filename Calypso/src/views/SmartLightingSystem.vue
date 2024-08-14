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
              <i :class="sensor.icon"></i>
              <!-- Only show the status dot if not on B05-11-12_empty.jpg -->
              <span v-if="selectedImage !== 'B05-11-12_empty.jpg'"
                :class="['status-dot', sensor.isOnline ? 'online' : 'offline']"></span>
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
            <button @click="setSwitch(true, currentSensor)" class="btn btn-primary">ON</button>
            <button @click="setSwitch(false, currentSensor)" class="btn btn-danger">OFF</button>
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
      selectedImage: 'B05-11-12_empty.jpg',
      images: [
        { value: 'B05-11-12_empty.jpg', label: 'B05-11/12' },
        { value: 'B05-07_Smart_IAQ_systems_V2.jpg', label: 'B05-07' },
        { value: 'B05-08_Smart_IAQ_system_V2.jpg', label: 'B05-08' },
        { value: 'B05-09_Smart_IAQ_System_V2.jpg', label: 'B05-09' }
      ],
      sensors: {
        'B05-11-12_empty.jpg': [
          { top: '33%', left: '15.2%', icon: 'fas fa-lightbulb', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131774', showButtons: false },
          { top: '31%', left: '22.6%', icon: 'fas fa-lightbulb', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131940', showButtons: false },
          { top: '28%', left: '30.5%', icon: 'fas fa-lightbulb', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131721', showButtons: false },
          { top: '28%', left: '46%', icon: 'fas fa-lightbulb', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D099018', showButtons: false },
          { top: '28%', left: '38%', icon: 'fas fa-lightbulb', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131508', showButtons: false },
          { top: '29%', left: '63%', icon: 'fas fa-lightbulb', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D130904', showButtons: false },
          { top: '29%', left: '70.7%', icon: 'fas fa-lightbulb', name: 'Sensor 7', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131065', showButtons: false },
          { top: '29%', left: '78.6%', icon: 'fas fa-lightbulb', name: 'Sensor 8', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131824', showButtons: false },
          { top: '43%', left: '63.6%', icon: 'fas fa-lightbulb', name: 'Sensor 9', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131793', showButtons: false },
          { top: '39%', left: '53.4%', icon: 'fas fa-lightbulb', name: 'Sensor 10', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131870', showButtons: false },
          { top: '43%', left: '71.6%', icon: 'fas fa-lightbulb', name: 'Sensor 11', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131050', showButtons: false },
          { top: '43%', left: '79%', icon: 'fas fa-lightbulb', name: 'Sensor 12', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D139009', showButtons: false },
          { top: '50%', left: '24.4%', icon: 'fas fa-lightbulb', name: 'Sensor 13', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131156', showButtons: false },
          { top: '50%', left: '31.3%', icon: 'fas fa-lightbulb', name: 'Sensor 14', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131201', showButtons: false },
          { top: '48%', left: '40%', icon: 'fas fa-lightbulb', name: 'Sensor 15', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131803', showButtons: false },
          { top: '47%', left: '47%', icon: 'fas fa-lightbulb', name: 'Sensor 16', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131818', showButtons: false },
          { top: '64%', left: '25.3%', icon: 'fas fa-lightbulb', name: 'Sensor 17', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131779', showButtons: false },
          { top: '67%', left: '40.3%', icon: 'fas fa-lightbulb', name: 'Sensor 18', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131065', showButtons: false },
          { top: '65%', left: '79.6%', icon: 'fas fa-lightbulb', name: 'Sensor 19', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D130904', showButtons: false },
          { top: '65%', left: '72%', icon: 'fas fa-lightbulb', name: 'Sensor 20', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D099018', showButtons: false },
          { top: '66%', left: '47.3%', icon: 'fas fa-lightbulb', name: 'Sensor 21', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131721', showButtons: false },
          { top: '62%', left: '56.3%', icon: 'fas fa-lightbulb', name: 'Sensor 22', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131774', showButtons: false },
          { top: '65%', left: '64%', icon: 'fas fa-lightbulb', name: 'Sensor 23', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131940', showButtons: false },
          { top: '46%', left: '68.5%', icon: 'fas fa-wifi', name: 'WiFi Gateway 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00' },
          { top: '56%', left: '69%', icon: 'fas fa-wifi', name: 'WiFi Gateway 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00' },
        ],
        'B05-07_Smart_IAQ_systems_V2.jpg': [
          { top: '30%', left: '35%', icon: 'fas fa-lightbulb', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131065', showButtons: false },
          { top: '30%', left: '40%', icon: 'fas fa-lightbulb', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D130904', showButtons: false },
          { top: '30%', left: '45%', icon: 'fas fa-lightbulb', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D099018', showButtons: false },
          { top: '30%', left: '50%', icon: 'fas fa-lightbulb', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131721', showButtons: false },
          { top: '30%', left: '55%', icon: 'fas fa-lightbulb', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131940', showButtons: false },
          { top: '30%', left: '60%', icon: 'fas fa-lightbulb', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131774', showButtons: false }
        ],
        'B05-08_Smart_IAQ_system_V2.jpg': [
          { top: '30%', left: '35%', icon: 'fas fa-lightbulb', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131508', showButtons: false },
          { top: '30%', left: '40%', icon: 'fas fa-lightbulb', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131142', showButtons: false },
          { top: '30%', left: '45%', icon: 'fas fa-lightbulb', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131803', showButtons: false },
          { top: '30%', left: '50%', icon: 'fas fa-lightbulb', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131818', showButtons: false },
          { top: '30%', left: '55%', icon: 'fas fa-lightbulb', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131201', showButtons: false },
          { top: '30%', left: '60%', icon: 'fas fa-lightbulb', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131779', showButtons: false }
        ],
        'B05-09_Smart_IAQ_System_V2.jpg': [
          { top: '30%', left: '35%', icon: 'fas fa-lightbulb', name: 'Sensor 6', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131824', showButtons: false },
          { top: '30%', left: '40%', icon: 'fas fa-lightbulb', name: 'Sensor 5', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131793', showButtons: false },
          { top: '30%', left: '45%', icon: 'fas fa-lightbulb', name: 'Sensor 4', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131870', showButtons: false },
          { top: '30%', left: '50%', icon: 'fas fa-lightbulb', name: 'Sensor 3', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131050', showButtons: false },
          { top: '30%', left: '55%', icon: 'fas fa-lightbulb', name: 'Sensor 2', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D139009', showButtons: false },
          { top: '30%', left: '60%', icon: 'fas fa-lightbulb', name: 'Sensor 1', isOnline: false, lastUpdated: '2024-05-29 14:30:00', deviceEUI: '24E124782D131156', showButtons: false }
        ]
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
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 1;
}

.sensor-icon i {
  color: #f39c12;
  font-size: 1rem;
}

.status-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
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
</style>

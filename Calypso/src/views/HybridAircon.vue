<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Hybrid Aircon System</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="relation-section">
          <h4>Sensor Detection</h4>
          <div class="sensor-detection-diagram">
            <img src="@/assets/Hybrid Aircon Algo.png" alt="Relation View" class="relation-image">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="map-section">
          <h4>Floorplan</h4>
          <div class="map-container">
            <img src="@/assets/Sub System and Icons/V2/B05-11-12_empty.jpg" alt="Map View" class="map-image">
            <div v-for="sensor in sensors" :key="sensor.id" class="sensor-icon" :style="{ top: sensor.top, left: sensor.left }" @click="toggleButtons(sensor)">
              <img :src="getSensorIcon(sensor.type)" alt="Sensor Icon" class="icon-image">
            </div>
            <div v-for="(aircon, index) in airconBoxes" :key="index" class="aircon-box" :style="{ top: aircon.top, left: aircon.left }" @click="toggleAirconButtons(aircon)">
              <img src="@/assets/aircon-icon.png" alt="Aircon Icon" class="icon-image">
            </div>
            <div class="all-buttons">
              <button @click="setAllSwitches(true)" class="btn btn-primary">All ON</button>
              <button @click="setAllSwitches(false)" class="btn btn-danger">All OFF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-3" v-for="device in devices" :key="device.id">
        <div class="device-status-card">
          <h5>{{ device.name }}</h5>
          <p class="status" :class="{ 'text-success': device.isOnline, 'text-danger': !device.isOnline }">{{ device.isOnline ? 'Online' : 'Offline' }}</p>
          <p>Type: {{ device.type }}</p>
        </div>
      </div>
    </div>
    <div class="condition mt-4 text-center">
      <p>If Indoor Air Quality Sensor on acceptable CO2 Level, Motorized Dampener turned off and Fresh Air Fan turn off, else both turned on.</p>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>
    <div v-if="showModal" class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal">×</button>
          </div>
          <div class="modal-body text-center">
            <button v-if="currentType === 'freshAirFan' || currentType === 'aircon'" @click="setSwitch(true, currentType)" class="btn btn-primary">ON</button>
            <button v-if="currentType === 'freshAirFan' || currentType === 'aircon'" @click="setSwitch(false, currentType)" class="btn btn-danger">OFF</button>
            <button v-if="currentType === 'dampener'" @click="setSwitch(true, currentType)" class="btn btn-primary">ON</button>
            <button v-if="currentType === 'dampener'" @click="setSwitch(false, currentType)" class="btn btn-danger">OFF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'HybridAircon',
  data() {
    return {
      showModal: false,
      modalTitle: '',
      currentType: '',
      devices: [
        { id: 1, name: 'Indoor Air Quality Sensor', type: 'Indoor Air Quality Sensor', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 3, name: 'Air-Con System', type: 'Air-Con System', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 6, name: 'MDU 1', type: 'Motorized Dampener', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 8, name: 'Fresh Air Fan 1', type: 'Fresh Air Fan', isOnline: true, lastUpdated: '2024-05-29 14:30:00' }
      ],
      sensors: [
        { id: 1, top: '63%', left: '42%', type: 'freshAirFan', deviceEUI: '24E124782D131774', name: 'Fresh Air Fan 1' },
        { id: 2, top: '62%', left: '77%', type: 'freshAirFan', deviceEUI: '24E124782D131940', name: 'Fresh Air Fan 2' },
        { id: 3, top: '54%', left: '42%', type: 'dampener', deviceEUI: '24E124782D131721', name: 'MDU 1' },
        { id: 4, top: '38%', left: '47%', type: 'dampener', deviceEUI: '24E124782D099018', name: 'MDU 2' }
      ],
      switchStates: Array(8).fill(0), // Initialize with 8 elements
      airconBoxes: [
        { top: '76%', left: '37%', showButtons: false, name: 'FCU 1-1' },
        { top: '75%', left: '46%', showButtons: false, name: 'FCU 1-2' },
        { top: '73%', left: '59%', showButtons: false, name: 'FCU 2-1' },
        { top: '72%', left: '71%', showButtons: false, name: 'FCU 2-2' }
      ] // Positions for aircon boxes
    };
  },
  methods: {
    async sendSwitchCommand(deviceEUI, switchStates) {
      const payload = {
        deviceEui: deviceEUI,
        switchStates: switchStates
      };
      const targetUrl = 'https://hammerhead-app-kva7n.ondigitalocean.app/command/ws558';
      console.log('Sending payload:', payload);
      try {
        const response = await axios.post(targetUrl, payload);
        console.log('Switch command sent successfully', response.data);
      } catch (error) {
        console.error('Error sending switch command:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request data:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        console.error('Config:', error.config);
      }
    },
    async sendAirconCommand(state, airconId) {
      const payload = {
        state: state ? 'on' : 'off'
      };
      const targetUrl = `https://aircon-api.rshare.io/aircon/1`;
      console.log('Sending aircon command:', payload);
      try {
        const response = await axios.post(targetUrl, payload);
        console.log(`Aircon ${airconId} turned ${state ? 'on' : 'off'} successfully`, response.data);
      } catch (error) {
        console.error(`Error turning aircon ${airconId} ${state ? 'on' : 'off'}:`, error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request data:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        console.error('Config:', error.config);
      }
    },
    setAllSwitches(state) {
      const switchStates = Array(8).fill(state ? 1 : 0); // Ensure all 8 switches are controlled
      this.switchStates = switchStates;
      this.sendSwitchCommand("24E124756E049153", switchStates);
    },
    toggleSwitch(index) {
      // Toggle the specified switch state
      this.switchStates = this.switchStates.map((state, idx) => (idx === index - 1 ? (state ? 0 : 1) : state));
      this.sendSwitchCommand("24E124756E049153", this.switchStates);
    },
    setSwitch(state, deviceType) {
      const switchStates = Array(8).fill(state ? 1 : 0);
      this.sensors.forEach(sensor => {
        if (sensor.type === deviceType) {
          this.sendSwitchCommand(sensor.deviceEUI, switchStates);
        }
      });
    },
    setAirconState(state, airconId) {
      this.sendAirconCommand(state, airconId);
    },
    toggleButtons(sensor) {
      this.modalTitle = sensor.name;
      this.currentType = sensor.type;
      this.showModal = true;
    },
    toggleAirconButtons(aircon) {
      this.modalTitle = aircon.name;
      this.currentType = 'aircon';
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    getSensorIcon(type) {
      switch (type) {
        case 'freshAirFan':
          return require('@/assets/fresh-air-fan-icon.png');
        case 'dampener':
          return require('@/assets/dampener-icon.png');
        default:
          return require('@/assets/default-icon.png');
      }
    }
  }
};
</script>
<style scoped>
.container-fluid {
  width: 100%;
  padding: 2rem;
  margin-bottom: 5rem;
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
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 1;
}

.sensor-title,
.aircon-title {
  position: absolute;
  top: -20px; /* Position the title above the icon */
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #000;
  white-space: nowrap;
}

.sensor-icon img,
.aircon-box img {
  width: 24px;
  height: 24px;
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

.all-buttons {
  position: absolute;
  bottom: 50px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.aircon-box {
  position: absolute;
  transform: translate(-50%, -50%);
}

.icon-image {
  width: 24px;
  height: 24px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  display: none;
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
  width: 300px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  flex-grow: 1;
  text-align: center;
}

.btn-close {
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #000;
}

.modal-body {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn-primary,
.btn-danger {
  width: 80px;
  margin: 0 10px;
}
</style>

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

            <!-- Slider Controls -->
            <div class="slider-controls">
              <div class="slider-control">
                <label class="switch">
                  <input type="checkbox" v-model="allDampenerOn" @change="toggleAllDampeners">
                  <span class="slider round"></span>
                </label>
                <span>{{ allDampenerOn ? 'Motorized Dampeners All OFF' : 'Motorized Dampeners All ON' }}</span>
              </div>
              <div class="slider-control">
                <label class="switch">
                  <input type="checkbox" :checked="allAirconOn" @change="toggleAllAircons" ref="airconCheckbox">
                  <span class="slider round"></span>
                </label>
                <span>{{ allAirconOn ? 'Aircons All OFF' : 'Aircons All ON' }}</span>
              </div>

            </div>

            <!-- Sensors -->
            <div v-for="sensor in sensors" :key="sensor.id" class="sensor-icon"
              :style="{ top: sensor.top, left: sensor.left }" @click="toggleButtons(sensor)">
              <img :src="getSensorIcon(sensor.type)" alt="Sensor Icon" class="icon-image">
              <span class="status-dot" :class="sensor.isOnline ? 'online' : 'offline'"></span>
            </div>

            <!-- Aircons (opens modal for each aircon) -->
            <div v-for="(aircon, index) in airconBoxes" :key="index" class="aircon-box"
              :style="{ top: aircon.top, left: aircon.left }" @click="openAirconDialog(aircon)">
              <img src="@/assets/aircon-icon.png" alt="Aircon Icon" class="icon-image">
              <span class="status-dot" :class="aircon.isOnline ? 'online' : 'offline'"></span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Device Status Cards -->
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

    <!-- Condition Dropdown -->
    <div class="row mt-4 condition-dropdown">
      <div class="col-12 text-center">
        <select id="conditionSelect" v-model="selectedCondition" class="form-select" @change="updateCondition">
          <option v-for="(condition, index) in conditions" :key="index" :value="condition">
            {{ condition }}
          </option>
        </select>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>
    <div v-if="showModal" class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal">×</button>
          </div>
          <div class="modal-body text-center">
            <button v-if="currentType === 'aircon'" @click="sendAirconState(true, modalTitle)"
              class="btn btn-primary">ON</button>
            <button v-if="currentType === 'aircon'" @click="sendAirconState(false, modalTitle)"
              class="btn btn-danger">OFF</button>
            <button v-if="currentType === 'freshAirFan' || currentType === 'dampener'"
              @click="setSwitch(true, currentType)" class="btn btn-primary">ON</button>
            <button v-if="currentType === 'freshAirFan' || currentType === 'dampener'"
              @click="setSwitch(false, currentType)" class="btn btn-danger">OFF</button>
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
      allDampenerOn: false,
      allAirconOn: false,
      devices: [
        { id: 1, name: 'Indoor Air Quality Sensor', type: 'Indoor Air Quality Sensor', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 3, name: 'Air-Con System', type: 'Air-Con System', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 6, name: 'Motorized Dampener', type: 'Motorized Dampener', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 8, name: 'Fresh Air Fan', type: 'Fresh Air Fan', isOnline: true, lastUpdated: '2024-05-29 14:30:00' }
      ],
      sensors: [
        { id: 1, top: '54%', left: '42%', type: 'dampener', deviceEUI: '24E124756E049153', name: 'MDU 1', isOnline: false },
        { id: 2, top: '38%', left: '47%', type: 'dampener', deviceEUI: '24E124756E049153', name: 'MDU 2', isOnline: false }
      ],
      airconBoxes: [
        { top: '76%', left: '37%', showButtons: false, name: 'FCU 1-1', isOnline: false },
        { top: '75%', left: '46%', showButtons: false, name: 'FCU 1-2', isOnline: false },
        { top: '73%', left: '59%', showButtons: false, name: 'FCU 2-1', isOnline: false },
        { top: '72%', left: '71%', showButtons: false, name: 'FCU 2-2', isOnline: false }
      ],

      // Conditions Data
      conditions: [
        'Conditions',
        'If Indoor Air Quality Sensor on acceptable CO2 Level, Motorized Dampener turned off and Fresh Air Fan turn off, else both turned on.',
        'If CO2 Level too high, turn on all Fresh Air Fans.',
        'If Motorized Dampener malfunctions, notify the maintenance team immediately.',
      ],
      selectedCondition: '',
      displayedCondition: ''
    };
  },
  methods: {
    openAirconDialog(aircon) {
      this.modalTitle = aircon.name;
      this.currentType = 'aircon';
      this.showModal = true;
    },
    async sendSwitchCommand(deviceEUI, switchStates) {
      const payload = {
        deviceEui: deviceEUI,
        switchStates: switchStates
      };
      const targetUrl = 'https://hammerhead-app-kva7n.ondigitalocean.app/command/ws558';
      try {
        const response = await axios.post(targetUrl, payload);
        console.log('Switch command sent successfully', response.data);
      } catch (error) {
        console.error('Error sending switch command:', error);
      }
    },
    async setSwitch(state, deviceType) {
      let switchStates = Array(8).fill(0);

      if (deviceType === 'dampener') {
        const sensor = this.sensors.find(sensor => sensor.name === this.modalTitle);
        if (sensor) {
          sensor.isOnline = state;
          switchStates[2] = state ? 1 : 0;
          this.sendSwitchCommand(sensor.deviceEUI, switchStates);
        }
      }

      this.closeModal();
    },
    async sendAirconCommand(state) {
      const payload = {
        state: state ? 'on' : 'off'
      };
      const targetUrl = `https://aircon.rshare.io/aircon/control/master`;

      try {
        const response = await axios.post(targetUrl, payload);
        console.log(`Aircons turned ${state ? 'on' : 'off'} successfully`, response.data);
        this.updateAirconStates(state);
      } catch (error) {
        console.error(`Error turning aircons ${state ? 'on' : 'off'}:`, error);
      }
    },
    sendAirconState(state, airconId) {
      let airconIndex;

      // Determine the aircon ID and corresponding index
      if (airconId === 'FCU 1-1') airconIndex = 1;
      else if (airconId === 'FCU 1-2') airconIndex = 2;
      else if (airconId === 'FCU 2-1') airconIndex = 3;
      else if (airconId === 'FCU 2-2') airconIndex = 4;

      const apiUrl = `https://aircon.rshare.io/aircon/${airconIndex}`;
      const payload = {
        state: state ? 'on' : 'off'
      };

      axios.post(apiUrl, payload)
        .then(response => {
          console.log(`Aircon ${airconId} turned ${state ? 'on' : 'off'} successfully`, response.data);
          // Update the UI state
          this.airconBoxes.forEach(aircon => {
            if (aircon.name === airconId) {
              aircon.isOnline = state;
            }
          });
        })
        .catch(error => {
          console.error(`Error turning aircon ${airconId} ${state ? 'on' : 'off'}:`, error);
        });
    },
    toggleButtons(sensor) {
      this.modalTitle = sensor.name;
      this.currentType = sensor.type;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    getSensorIcon(type) {
      if (type === 'dampener') {
        return require('@/assets/dampener-icon.png');
      } else {
        return require('@/assets/default-icon.png');
      }
    },
    updateCondition() {
      this.displayedCondition = this.selectedCondition;
    },
    toggleAllDampeners() {
      this.setAllDevicesState('dampener', this.allDampenerOn);
    },
    toggleAllAircons() {
      // Disable checkbox to prevent double-clicking during API call
      this.$refs.airconCheckbox.disabled = true;

      // Determine the new state to toggle to
      const newState = !this.allAirconOn;

      // Prepare the payload for the API request
      const payload = {
        state: newState ? 'on' : 'off'
      };

      // Send the request to the API
      axios.post('https://aircon.rshare.io/aircon/control/master', payload)
        .then(response => {
          console.log(`All aircons turned ${newState ? 'on' : 'off'} successfully`, response.data);

          // Only update the UI state after the API call is successful
          this.allAirconOn = newState;
          this.updateAirconStates(newState);
        })
        .catch(error => {
          console.error(`Error turning all aircons ${newState ? 'on' : 'off'}:`, error);
          // Optionally, handle errors here
        })
        .finally(() => {
          // Re-enable the checkbox after API call completes
          this.$refs.airconCheckbox.disabled = false;
        });
    },
    // Method to update the status of all aircon boxes in the UI
    updateAirconStates(state) {
      this.airconBoxes.forEach(aircon => {
        aircon.isOnline = state;
      });
    },
    setAllDevicesState(deviceType, state) {
      if (deviceType === 'dampener') {
        this.sensors.forEach(sensor => {
          if (sensor.type === 'dampener') {
            sensor.isOnline = state;
            this.setSwitch(state, 'dampener');
          }
        });
      } else if (deviceType === 'aircon') {
        this.airconBoxes.forEach(aircon => {
          aircon.isOnline = state;
        });
        this.sendAirconCommand(state);
      }
    }
  },
  mounted() {
    if (this.conditions.length > 0) {
      this.selectedCondition = this.conditions[0];
      this.updateCondition();
    }
  }
};
</script>


<style scoped>
/* Basic styling */
.container-fluid {
  width: 100%;
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
  top: -20px;
  /* Position the title above the icon */
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

.bordered-text {
  border: 2px solid #000;
  padding: 10px;
  display: inline-block;
}

/* Condition Dropdown Styling */
.condition-dropdown {
  width: 100%;
  margin-top: 20px;
}

.condition-dropdown .form-select {
  width: 100%;
  max-width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
}

/* Slider Controls Styling */
.slider-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-control span {
  font-size: 14px;
}

/* Toggle Switch Styling */
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
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
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

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
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

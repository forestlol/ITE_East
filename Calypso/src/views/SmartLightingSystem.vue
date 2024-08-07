<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Lighting System</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="relation-section">
          <h4>Sensor Detection</h4>
          <div class="sensor-detection-diagram position-relative">
            <img src="@/assets/Smart Lighting Algo.png" alt="Relation View" class="relation-image">
            <button class="btn btn-primary position-absolute bottom-0 end-0 m-3" @click="openModal">Adjust Condition</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="map-section">
          <h4>Floorplan</h4>
          <div class="map-container">
            <img src="@/assets/Sub System and Icons/V2/B05-11-12_empty.jpg" alt="Map View" class="map-image">
            <div
              v-for="(sensor, index) in sensors"
              :key="index"
              class="sensor-icon"
              :style="{ top: sensor.top, left: sensor.left }"
              @mouseenter="showTooltip(sensor, $event)"
              @mouseleave="hideTooltip"
            >
              <i :class="sensor.icon"></i>
              <div v-if="tooltip.visible && tooltip.name === sensor.name" class="sensor-data">
                <p><strong>{{ sensor.name }}</strong></p>
                <p>Status: {{ sensor.isOnline ? 'Online' : 'Offline' }}</p>
                <p>Last Updated: {{ sensor.lastUpdated }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-3" v-for="device in devices" :key="device.id">
        <div class="device-status-card">
          <h5>{{ device.name }}</h5>
          <p class="status" :class="{'text-success': device.isOnline, 'text-danger': !device.isOnline}">
            {{ device.isOnline ? 'Online' : 'Offline' }}
          </p>
          <p>Type: {{ device.type }}</p>
        </div>
      </div>
    </div>
    <div class="condition mt-4 text-center">
      <p>If PIR sensor motion detect activity, Lights dim up, else light will dim down and turn off</p>
    </div>
    <div class="switch-buttons mt-4 text-center">
      <div v-for="group in ['group7', 'group8', 'group9']" :key="group" class="mb-4">
        <h5>{{ group.toUpperCase() }}</h5>
        <div v-for="(deviceEUI, index) in getGroupDevices(group)" :key="deviceEUI" class="mb-2">
          <button @click="setSwitch(true, deviceEUI)" class="btn btn-primary">ON Switch {{ index + 1 }}</button>
          <button @click="setSwitch(false, deviceEUI)" class="btn btn-danger">OFF Switch {{ index + 1 }}</button>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>
    <div v-if="showModal" class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Adjust Conditions</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="condition-input">
              <label>PIR Sensor</label>
              <select v-model="pirSensorStatus" class="form-control">
                <option value="Activity Detected">Activity Detected</option>
                <option value="No Activity">No Activity</option>
              </select>
            </div>
            <div class="condition-input">
              <label>Lights</label>
              <select v-model="lightsStatus" class="form-control">
                <option value="Dim Up">Dim Up</option>
                <option value="Dim Down">Dim Down</option>
                <option value="Turn Off">Turn Off</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="button" class="btn btn-primary" @click="saveConditions">Save changes</button>
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
      devices: [
        { id: 1, name: 'LoRaWAN Panel', type: 'LoRaWAN Panel', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 2, name: 'LoRaWAN Switch', type: 'LoRaWAN Switch', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 3, name: 'LoRaWAN Panel', type: 'LoRaWAN Panel', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 4, name: 'LoRaWAN Switch', type: 'LoRaWAN Switch', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
      ],
      sensors: [
        { top: '33%', left: '15.2%', icon: 'fas fa-lightbulb', name: 'Sensor 1', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '31%', left: '22.6%', icon: 'fas fa-lightbulb', name: 'Sensor 2', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '28%', left: '30.5%', icon: 'fas fa-lightbulb', name: 'Sensor 3', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '28%', left: '46%', icon: 'fas fa-lightbulb', name: 'Sensor 4', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '28%', left: '38%', icon: 'fas fa-lightbulb', name: 'Sensor 5', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '29%', left: '63%', icon: 'fas fa-lightbulb', name: 'Sensor 6', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '29%', left: '70.7%', icon: 'fas fa-lightbulb', name: 'Sensor 7', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '29%', left: '78.6%', icon: 'fas fa-lightbulb', name: 'Sensor 8', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '43%', left: '63.6%', icon: 'fas fa-lightbulb', name: 'Sensor 9', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '39%', left: '53.4%', icon: 'fas fa-lightbulb', name: 'Sensor 10', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '43%', left: '71.6%', icon: 'fas fa-lightbulb', name: 'Sensor 11', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '43%', left: '79%', icon: 'fas fa-lightbulb', name: 'Sensor 12', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '50%', left: '24.4%', icon: 'fas fa-lightbulb', name: 'Sensor 13', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '50%', left: '31.3%', icon: 'fas fa-lightbulb', name: 'Sensor 14', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '48%', left: '40%', icon: 'fas fa-lightbulb', name: 'Sensor 15', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '47%', left: '47%', icon: 'fas fa-lightbulb', name: 'Sensor 16', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '64%', left: '25.3%', icon: 'fas fa-lightbulb', name: 'Sensor 17', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '67%', left: '40.3%', icon: 'fas fa-lightbulb', name: 'Sensor 18', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '65%', left: '79.6%', icon: 'fas fa-lightbulb', name: 'Sensor 19', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '65%', left: '72%', icon: 'fas fa-lightbulb', name: 'Sensor 20', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '66%', left: '47.3%', icon: 'fas fa-lightbulb', name: 'Sensor 21', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '62%', left: '56.3%', icon: 'fas fa-lightbulb', name: 'Sensor 22', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '65%', left: '64%', icon: 'fas fa-lightbulb', name: 'Sensor 23', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '46%', left: '68.5%', icon: 'fas fa-wifi', name: 'WiFi Gateway 1', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { top: '56%', left: '69%', icon: 'fas fa-wifi', name: 'WiFi Gateway 2', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
      ],
      tooltip: {
        visible: false,
        top: '0px',
        left: '0px',
        name: '',
        isOnline: false,
        lastUpdated: '',
      },
      showModal: false,
      pirSensorStatus: 'Activity Detected',
      lightsStatus: 'Dim Up',
      group7Devices: [
        '24E124782D131774', '24E124782D131940', '24E124782D131721', '24E124782D099018', '24E124782D130904', '24E124782D131065'
      ],
      group8Devices: [
        '24E124782D131508', '24E124782D131142', '24E124782D131803', '24E124782D131818', '24E124782D131201', '24E124782D131779'
      ],
      group9Devices: [
        '24E124782D131156', '24E124782D139009', '24E124782D131050', '24E124782D131870', '24E124782D131793', '24E124782D131824'
      ]
    };
  },
  methods: {
    showTooltip(sensor, event) {
      console.log('showTooltip called', sensor, event);
      this.tooltip.visible = true;
      this.tooltip.top = `${event.clientY + 10}px`;
      this.tooltip.left = `${event.clientX + 10}px`;
      this.tooltip.name = sensor.name;
      this.tooltip.isOnline = sensor.isOnline;
      this.tooltip.lastUpdated = sensor.lastUpdated;
    },
    hideTooltip() {
      console.log('hideTooltip called');
      this.tooltip.visible = false;
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveConditions() {
      // Save the conditions
      alert(`PIR Sensor: ${this.pirSensorStatus}, Lights: ${this.lightsStatus}`);
      this.closeModal();
    },
    async sendSwitchCommand(deviceEUI, switchStates) {
      try {
        await axios.post('https://hammerhead-app-kva7n.ondigitalocean.app/command/ws503', {
          deviceEui: deviceEUI,
          switchStates: switchStates
        });
        console.log('Switch command sent successfully');
      } catch (error) {
        console.error('Error sending switch command:', error);
      }
    },
    async setSwitch(state, deviceEUI) {
      const switchStates = Array(3).fill(state ? 1 : 0);
      await this.sendSwitchCommand(deviceEUI, switchStates);
    },
    getGroupDevices(group) {
      if (group === 'group7') return this.group7Devices;
      if (group === 'group8') return this.group8Devices;
      if (group === 'group9') return this.group9Devices;
      return [];
    }
  }
};
</script>

<style scoped>
.container-fluid {
  width: 100%;
  padding: 2rem;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
}

.row {
  display: flex;
  justify-content: space-between;
}

.relation-section, .map-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 100%;
}

.relation-image, .map-image {
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

.sensor-icon i {
  color: #f39c12;
  font-size: 1rem;
}

.sensor-data {
  display: none;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  top: -120%;
  left: 50%;
  transform: translate(-50%, -10px);
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
}

.sensor-icon:hover .sensor-data {
  display: block;
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

.link-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.link-button .btn {
  padding: 10px 20px;
  font-size: 1.25rem;
}

.condition p {
  font-size: 1.2rem;
  font-weight: bold;
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

.modal-footer {
  padding-top: 10px;
}

.btn-close {
  border: none;
  background: none;
}

.condition-input {
  margin-bottom: 10px;
}

.switch-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

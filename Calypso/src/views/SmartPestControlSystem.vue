<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Pest Control System</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="relation-section">
          <h4>Sensor Detection</h4>
          <div class="sensor-detection-diagram position-relative">
            <img src="@/assets/Smart Pest Control Algo.png" alt="Sensor Detection Diagram" class="relation-image">
            <button class="btn btn-primary position-absolute bottom-0 end-0 m-3" @click="openModal">Adjust Condition</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="map-section">
          <h4>Floorplan</h4>
          <div class="map-container">
            <img src="@/assets/V3/B05-11-12_empty_V3.jpg" alt="Map View" class="map-image">

            <!-- Magnetic Sensors -->
            <div v-for="sensor in magneticSensors" :key="sensor.devEUI" class="magnetic-sensor-icon"
              :style="{ top: sensor.top, left: sensor.left }" @mouseover="showSensorInfo(sensor)" @mouseleave="hideSensorInfo(sensor)">
              <img src="@/assets/Magnetic Sensor.png" alt="Magnetic Sensor Icon" class="icon-image">
              <div class="sensor-info" v-if="sensor.showInfo">
                <h5>Magnetic Sensor</h5>
                <p>Status: {{ sensor.magnet_status === '1' ? 'Closed' : 'Open' }}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-md-3" v-for="device in devices" :key="device.id">
        <div class="device-status-card">
          <h5>{{ device.name }}</h5>
          <p class="status"
            :class="{ 'text-success': device.status === 'Activated', 'text-danger': device.status !== 'Activated' }">{{
              device.status }}</p>
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
                <option value="Detected">Detected</option>
                <option value="Not Detected">Not Detected</option>
              </select>
            </div>
            <div class="condition-input">
              <label>Magnetic Lock</label>
              <select v-model="magneticLockStatus" class="form-control">
                <option value="On">On</option>
                <option value="Off">Off</option>
              </select>
            </div>
            <div class="condition-input">
              <label>Camera</label>
              <select v-model="cameraStatus" class="form-control">
                <option value="On">On</option>
                <option value="Off">Off</option>
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
  name: 'SmartPestControlSystem',
  data() {
    return {
      devices: [
        { id: 1, name: 'Magnetic Lock', status: 'Activated' },
        { id: 2, name: 'PIR Sensor', status: 'Activated' },
        { id: 3, name: 'Camera', status: 'Activated' },
        { id: 4, name: 'Rat Trap', status: 'Activated' },
      ],
      showModal: false,
      pirSensorStatus: 'Detected',
      magneticLockStatus: 'On',
      cameraStatus: 'On',
      magneticSensors: [],
      // Conditions Data
      conditions: [
        'Conditions',
        'If PIR sensor motion detected, then magnetic lock turn on, camera turn on',
        'If PIR sensor motion detected, then camera turn on',
        'If rat trap triggered, then alert sound',
      ],
      selectedCondition: '',
      displayedCondition: '',
    };
  },
  methods: {
    async fetchMagneticSensorData() {
      try {
        const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Lorawan/latest/sheet/Magnetic');
        const data = response.data;

        // Set the top and left positions individually for each sensor
        this.magneticSensors = [
          {
            ...data['24e124141e151801'], // Assuming this is the first sensor's key
            top: '24%', // Set the individual top position
            left: '69%', // Set the individual left position
            showInfo: false
          },
          {
            ...data['24e124141e151546'], // Assuming this is the second sensor's key
            top: '24%', // Set the individual top position
            left: '65%', // Set the individual left position
            showInfo: false
          }
        ];
      } catch (error) {
        console.error('Error fetching magnetic sensor data:', error);
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveConditions() {
      // Save the conditions
      alert(`PIR Sensor: ${this.pirSensorStatus}, Magnetic Lock: ${this.magneticLockStatus}, Camera: ${this.cameraStatus}`);
      this.closeModal();
    },
    updateCondition() {
      this.displayedCondition = this.selectedCondition;
    },
    showSensorInfo(sensor) {
      sensor.showInfo = true;
    },
    hideSensorInfo(sensor) {
      sensor.showInfo = false;
    },
  },
  mounted() {
    // Fetch the magnetic sensor data when the component is mounted
    this.fetchMagneticSensorData();

    // Set the default condition to the first one in the list
    if (this.conditions.length > 0) {
      this.selectedCondition = this.conditions[0];
      this.updateCondition();
    }
  },
};
</script>

<style scoped>
.container-fluid {
  width: 100%;
  height: 100vh;
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

.magnetic-sensor-icon {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.icon-image {
  width: 24px;
  height: 24px;
}

.sensor-info {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  border-radius: 3px;
  text-align: center;
  white-space: nowrap;
  z-index: 10;
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
</style>

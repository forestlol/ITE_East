<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Landscape System</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="relation-section">
          <h4>Relation View</h4>
          <div class="relation-view-container">
            <div class="relation-view position-relative">
              <img src="@/assets/Smart Landscape Algo 2 empty.png" alt="Relation View" class="relation-image">
              <div v-for="(point, index) in relationPoints" :key="index"
                :style="{ top: point.y + '%', left: point.x + '%', position: 'absolute', transform: 'translate(-50%, -50%)' }"
                @mouseenter="showValue(index, $event)" @mouseleave="hideValue" :class="{'relation-point': true, 'point-label-break': point.type === 'break'}">
                <template v-if="point.type === 'sensor'">
                  <span class="point-number">{{ point.number }}</span>
                </template>
                <template v-else>
                  <span class="point-label">{{ formatLabel(point.label) }}</span>
                </template>
                <span v-if="hoveredIndex === index" class="value-tooltip">
                  <h5>{{ point.type === 'sensor' ? `Sensor ${point.number}` : point.label }}</h5>
                  <template v-if="point.type === 'sensor'">
                    <p>Temperature: {{ point.data.temperature }}°C</p>
                    <p>Humidity: {{ point.data.humidity }}%</p>
                    <p>Pressure: {{ point.data.pressure }} hPa</p>
                    <p>CO2: {{ point.data.co2 }} ppm</p>
                  </template>
                  <template v-else-if="point.type === 'status'">
                    <p>{{ point.label }}: {{ point.status }}</p>
                  </template>
                  <template v-else-if="point.type === 'reading'">
                    <p>{{ point.label }}: {{ point.reading }}</p>
                  </template>
                </span>
              </div>
            </div>
            <div class="adjust-button-container">
              <button @click="openModal" class="btn btn-primary">Adjust Condition</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="map-section">
          <h4>Floorplan View</h4>
          <div class="map-container" @mousedown="startPan" @mousemove="pan" @mouseup="endPan" @mouseleave="endPan"
            @wheel="onWheel">
            <img src="@/assets/Sub System and Icons/V2/smart Landscape systemV2.png" alt="Map View" class="map-image"
              :style="{ transform: `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)` }">
            <div class="zoom-controls">
              <button class="btn btn-secondary" @click="zoomIn">+</button>
              <button class="btn btn-secondary" @click="zoomOut">-</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-md-3" v-for="device in devices" :key="device.id">
        <div class="device-status-card position-relative">
          <h5>{{ device.name }}</h5>
          <button v-if="device.name === '7 in 1 Sensor' || device.name === 'Solenoid Valve'"
            class="btn btn-sm position-absolute top-0 end-0 mt-2 mr-2 rounded-circle">
            <i class="fas fa-plus"></i>
          </button>
          <p class="status" :class="{ 'text-success': device.isOnline, 'text-danger': !device.isOnline }">{{
                device.isOnline ? 'Online' : 'Offline' }}</p>
        </div>
      </div>
    </div>
    <div class="condition mt-4 text-center">
      <p>If 7 in 1 Sensor, Rainfall Sensor, Lux Sensor, Water Level Sensor Threshold met, Main pump turn on, Dosing pump
        turn on when Threshold met and turn on Solenoid Valve.</p>
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
            <div v-for="condition in conditions" :key="condition.id" class="condition-input">
              <label>{{ condition.label }}</label>
              <input type="number" v-model="condition.value" class="form-control" />
            </div>
            <div class="condition-input">
              <label>Main Pump</label>
              <select v-model="mainPumpStatus" class="form-control">
                <option value="On">On</option>
                <option value="Off">Off</option>
              </select>
            </div>
            <div class="condition-input">
              <label>Dosing Pump</label>
              <select v-model="dosingPumpStatus" class="form-control">
                <option value="On">On</option>
                <option value="Off">Off</option>
              </select>
            </div>
            <div class="condition-input">
              <label>Solenoid Valve</label>
              <select v-model="solenoidValveStatus" class="form-control">
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
    <div class="switch-buttons mt-4 text-center">
      <button @click="setAllSwitches(true, '24e124756e049564')" class="btn btn-primary">ON ALL (Outdoor 1st)</button>
      <button @click="setAllSwitches(false, '24e124756e049564')" class="btn btn-danger">OFF ALL (Outdoor 1st)</button>
      <button v-for="n in 8" :key="n" @click="toggleSwitch(n, '24e124756e049564')" :class="{'btn-success': switchStatesOutdoor1[n-1], 'btn-secondary': !switchStatesOutdoor1[n-1]}" class="btn">
        SWITCH {{ n }} {{ switchStatesOutdoor1[n-1] ? 'ON' : 'OFF' }}
      </button>

      <button @click="setAllSwitches(true, '24e124756e049516')" class="btn btn-primary">ON ALL (Outdoor 2nd)</button>
      <button @click="setAllSwitches(false, '24e124756e049516')" class="btn btn-danger">OFF ALL (Outdoor 2nd)</button>
      <button v-for="n in 8" :key="n" @click="toggleSwitch(n, '24e124756e049516')" :class="{'btn-success': switchStatesOutdoor2[n-1], 'btn-secondary': !switchStatesOutdoor2[n-1]}" class="btn">
        SWITCH {{ n + 8 }} {{ switchStatesOutdoor2[n-1] ? 'ON' : 'OFF' }}
      </button>

      <button @click="setAllSwitches(true, '24E124756E049454')" class="btn btn-primary">ON ALL (Outdoor 3)</button>
      <button @click="setAllSwitches(false, '24E124756E049454')" class="btn btn-danger">OFF ALL (Outdoor 3)</button>
      <button v-for="n in 3" :key="n" @click="toggleSwitch(n, '24E124756E049454')" :class="{'btn-success': switchStatesOutdoor3[n-1], 'btn-secondary': !switchStatesOutdoor3[n-1]}" class="btn">
        SWITCH {{ n + 16 }} {{ switchStatesOutdoor3[n-1] ? 'ON' : 'OFF' }}
      </button>
    </div>
  </div>
  <div class="link-button mt-4">
    <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SmartLandscapeSystem',
  data() {
    return {
      devices: [
        { id: 1, name: '7 in 1 Sensor', isOnline: true },
        { id: 2, name: 'Rainfall Sensor', isOnline: false },
        { id: 3, name: 'Lux Sensor', isOnline: true },
        { id: 4, name: 'Water Level Sensor', isOnline: true },
        { id: 5, name: 'Main Pump', isOnline: true },
        { id: 6, name: 'Dosing Pump', isOnline: true },
        { id: 7, name: 'Solenoid Valve', isOnline: true },
      ],
      relationPoints: [
        { number: 1, type: 'sensor', x: 15, y: 20, data: { temperature: 25, humidity: 60, pressure: 1012, co2: 400 } },
        { number: 2, type: 'sensor', x: 21, y: 20, data: { temperature: 26, humidity: 65, pressure: 1013, co2: 410 } },
        { number: 3, type: 'sensor', x: 27.6, y: 20, data: { temperature: 27, humidity: 70, pressure: 1014, co2: 420 } },
        { number: 4, type: 'sensor', x: 34, y: 20, data: { temperature: 28, humidity: 75, pressure: 1015, co2: 430 } },
        { number: 5, type: 'sensor', x: 15, y: 31, data: { temperature: 29, humidity: 80, pressure: 1016, co2: 440 } },
        { number: 6, type: 'sensor', x: 21, y: 31, data: { temperature: 30, humidity: 85, pressure: 1017, co2: 450 } },
        { number: 7, type: 'sensor', x: 27.6, y: 31, data: { temperature: 31, humidity: 90, pressure: 1018, co2: 460 } },
        { number: 8, type: 'sensor', x: 34, y: 31, data: { temperature: 32, humidity: 95, pressure: 1019, co2: 470 } },
        { number: 9, type: 'sensor', x: 15, y: 42, data: { temperature: 33, humidity: 60, pressure: 1020, co2: 480 } },
        { number: 10, type: 'sensor', x: 21, y: 42, data: { temperature: 34, humidity: 65, pressure: 1021, co2: 490 } },
        { number: 11, type: 'sensor', x: 27.6, y: 42, data: { temperature: 35, humidity: 70, pressure: 1022, co2: 500 } },
        { number: 12, type: 'sensor', x: 34, y: 42, data: { temperature: 36, humidity: 75, pressure: 1023, co2: 510 } },
        { number: 13, type: 'sensor', x: 14.7, y: 53, data: { temperature: 37, humidity: 80, pressure: 1024, co2: 520 } },
        { number: 14, type: 'sensor', x: 21, y: 53, data: { temperature: 38, humidity: 85, pressure: 1025, co2: 530 } },
        { number: 15, type: 'sensor', x: 27.6, y: 53, data: { temperature: 39, humidity: 90, pressure: 1026, co2: 540 } },
        { number: 16, type: 'sensor', x: 34, y: 53, data: { temperature: 40, humidity: 95, pressure: 1027, co2: 550 } },
        { number: 17, type: 'sensor', x: 14.7, y: 63.5, data: { temperature: 41, humidity: 60, pressure: 1028, co2: 560 } },
        { number: 1, type: 'sensor', x: 68, y: 47, data: { temperature: 42, humidity: 65, pressure: 1029, co2: 570 } },
        { number: 2, type: 'sensor', x: 72.5, y: 47, data: { temperature: 43, humidity: 70, pressure: 1030, co2: 580 } },
        { number: 3, type: 'sensor', x: 77, y: 47, data: { temperature: 44, humidity: 75, pressure: 1031, co2: 590 } },
        { number: 4, type: 'sensor', x: 81.7, y: 47, data: { temperature: 45, humidity: 80, pressure: 1032, co2: 600 } },
        { number: 5, type: 'sensor', x: 86.5, y: 47, data: { temperature: 46, humidity: 85, pressure: 1033, co2: 610 } },
        { number: 6, type: 'sensor', x: 68, y: 55, data: { temperature: 47, humidity: 90, pressure: 1034, co2: 620 } },
        { number: 7, type: 'sensor', x: 72.5, y: 55, data: { temperature: 48, humidity: 95, pressure: 1035, co2: 630 } },
        { number: 8, type: 'sensor', x: 77, y: 55, data: { temperature: 49, humidity: 60, pressure: 1036, co2: 640 } },
        { number: 9, type: 'sensor', x: 81.7, y: 55, data: { temperature: 50, humidity: 65, pressure: 1037, co2: 650 } },
        { number: 10, type: 'sensor', x: 86.5, y: 55, data: { temperature: 51, humidity: 70, pressure: 1038, co2: 660 } },
        { number: 11, type: 'sensor', x: 68, y: 62.5, data: { temperature: 52, humidity: 75, pressure: 1039, co2: 670 } },
        { number: 12, type: 'sensor', x: 72.6, y: 62.5, data: { temperature: 53, humidity: 80, pressure: 1040, co2: 680 } },
        { number: 13, type: 'sensor', x: 77.3, y: 62.5, data: { temperature: 54, humidity: 85, pressure: 1041, co2: 690 } },
        { number: 14, type: 'sensor', x: 81.9, y: 62.5, data: { temperature: 55, humidity: 90, pressure: 1042, co2: 700 } },
        { number: 15, type: 'sensor', x: 86.7, y: 62.5, data: { temperature: 56, humidity: 95, pressure: 1043, co2: 710 } },
        { number: 16, type: 'sensor', x: 68, y: 70, data: { temperature: 57, humidity: 60, pressure: 1044, co2: 720 } },
        { number: 17, type: 'sensor', x: 72.7, y: 70, data: { temperature: 58, humidity: 65, pressure: 1045, co2: 730 } },
        { number: 18, type: 'sensor', x: 77.3, y: 70, data: { temperature: 59, humidity: 70, pressure: 1046, co2: 740 } },
        { number: 19, type: 'sensor', x: 81.9, y: 70, data: { temperature: 60, humidity: 75, pressure: 1047, co2: 750 } },
        { label: 'Main Pump', type: 'status', x: 48.4, y: 57, status: 'On' },
        { label: 'Rainfall Sensor', type: 'reading', x: 15.4, y: 77, reading: '10 mm' },
        { label: 'Lux Sensor', type: 'reading', x: 24.5, y: 77, reading: '1500 lux' },
        { label: 'Water Level Sensor', type: 'reading', x: 34, y: 77, reading: '75%' },
        { label: 'Dosing Pump', type: 'status', x: 61.3, y: 21, status: 'Off' },
        { label: '7-in-1 Sensor (Readings/Threshold)', type: 'title', x: 18.5, y: 10 },
        { label: '(Readings/ Threshold)', x: 15.5, y: 85, type: 'break' },
        { label: '(Readings/ Threshold)', x: 24.5, y: 85, type: 'break' },
        { label: '(Readings/ Threshold)', x: 34, y: 85, type: 'break' },
        { label: 'ON/OFF', type: 'title', x: 48.5, y: 48 },
        { label: 'ON/OFF, (Readings/Threshold)', type: 'title', x: 61.5, y: 11 },
        { label: 'Solenoid Valve ON/OFF', type: 'title', x: 68, y: 37 },
      ],
      hoveredIndex: null,
      tooltipX: 0,
      tooltipY: 0,
      zoomLevel: 1,
      translateX: 0,
      translateY: 0,
      isPanning: false,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      animationFrame: null,
      showModal: false,
      conditions: [
        { id: 1, label: 'Temperature Threshold', value: 30 },
        { id: 2, label: 'Humidity Threshold', value: 70 },
        { id: 3, label: 'Pressure Threshold', value: 1015 },
        { id: 4, label: 'CO2 Threshold', value: 450 },
      ],
      mainPumpStatus: 'Off',
      dosingPumpStatus: 'Off',
      solenoidValveStatus: 'Off',
      switchStatesOutdoor1: Array(8).fill(false), // Initialize all switches to OFF for Outdoor 1st
      switchStatesOutdoor2: Array(8).fill(false), // Initialize all switches to OFF for Outdoor 2nd
      switchStatesOutdoor3: Array(8).fill(false), // Initialize all switches to OFF for Outdoor 3rd
    };
  },
  methods: {
    zoomIn() {
      this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
    },
    zoomOut() {
      this.zoomLevel = Math.max(this.zoomLevel - 0.1, 1);
    },
    onWheel(event) {
      event.preventDefault();
      const delta = Math.sign(event.deltaY) * -0.1;
      this.zoomLevel = Math.min(Math.max(this.zoomLevel + delta, 1), 2);
    },
    startPan(event) {
      this.isPanning = true;
      this.startX = event.clientX - this.translateX;
      this.startY = event.clientY - this.translateY;
      this.lastX = event.clientX;
      this.lastY = event.clientY;
    },
    pan(event) {
      if (!this.isPanning) return;

      const dx = event.clientX - this.lastX;
      const dy = event.clientY - this.lastY;

      this.lastX = event.clientX;
      this.lastY = event.clientY;

      this.translateX += dx / this.zoomLevel;
      this.translateY += dy / this.zoomLevel;

      if (!this.animationFrame) {
        this.animationFrame = requestAnimationFrame(this.updatePan);
      }
    },
    updatePan() {
      this.$forceUpdate();
      this.animationFrame = null;
    },
    endPan() {
      this.isPanning = false;
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    },
    showValue(index, event) {
      const containerRect = event.currentTarget.getBoundingClientRect();
      const pointRect = event.target.getBoundingClientRect();
      this.tooltipX = pointRect.x + pointRect.width / 2 - containerRect.x;
      this.tooltipY = pointRect.y - containerRect.y - 10; // Adjust for positioning above the point
      this.hoveredIndex = index;
    },
    hideValue() {
      this.hoveredIndex = null;
    },
    navigateTo3DLandscape() {
      window.location.href = 'https://visualizer-lite-html.vercel.app/?site=23&levels=91';
    },
    formatLabel(label) {
      if (label === 'Main Pump') {
        return label;
      }
      return label.replace(' ', '\n');
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveConditions() {
      // Save the conditions
      this.closeModal();
    },
    async sendSwitchCommand(switchStates, deviceEUI) {
      try {
        const response = await axios.post('https://152.42.161.80:4000/ws558/', {
          device_eui: deviceEUI,
          switch_states: switchStates
        });
        console.log('Switch command sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending switch command:', error);
      }
    },
    setAllSwitches(state, deviceEUI) {
      let switchStates = [];
      if (deviceEUI === '24e124756e049564') {
        this.switchStatesOutdoor1 = this.switchStatesOutdoor1.map(() => state);
        switchStates = this.switchStatesOutdoor1;
      } else if (deviceEUI === '24e124756e049516') {
        this.switchStatesOutdoor2 = this.switchStatesOutdoor2.map(() => state);
        switchStates = this.switchStatesOutdoor2;
      } else if (deviceEUI === '24E124756E049454') {
        this.switchStatesOutdoor3 = this.switchStatesOutdoor3.map(() => state);
        switchStates = this.switchStatesOutdoor3;
      }
      this.sendSwitchCommand(switchStates, deviceEUI);
      console.log('All switches:', switchStates);
    },
    toggleSwitch(index, deviceEUI) {
      if (deviceEUI === '24e124756e049564') {
        this.switchStatesOutdoor1[index - 1] = !this.switchStatesOutdoor1[index - 1];
        this.sendSwitchCommand(this.switchStatesOutdoor1, deviceEUI);
        console.log(`Switch ${index} toggled to:`, this.switchStatesOutdoor1[index - 1]);
        console.log('Current switch states (Outdoor 1st):', this.switchStatesOutdoor1);
      } else if (deviceEUI === '24e124756e049516') {
        this.switchStatesOutdoor2[index - 1] = !this.switchStatesOutdoor2[index - 1];
        this.sendSwitchCommand(this.switchStatesOutdoor2, deviceEUI);
        console.log(`Switch ${index + 8} toggled to:`, this.switchStatesOutdoor2[index - 1]);
        console.log('Current switch states (Outdoor 2nd):', this.switchStatesOutdoor2);
      } else if (deviceEUI === '24E124756E049454') {
        this.switchStatesOutdoor3[index - 1] = !this.switchStatesOutdoor3[index - 1];
        this.sendSwitchCommand(this.switchStatesOutdoor3, deviceEUI);
        console.log(`Switch ${index + 16} toggled to:`, this.switchStatesOutdoor3[index - 1]);
        console.log('Current switch states (Outdoor 3rd):', this.switchStatesOutdoor3);
      }
    }
  }
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
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

.btn-primary.btn-sm i.bi {
  background-color: transparent;
  border-radius: 50%;
  padding: 10px;
  font-size: 1.5rem;
}

.container-fluid {
  width: 100%;
  min-height: 100vh;
  padding: 0 2rem;
  box-sizing: border-box;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 0;
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

.relation-view-container {
  position: relative;
}

.relation-image,
.map-image {
  width: 100%;
  height: auto;
  transition: transform 0.1s ease-out;
}

.relation-point {
  padding: 5px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  position: relative;
}

.point-number {
  font-size: 0.75rem;
  /* Normal font size */
  text-align: center;
}

.point-label {
  font-size: 0.5rem;
  /* Smaller font size */
  white-space: pre-line;
  /* Allows line breaks */
  text-align: center;
}

.point-label-break {
  font-size: 0.5rem;
  text-align: center;
  white-space: pre-wrap;
}

.value-tooltip {
  position: absolute;
  transform: translate(-50%, -50%);
  /* Center and position above */
  background-color: rgba(0, 0, 0, 0.8);
  /* Solid background */
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 1000;
  /* Bring to front */
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  /* Ensure the tooltip does not block mouse events */
}

.value-tooltip h5 {
  margin: 0;
  margin-bottom: 5px;
}

.adjust-button-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.map-container {
  overflow: hidden;
  height: 100%;
  position: relative;
  cursor: grab;
}

.map-container:active {
  cursor: grabbing;
}

.zoom-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
}

.condition p {
  font-size: 1.2rem;
  font-weight: bold;
}

.zoom-controls .btn {
  margin: 2px 0;
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

.switch-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.switch-buttons .btn {
  margin: 5px;
}
</style>

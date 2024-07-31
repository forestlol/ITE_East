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
          <div 
            class="map-container"
            @mousedown="startPan"
            @mousemove="pan"
            @mouseup="endPan"
            @mouseleave="endPan"
            @wheel="onWheel"
          >
            <img 
              src="@/assets/Sub System and Icons/V2/B05-11-12_Smart Pest Control System.jpg" 
              alt="Map View" 
              class="map-image"
              :style="{ transform: `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)` }"
            >
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
        <div class="device-status-card">
          <h5>{{ device.name }}</h5>
          <p class="status" :class="{'text-success': device.status === 'Activated', 'text-danger': device.status !== 'Activated'}">{{ device.status }}</p>
        </div>
      </div>
    </div>
    <div class="condition mt-4 text-center">
      <p>If PIR sensor motion detected, then magnetic lock turn on, camera turn on</p>
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
export default {
  name: 'SmartPestControlSystem',
  data() {
    return {
      devices: [
        { id: 1, name: 'Magnetic Lock', status: 'Activated' },
        { id: 2, name: 'PIR Sensor', status: 'Activated' },
        { id: 3, name: 'Camera', status: 'Activated' },
        { id: 4, name: 'Rat Trap', status: 'Not Activated' },
      ],
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
      pirSensorStatus: 'Detected',
      magneticLockStatus: 'On',
      cameraStatus: 'On',
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
</style>

<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Washroom System</h2>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="map-section">
          <h4>Floorplan</h4>
          <div class="map-container">
            <img 
              src="@/assets/Sub System and Icons/V2/smart washroom system_V2.jpg" 
              alt="Map View" 
              class="map-image"
            >
            <!-- Multiple Icons on the Floorplan -->
            <div 
              v-for="(icon, index) in icons"
              :key="index"
              class="icon-container"
              :style="{ top: icon.top, left: icon.left }"
              @mouseenter="showValue(index, $event)"
              @mouseleave="hideValue"
            >
              <img :src="icon.src" alt="Sensor Icon" class="icon-image">
              <!-- Tooltip should only show when hoveredIndex matches -->
              <div v-if="hoveredIndex === index" class="tooltip" :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }">
                <h5>{{ icon.label }}</h5>
                <p>Temperature: {{ icon.temperature }}°C</p>
                <p>Humidity: {{ icon.humidity }}%</p>
                <p>Pressure: {{ icon.pressure }} hPa</p>
                <p>CO2: {{ icon.co2 }} ppm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Display hovered index for debugging -->
    <div class="row mt-4">
      <div class="col-md-12">
        <p v-if="hoveredIndex !== null">Hovered Index: {{ hoveredIndex }}</p>
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
    <div class="link-button mt-4">
      <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
    </div>
  </div>
</template>

<script>
import sensorIcon from '@/assets/sensor-icon.png'; // Adjust the path to your project structure

export default {
  name: 'SmartWashroomSystem',
  data() {
    return {
      devices: [
        { id: 1, name: 'People Counting Sensor', type: 'People Counting Sensor', isOnline: true },
        { id: 2, name: 'Occupancy Sensor', type: 'Occupancy Sensor', isOnline: true },
        { id: 3, name: 'Odor Sensor', type: 'Odor Sensor', isOnline: true },
        { id: 4, name: 'Gateway', type: 'LoRaWAN Gateway', isOnline: true },
      ],
      hoveredIndex: null, // Keeps track of the hovered icon's index
      icons: [
        { top: '50%', left: '50%', src: sensorIcon, label: 'Sensor 1', temperature: 42, humidity: 65, pressure: 1029, co2: 570 },
        { top: '30%', left: '60%', src: sensorIcon, label: 'Sensor 2', temperature: 38, humidity: 60, pressure: 1015, co2: 480 },
        { top: '70%', left: '40%', src: sensorIcon, label: 'Sensor 3', temperature: 40, humidity: 55, pressure: 1009, co2: 450 },
      ],
      tooltipX: 0,
      tooltipY: 0,
    };
  },
  methods: {
    showValue(index, event) {
      const iconRect = event.target.getBoundingClientRect();
      this.tooltipX = iconRect.left + iconRect.width / 2; // Center horizontally relative to the icon
      this.tooltipY = iconRect.top - 10; // Position above the icon with a small offset

      this.hoveredIndex = index;
    },
    hideValue() {
      this.hoveredIndex = null;
    },
    navigateTo3DLandscape() {
      window.location.href = 'https://visualizer-lite-html.vercel.app/?site=23&levels=92';
    },
  },
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

.map-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 100%;
}

.map-image {
  width: 100%;
  height: auto;
}

.map-container {
  overflow: hidden;
  height: 100%;
  position: relative;
  cursor: default;
  display: flex;
  justify-content: center;
  align-items: center;
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

/* Icon Container */
.icon-container {
  position: absolute;
  width: 24px;
  height: 24px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 1000; /* Ensure it's above other elements */
}

.icon-image {
  width: 100%;
  height: 100%;
}

/* Tooltip for Sensor Value */
.tooltip {
  position: absolute;
  transform: translate(-50%, -100%); /* Center and position above the icon */
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 8px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 12px;
  z-index: 1001; /* Ensure it appears above the icon */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>

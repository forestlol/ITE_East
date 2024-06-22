<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">IAQ Devices Reading</h2>
    <div class="row">
      <div class="col-md-3">
        <h4 class="section-title">IAQ Devices</h4>
        <div class="device-list">
          <div
            v-for="device in devices"
            :key="device.id"
            :class="['device-item', { 'highlight': hoveredDevice === device.id }]"
            @mouseenter="hoveredDevice = device.id"
            @mouseleave="hoveredDevice = null"
          >
            <h5>{{ device.name }}</h5>
            <p>Temperature: {{ device.temperature }}°C</p>
            <p>Humidity: {{ device.humidity }}%</p>
            <p>Pressure: {{ device.pressure }} hPa</p>
            <p>CO2: {{ device.co2 }} ppm</p>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div class="view-switcher">
          <button @click="toggleView('relation')" :class="{'active': currentView === 'relation'}">Relation</button>
          <button @click="toggleView('floorplan')" :class="{'active': currentView === 'floorplan'}">Floorplan</button>
        </div>
        <div class="view-container" v-if="currentView === 'relation'">
          <p>Relation view content goes here.</p>
          <!-- Replace the p tag above with the actual image tag when you have the image -->
        </div>
        <div class="view-container" v-if="currentView === 'floorplan'">
          <p>Floorplan view content goes here.</p>
          <!-- Replace the p tag above with the actual image tag when you have the image -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IAQDevicesReadingPage',
  data() {
    return {
      currentView: 'relation',
      hoveredDevice: null,
      devices: [
        { id: 1, name: 'Device 1', temperature: 22, humidity: 45, pressure: 1013, co2: 400 },
        { id: 2, name: 'Device 2', temperature: 23, humidity: 50, pressure: 1012, co2: 420 },
        { id: 3, name: 'Device 3', temperature: 21, humidity: 55, pressure: 1011, co2: 410 },
        { id: 4, name: 'Device 4', temperature: 20, humidity: 60, pressure: 1010, co2: 430 },
        { id: 5, name: 'Device 5', temperature: 19, humidity: 65, pressure: 1009, co2: 440 },
        { id: 6, name: 'Device 6', temperature: 24, humidity: 70, pressure: 1008, co2: 450 },
        { id: 7, name: 'Device 7', temperature: 25, humidity: 75, pressure: 1007, co2: 460 },
        { id: 8, name: 'Device 8', temperature: 26, humidity: 80, pressure: 1006, co2: 470 },
        { id: 9, name: 'Device 9', temperature: 27, humidity: 85, pressure: 1005, co2: 480 },
      ],
    };
  },
  methods: {
    toggleView(view) {
      this.currentView = view;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}
.device-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 80vh;
  overflow-y: auto;
}
.device-list::-webkit-scrollbar {
  width: 8px;
}
.device-list::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 5px;
}
.device-list::-webkit-scrollbar-thumb {
  background-color: #007bff;
  border-radius: 5px;
  border: 2px solid #f8f9fa;
}
.device-item {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.device-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.device-item h5 {
  margin-bottom: 10px;
  font-size: 1.25rem;
  font-weight: bold;
  color: #007bff;
}
.view-switcher {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.view-switcher button {
  background-color: #f8f9fa;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}
.view-switcher button.active {
  background-color: #007bff;
  color: white;
}
.view-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px; /* Adjust as needed */
  background-color: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.highlight {
  border: 2px solid #00BCD4;
  border-radius: 5px;
}
</style>

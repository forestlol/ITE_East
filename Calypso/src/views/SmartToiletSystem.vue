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
              <div 
                v-if="hoveredIndex === index" 
                class="value-tooltip"
                :style="{ top: `${tooltipY}px`, left: `${tooltipX}px` }"
              >
                <h5>{{ icon.label }}</h5>
                <template v-if="icon.type === 'Water Meter'">
                  <p>Water Flow: {{ icon.waterFlow }} L/min</p>
                  <p>Water Consumption: {{ icon.waterConsumption }} L</p>
                </template>
                <template v-else-if="icon.type === 'People Counter'">
                  <p>People Count: {{ icon.peopleCount }}</p>
                </template>
                <template v-else-if="icon.type === 'Odor Sensor'">
                  <p>Ammonia Level: {{ icon.ammoniaLevel }} ppm</p>
                  <p>Hydrogen Sulfide Level: {{ icon.hydrogenSulfideLevel }} ppm</p>
                </template>
                <template v-else>
                  <p>Temperature: {{ icon.temperature }}°C</p>
                  <p>Humidity: {{ icon.humidity }}%</p>
                  <p>Pressure: {{ icon.pressure }} hPa</p>
                  <p>CO2: {{ icon.co2 }} ppm</p>
                </template>
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
        </div>
      </div>
    </div>
    <div class="link-button mt-4">
      <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
    </div>
  </div>
</template>
<script>
import waterMeterIcon from '@/assets/water-meter-sensor.png';
import peopleCounterIcon from '@/assets/peopleCounter.png';
import odorIcon from '@/assets/Odor.png';

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
      hoveredIndex: null,
      tooltipX: 0,
      tooltipY: 0,
      icons: [
        // { top: '30.4%', left: '41.5%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', peopleCount: 34  },
        // { top: '30.4%', left: '70.4%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', peopleCount: 35 },
        { top: '48%', left: '32.3%', src: waterMeterIcon, label: 'Water Meter', type: 'Water Meter', waterFlow: 15, waterConsumption: 1200 },
        // { top: '72%', left: '33.1%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', peopleCount: 35 },
        { top: '53.6%', left: '34.7%', src: odorIcon, label: 'Odor Sensor', type: 'Odor Sensor', ammoniaLevel: 5, hydrogenSulfideLevel: 3 },
        { top: '57.6%', left: '59.6%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', peopleCount: 35 },
        { top: '40.6%', left: '35%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', peopleCount: 34 },
        // { top: '65%', left: '92.5%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', peopleCount: 34 },
      ],
    };
  },
  methods: {
    showValue(index, event) {
      const containerRect = event.currentTarget.getBoundingClientRect();
      const pointRect = event.target.getBoundingClientRect();
      this.tooltipX = pointRect.x + pointRect.width / 2 - containerRect.x;
      this.tooltipY = pointRect.y - containerRect.y - 10;
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
.value-tooltip {
  position: absolute;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 12px;
}
</style>

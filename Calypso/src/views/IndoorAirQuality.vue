<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Indoor Air Quality System</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="relation-section">
          <h4>Sensor Detection</h4>
          <div class="sensor-detection-diagram">
            <div class="image-container">
              <img src="@/assets/IAQ Pic.jpg" alt="Relation View" class="relation-image">
              <div v-for="box in boxes" :key="box.id" class="clickable-box" @click="changeImage(box.id)"
                :style="{ top: box.top, left: box.left }"></div>
              <div v-for="sensor in sensors" :key="sensor.id" class="sensor-data"
                :style="{ top: sensor.top, left: sensor.left }">
                <div class="sensor-row">
                  <p class="co2">
                    <b>CO2</b>
                  </p>
                  <p class="pressure">
                    <b>Pressure</b>
                  </p>
                </div>
                <div class="sensor-row">
                  <p class="co2">
                    {{ sensor.co2 }} ppm
                  </p>
                  <p class="pressure">
                    {{ sensor.pressure }}
                  </p>
                </div>
                <div class="sensor-row">
                  <p class="temperature-humidity">
                    <i class="fas fa-thermometer-half"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <i class="fas fa-tint ml-3"></i>&nbsp;&nbsp;
                    <b style="font-size:0.5rem;">PM2.5</b>&nbsp;
                    <b class="ml-3" style="font-size:0.5rem;">PM10</b>
                  </p>
                </div>
                <div class="sensor-row" style="font-size:0.7rem;">
                  <p class="temperature-humidity">
                    {{ parseFloat(sensor.temperature).toFixed(1) }}°C
                    {{ parseFloat(sensor.humidity).toFixed(1) }}%&nbsp;
                    {{ sensor.pm2_5 }}&nbsp;&nbsp;
                    {{ sensor.pm10 }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="map-section">
          <h4>Floorplan</h4>
          <div class="map-container" @mousedown="startPan" @mousemove="pan" @mouseup="endPan" @mouseleave="endPan"
            @wheel="onWheel">
            <img :src="currentImage" alt="Map View" class="map-image"
              :style="{ transform: `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)` }">
            <div class="zoom-controls">
              <button class="btn btn-secondary" @click="zoomIn">+</button>
              <button class="btn btn-secondary" @click="zoomOut">-</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Floorplan1 from '@/assets/Sub System and Icons/V2/B05-07_Smart_IAQ_systems_V2.jpg';
import Floorplan2 from '@/assets/Sub System and Icons/V2/B05-08_Smart_IAQ_system_V2.jpg';
import Floorplan3 from '@/assets/Sub System and Icons/V2/B05-09_Smart_IAQ_System_V2.jpg';
import Floorplan4 from '@/assets/Sub System and Icons/V2/B05-11-12_Indoor Air Quality System.jpg';
import Floorplan5 from '@/assets/Sub System and Icons/V2/B05 13-14_IAQ system.jpg';
import Floorplan6 from '@/assets/Sub System and Icons/V2/B05 15-16_ IAQ_system.jpg';
import Floorplan7 from '@/assets/Sub System and Icons/V2/B05-18_Smart_IAQ_system.jpg';

export default {
  name: 'IndoorAirQuality',
  data() {
    return {
      currentImage: Floorplan4,
      selectedFloorplan: 1,
      floorplans: [
        { id: 1, name: '11', image: Floorplan4 },
        { id: 2, name: '12', image: Floorplan4 },
        { id: 3, name: '13/14', image: Floorplan5 },
        { id: 4, name: '15/16', image: Floorplan6 },
        { id: 5, name: '18', image: Floorplan7 },
        { id: 6, name: '7', image: Floorplan1 },
        { id: 7, name: '8', image: Floorplan2 },
        { id: 8, name: '9', image: Floorplan3 }
      ],
      sensors: [],
      boxes: [
        { id: 1, top: '26%', left: '19%' },
        { id: 2, top: '26%', left: '40%' },
        { id: 3, top: '26%', left: '61%' },
        { id: 4, top: '26%', left: '81%' },
        { id: 5, top: '74%', left: '19%' },
        { id: 6, top: '74%', left: '40%' },
        { id: 7, top: '74%', left: '61%' },
        { id: 8, top: '74%', left: '81%' }
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
      tooltip: {
        visible: false,
        top: '0px',
        left: '0px'
      }
    };
  },
  mounted() {
    this.fetchSensorData();
  },
  methods: {
    async fetchSensorData() {
      try {
        const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Lorawan/latest/sheet/IAQ');
        const data = response.data;

        this.sensors = [
          {
            id: 1,
            name: 'B05-11',
            co2: data['24e124710d480176'].co2,
            temperature: data['24e124710d480176'].temperature,
            humidity: data['24e124710d480176'].humidity,
            pm2_5: data['24e124710d480176'].pm2_5,
            pm10: data['24e124710d480176'].pm10,
            pressure: data['24e124710d480176'].pressure,
            top: '6%',
            left: '10.6%'
          },
          {
            id: 2,
            name: 'B05-12',
            co2: data['24e124710d480413'].co2,
            temperature: data['24e124710d480413'].temperature,
            humidity: data['24e124710d480413'].humidity,
            pm2_5: data['24e124710d480413'].pm2_5,
            pm10: data['24e124710d480413'].pm10,
            pressure: data['24e124710d480413'].pressure,
            top: '6%',
            left: '31.3%'
          },
          {
            id: 3,
            name: 'B05-13/14',
            co2: data['24e124710d480081'].co2,
            temperature: data['24e124710d480081'].temperature,
            humidity: data['24e124710d480081'].humidity,
            pm2_5: data['24e124710d480081'].pm2_5,
            pm10: data['24e124710d480081'].pm10,
            pressure: data['24e124710d480081'].pressure,
            top: '6%',
            left: '52%'
          },
          {
            id: 4,
            name: 'B05-15/16',
            co2: data['24e124710d481996'].co2,
            temperature: data['24e124710d481996'].temperature,
            humidity: data['24e124710d481996'].humidity,
            pm2_5: data['24e124710d481996'].pm2_5,
            pm10: data['24e124710d481996'].pm10,
            pressure: data['24e124710d481996'].pressure,
            top: '6%',
            left: '72.7%'
          },
          {
            id: 5,
            name: 'B05-18',
            co2: data['24e124710d480413'].co2,
            temperature: data['24e124710d480413'].temperature,
            humidity: data['24e124710d480413'].humidity,
            pm2_5: data['24e124710d480413'].pm2_5,
            pm10: data['24e124710d480413'].pm10,
            pressure: data['24e124710d480413'].pressure,
            top: '54%',
            left: '10.6%'
          },
          {
            id: 6,
            name: 'B05-07',
            co2: data['24e124710d482090'].co2,
            temperature: data['24e124710d482090'].temperature,
            humidity: data['24e124710d482090'].humidity,
            pm2_5: data['24e124710d482090'].pm2_5,
            pm10: data['24e124710d482090'].pm10,
            pressure: data['24e124710d482090'].pressure,
            top: '54%',
            left: '31.3%'
          },
          {
            id: 7,
            name: 'B05-08',
            co2: data['24e124710d482388'].co2,
            temperature: data['24e124710d482388'].temperature,
            humidity: data['24e124710d482388'].humidity,
            pm2_5: data['24e124710d482388'].pm2_5,
            pm10: data['24e124710d482388'].pm10,
            pressure: data['24e124710d482388'].pressure,
            top: '54%',
            left: '52%'
          },
          {
            id: 8,
            name: 'B05-09',
            co2: data['24e124710d482648'].co2,
            temperature: data['24e124710d482648'].temperature,
            humidity: data['24e124710d482648'].humidity,
            pm2_5: data['24e124710d482648'].pm2_5,
            pm10: data['24e124710d482648'].pm10,
            pressure: data['24e124710d482648'].pressure,
            top: '54%',
            left: '72.7%'
          }
        ];
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    },

    getSmileyClass(co2) {
      if (co2 <= 600) return 'fa-smile text-success';
      if (co2 <= 1000) return 'fa-meh text-warning';
      return 'fa-frown text-danger';
    },

    showTooltip(index, event) {
      console.log('Hovering on box:', index);
      this.tooltip.visible = true;
      this.tooltip.top = `${event.clientY + 10}px`;
      this.tooltip.left = `${event.clientX + 10}px`;
    },
    hideTooltip() {
      this.tooltip.visible = false;
    },
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
    getCurrentFloorplanImage(id) {
      const floorplan = this.floorplans.find(fp => fp.id === id);
      return floorplan ? floorplan.image : '';
    },
    changeImage(boxId) {
      const floorplan = this.floorplans.find(fp => fp.id === boxId);
      if (floorplan) {
        this.currentImage = floorplan.image;
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

.image-container {
  position: relative;
}

.system-image {
  width: 100%;
  height: auto;
}

.sensor-data {
  width: 17%;
  height: 25%;
  position: absolute;
  padding: 10px;
  color: black;
  border-radius: 5px;
  text-align: left;
  font-size: 0.8rem;
  white-space: nowrap;
  pointer-events: none;
}

.sensor-row {
  display: flex;
  justify-content: space-between;
}

.icon-text {
  display: flex;
  align-items: center;
}

.icon-text i {
  margin-right: 5px;
}

.sensor-data p {
  margin: 0;
}

.smiley-icon {
  margin-left: 10px;
}

.fa-smile {
  color: #28a745;
}

.fa-meh {
  color: #ffcc00;
}

.fa-frown {
  color: #dc3545;
}

.clickable-box {
  width: 155px;
  height: 209px;
  cursor: pointer;
  position: absolute;
  transform: translate(-50%, -50%);
}

.tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  pointer-events: none;
  white-space: nowrap;
}
</style>

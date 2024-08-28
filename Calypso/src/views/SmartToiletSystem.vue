<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Washroom System</h2>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="map-section">
          <h4>Floorplan</h4>
          <div class="map-container">
            <img src="@/assets/Sub System and Icons/V2/smart washroom system_V2.jpg" alt="Map View" class="map-image">
            <!-- Multiple Icons on the Floorplan -->
            <div v-for="(icon, index) in icons" :key="index" class="icon-container"
              :style="{ top: icon.top, left: icon.left }" @mouseenter="showValue(index, $event)"
              @mouseleave="hideValue">
              <div v-if="icon.pulsating" class="pulsate-ring"></div> <!-- Motion ring -->
              <img :src="icon.src" alt="Sensor Icon" class="icon-image">
              <!-- Tooltip should only show when hoveredIndex matches -->
              <div v-if="hoveredIndex === index" class="value-tooltip"
                :style="{ top: `${tooltipY}px`, left: `${tooltipX}px` }">
                <h5>{{ icon.label }}</h5>
                <template v-if="icon.type === 'People Counter'">
                  <p>Period In: {{ icon.periodIn }}</p>
                  <p>Period Out: {{ icon.periodOut }}</p>
                </template>
                <template v-else-if="icon.type === 'Odor Sensor'">
                  <p>Battery: {{ icon.battery }}%</p>
                  <p>Ammonia Level: {{ icon.nh3 }} ppm</p>
                  <p>Hydrogen Sulfide Level: {{ icon.h2s }} ppm</p>
                  <p>Temperature: {{ icon.temperature }}°C</p>
                  <p>Humidity: {{ icon.humidity }}%</p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="link-button mt-4">
      <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Washroom</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import peopleCounterIcon from '@/assets/peopleCounter.png';
import odorIcon from '@/assets/Odor.png';
import waterMeterIcon from '@/assets/water-meter-sensor.png';

export default {
  name: 'SmartWashroomSystem',
  data() {
    return {
      hoveredIndex: null,
      tooltipX: 0,
      tooltipY: 0,
      icons: [
        { top: '40.6%', left: '35%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', periodIn: 0, periodOut: 0, oldPeriodIn: 0, oldPeriodOut: 0, pulsating: false },
        { top: '57.6%', left: '59.6%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', periodIn: 0, periodOut: 0, oldPeriodIn: 0, oldPeriodOut: 0, pulsating: false },
        { top: '53.6%', left: '34.7%', src: odorIcon, label: 'Bathroom Odor Detector', type: 'Odor Sensor', battery: 0, nh3: 0, h2s: 0, temperature: 0, humidity: 0 },
        { top: '64.6%', left: '90%', src: odorIcon, label: 'Bathroom Odor Detector', type: 'Odor Sensor', battery: 0, nh3: 0, h2s: 0, temperature: 0, humidity: 0 },
        { top: '45%', left: '50.5%', src: waterMeterIcon, label: 'Water Meter', type: 'Water Meter', waterFlow: 15, waterConsumption: 1200 },
      ],
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Lorawan/latest/toilet');
        const data = response.data;

        console.log('API Response:', data); // Log the API response to check the data

        // Update the People Counters and trigger animation
        this.updateCounterData(0, data['24e124716d496395']);
        this.updateCounterData(1, data['24e124716d496118']);

        // Update the first Odor Sensor
        const odorData1 = data['24e124798d482591'];
        this.updateOdorData(2, odorData1);

        // Update the second Odor Sensor
        const odorData2 = data['24e124798d482365'];
        this.updateOdorData(3, odorData2);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    updateCounterData(index, newData) {
      const icon = this.icons[index];
      const oldIn = icon.oldPeriodIn;
      const oldOut = icon.oldPeriodOut;
      const newIn = parseInt(newData.period_in, 10) || 0; // Ensure conversion to integer
      const newOut = parseInt(newData.period_out, 10) || 0; // Ensure conversion to integer

      console.log(`People Counter ${index + 1} - In: ${newIn}, Out: ${newOut}`); // Log the new values

      icon.periodIn = newIn;
      icon.periodOut = newOut;

      // Trigger pulsating animation if counts have increased
      if (newIn > oldIn || newOut > oldOut) {
        icon.pulsating = true;
        setTimeout(() => {
          icon.pulsating = false;
        }, 2000); // End pulsating after 2 seconds
      }

      // Store the new values as old values for the next comparison
      icon.oldPeriodIn = newIn;
      icon.oldPeriodOut = newOut;
    },
    updateOdorData(index, newData) {
      const icon = this.icons[index];
      icon.battery = newData.battery || 0;
      icon.nh3 = newData.nh3 || 0;
      icon.h2s = newData.h2s || 0;
      icon.temperature = newData.temperature || 0;
      icon.humidity = newData.humidity || 0;
    },
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
  mounted() {
    this.fetchData();
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

/* Icon Container */
.icon-container {
  position: absolute;
  width: 24px;
  height: 24px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 1000;
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

.link-button {
  display: flex;
  justify-content: center;
  /* Center horizontally */
  align-items: center;
  /* Center vertically */
  margin-top: 20px;
}

.link-button .btn {
  padding: 10px 20px;
  font-size: 1.25rem;
  text-align: center;
}


/* Pulsating Ring */
@keyframes pulsate {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.pulsate-ring {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 123, 255, 0.5);
  border-radius: 50%;
  top: -8px;
  left: -8px;
  z-index: 999;
  animation: pulsate 1s ease-out infinite;
  pointer-events: none;
}
</style>

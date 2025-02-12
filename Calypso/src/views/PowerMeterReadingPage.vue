<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Energy Management System</h2>

    <!-- First Page: Overview -->
    <div v-if="showFirstPage" class="view-container">
      <h4 class="text-center mb-4">Overview</h4>
      <div class="grid-container">
        <div v-for="(box, index) in roomData" :key="index" class="room-box" @click="handleBoxClick(box)">
          <h5 class="room-title">{{ box.label }}</h5>
          <div class="room-metrics">
            <div class="metric">
              <span class="label">Total Power:</span>
              <span class="value">{{ box.totalValues.p }} kW</span>
            </div>
            <div class="metric">
              <span class="label">Total Current:</span>
              <span class="value">{{ box.totalValues.ia }} A</span>
            </div>
            <div class="metric">
              <span class="label">Total Power Factor:</span>
              <span class="value">{{ box.totalValues.pf }}</span>
            </div>
            <div class="metric">
              <span class="label">Total Voltage:</span>
              <span class="value">{{ box.totalValues.ua }} V</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Second Page: Room Details -->
    <div v-else class="sensor-detail-container">
      <button @click="goBack" class="back-button">Back to Main</button>
      <h3 class="text-center mb-4">{{ selectedRoom.label }} Sensors</h3>

      <!-- Only show sensors for B05-11/12 -->
      <div v-if="selectedRoom.label === 'B05-11/12'">
        <!-- Display 3-Phase Sensors in a centered row -->
        <div class="three-phase-row">
          <div v-for="sensor in selectedRoom.sensors.slice(0, 3)" :key="sensor.id" class="sensor-box">
            <p class="sensor-type">Three-Phase</p>
          </div>
        </div>

        <div class="single-phase-grid">
          <div v-for="sensor in selectedRoom.sensors" :key="sensor.id" class="sensor-box"
            @mouseover="showTooltip(sensor, $event)" @mouseleave="hideTooltip">
            <p class="sensor-type">{{ sensor.type }}</p>
          </div>
        </div>
      </div>

      <!-- Chart for all rooms -->
      <div class="chart-section">
        <h4 class="text-center mb-4">Daily kWh Trend</h4>
        <canvas id="kwhChart"></canvas>
      </div>
    </div>

    <!-- Tooltip for Sensor Data -->
    <div v-if="tooltipVisible" :style="{ top: tooltipY + 'px', left: tooltipX + 'px' }" class="tooltip">
      <h5>{{ tooltipData.meterName || 'Meter Data' }}</h5>
      <p><strong>Cumulative Energy:</strong> {{ tooltipData.importEnergy + tooltipData.exportEnergy }} kWh</p>
      <p><strong>Current:</strong> {{ tooltipData.current }} A</p>
      <p><strong>Power Factor:</strong> {{ tooltipData.powerFactor }}</p>
      <p><strong>Voltage:</strong> {{ tooltipData.voltage }} V</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

export default {
  name: 'PowerMeterReadingPage',
  data() {
    return {
      showFirstPage: true,
      selectedRoom: {},
      tooltipVisible: false,
      tooltipData: {},
      tooltipX: 0,
      tooltipY: 0,
      roomData: [
        {
          label: 'B05-11/12',
          totalValues: { p: 0, ia: 0, pf: 0, ua: 0 },
          sensors: []
        },
        { label: 'B05-13/14', totalValues: { p: 0, ia: 0, pf: 0, ua: 0 } },
        { label: 'B05-15/16/18', totalValues: { p: 0, ia: 0, pf: 0, ua: 0 } },
        { label: 'B05-07', totalValues: { p: 0, ia: 0, pf: 0, ua: 0 } },
        { label: 'B05-08', totalValues: { p: 0, ia: 0, pf: 0, ua: 0 } },
        { label: 'B05-09', totalValues: { p: 0, ia: 0, pf: 0, ua: 0 } },
        { label: 'Landscape', totalValues: { p: 0, ia: 0, pf: 0, ua: 0 } }
      ]
    };
  },
  methods: {
    generateChart(roomLabel) {
      Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);
      const ctx = document.getElementById('kwhChart').getContext('2d');
      const roomSpecificData = roomLabel === 'B05-11/12'
        ? {
          labels: ['01 Sep', '02 Sep', '03 Sep', '04 Sep', '05 Sep', '06 Sep', '07 Sep'],
          datasets: [
            {
              label: 'Total Power',
              data: [7.37, 10.46, 7.5, 5.45, 3.35, 4.89, 5.52],
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              fill: true,
            },
            {
              label: 'Total Current',
              data: [5.63, 8.9, 5.63, 4.68, 2.56, 3.84, 2.9],
              borderColor: 'rgba(192, 75, 192, 1)',
              backgroundColor: 'rgba(192, 75, 192, 0.1)',
              fill: true,
            },
            {
              label: 'Total Voltage',
              data: [229.34, 237.25, 227.57, 223.86, 229.23, 225.43, 220.37],
              borderColor: 'rgba(192, 192, 75, 1)',
              backgroundColor: 'rgba(192, 192, 75, 0.1)',
              fill: true,
            }
          ]
        }
        : {
          labels: ['01 Sep', '02 Sep', '03 Sep', '04 Sep', '05 Sep', '06 Sep', '07 Sep'],
          datasets: [
            {
              label: 'Placeholder Data',
              data: [0, 0, 0, 0, 0, 0, 0],
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: true,
            }
          ]
        };

      new Chart(ctx, {
        type: 'line',
        data: roomSpecificData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: { display: true, text: 'Date', color: '#fff' },
              ticks: { color: '#fff' },
              grid: { color: 'rgba(255, 255, 255, 0.2)' }
            },
            y: {
              title: { display: true, text: 'kWh/Current/Voltage', color: '#fff' },
              ticks: { color: '#fff' },
              grid: { color: 'rgba(255, 255, 255, 0.2)' }
            }
          },
          plugins: {
            legend: { labels: { color: '#fff' } },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleColor: 'white',
              bodyColor: 'white'
            }
          }
        }
      });
    },
    handleBoxClick(box) {
      this.selectedRoom = box;
      this.showFirstPage = false;
      this.$nextTick(() => {
        this.generateChart(box.label);
      });
    },
    goBack() {
      this.showFirstPage = true;
    },
    showTooltip(sensorData, event) {
      this.tooltipData = {
        meterName: sensorData.meterName || 'Sensor',
        importEnergy: sensorData.epi || 0,
        exportEnergy: sensorData.epe || 0,
        energyQualityCount: sensorData.eqc || 0,
        energyQualityLevel: sensorData.eql || 0,
        current: sensorData.ia || 0,
        activePower: sensorData.p || 0,
        powerFactor: sensorData.pf || 0,
        reactivePower: sensorData.q || 0,
        voltage: sensorData.ua || 0
      };
      this.tooltipVisible = true;
      this.tooltipX = event.pageX + 15;
      this.tooltipY = event.pageY + 15;
    },
    hideTooltip() {
      this.tooltipVisible = false;
    },
    async fetchData() {
      try {
        const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Mqtt/data/latest');
        console.log('API Response:', response.data);

        const room = this.roomData.find(r => r.label === 'B05-11/12');
        if (room) {
          room.totalValues = { p: 0, ia: 0, pf: 0, ua: 0 };
          room.sensors = [];

          response.data.forEach(item => {
            room.totalValues.p += parseFloat(item.p || 0);
            room.totalValues.ia += parseFloat(item.ia || 0);
            room.totalValues.pf += parseFloat(item.pf || 0);
            room.totalValues.ua += parseFloat(item.ua || 0);

            room.sensors.push({
              id: item.meterSN,
              meterName: item.meterName,
              type: 'Single-Phase',
              epi: item.epi,
              epe: item.epe,
              eqc: item.eqc,
              eql: item.eql,
              ia: item.ia,
              p: item.p,
              pf: item.pf,
              q: item.q,
              ua: item.ua
            });
          });

          room.totalValues.p = room.totalValues.p.toFixed(2);
          room.totalValues.ia = room.totalValues.ia.toFixed(2);
          room.totalValues.pf = room.totalValues.pf.toFixed(2);
          room.totalValues.ua = room.totalValues.ua.toFixed(2);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.container-fluid {
  max-width: 1200px;
}

.view-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  border-radius: 5px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.room-box {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  text-align: left;
  cursor: pointer;
}

.room-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.room-metrics {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metric {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  padding: 5px 0;
}

.label {
  font-weight: bold;
}

.value {
  text-align: right;
}

.sensor-detail-container {
  text-align: center;
  padding: 20px;
  position: relative;
}

.three-phase-row {
  display: flex;
  justify-content: left;
  gap: 20px;
  /* Space between 3-Phase sensors */
  margin-bottom: 20px;
}

.single-phase-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.sensor-box {
  border: 2px solid red;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  font-weight: bold;
}

.back-button {
  position: absolute;
  bottom: -85px;
  right: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 999;
}

.tooltip {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  /* Dark background like in your image */
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 0.9rem;
  max-width: 200px;
  z-index: 1000;
  pointer-events: none;
  text-align: center;
  opacity: 0.9;
}

.chart-section {
  width: 100%;
  height: 500px;
  /* Full height */
  position: relative;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  /* Full width and height */
}
</style>

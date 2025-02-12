<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Washroom System</h2>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="map-section position-relative">
          <!-- Row to display occupancy info (4 parts) and floorplan (8 parts) side by side -->
          <div class="row">
            <!-- Occupancy Info section (4 parts) -->
            <div class="col-md-2">
              <div class="people-counter-info">
                <div class="male-counter-box">
                  <h5>Occupancy (Male Toilet)</h5>
                  <p>{{ icons[1].periodIn - icons[1].periodOut }} Pax</p>
                </div>
                <div class="female-counter-box mt-4">
                  <h5>Occupancy (Female Toilet)</h5>
                  <p>{{ icons[0].periodIn - icons[0].periodOut }} Pax</p>
                </div>
                <div class="female-counter-box mt-4">
                  <h5>Water Flow Measurement</h5>
                  <p>-</p>
                </div>
              </div>
            </div>

            <!-- Floorplan section (8 parts) -->
            <div class="col-md-10">
              <div class="map-container">
                <img src="@/assets/Sub System and Icons/V2/smart washroom_full1.png" alt="Map View" class="map-image">
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
                    <template v-else-if="icon.type === 'Water Meter'">
                      <p v-if="icon.dailyUsage.length > 0">
                        Daily Usage (Past 3 days):
                        {{ Math.min(...icon.dailyUsage.map(item => item.usage)).toFixed(2) }} m³ -
                        {{ Math.max(...icon.dailyUsage.map(item => item.usage)).toFixed(2) }} m³
                      </p>
                      <p v-else>No data available</p>
                    </template>

                  </div>
                </div>


                <!-- Button to Set Threshold at Bottom Right of Floorplan -->
                <div class="threshold-button">
                  <button @click="openThresholdModal" class="btn btn-primary">Set Threshold</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Chart section below the floorplan -->
          <div class="row mt-4">
            <div class="col-md-12 chart-container">
              <h5>Daily Water Consumption</h5>
              <canvas id="waterChart" style="max-height: 400px;"></canvas> <!-- Set max height -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal to Set Threshold -->
    <div v-if="showThresholdModal" class="modal-overlay" @click="closeThresholdModal"></div>
    <div v-if="showThresholdModal" class="modal d-block" style="z-index: 1050;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h5 class="modal-title">Set People Counter Threshold</h5>
            <button type="button" class="btn-close position-absolute top-0 end-0"
              @click="closeThresholdModal">&times;</button>
          </div>
          <div class="modal-body text-center">
            <form @submit.prevent="saveThreshold">
              <div class="mb-3">
                <label for="thresholdInput" class="form-label">Threshold</label>
                <input type="number" min="1" step="1" class="form-control" id="thresholdInput" v-model="threshold"
                  placeholder="Enter threshold" required />
              </div>
              <button type="submit" class="btn btn-primary">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import peopleCounterIcon from '@/assets/peopleCounter.png';
import odorIcon from '@/assets/Odor.png';
import waterMeterIcon from '@/assets/water-meter-sensor.png';
import {
  Chart,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

export default {
  name: 'SmartWashroomSystem',
  data() {
    return {
      chartSeries: [],
      chartOptions: {},
      chartInstance: null,
      chartLabels: [],
      chartData: [],
      hoveredIndex: null,
      tooltipX: 0,
      tooltipY: 0,
      threshold: parseInt(localStorage.getItem('peopleCounterThreshold')) || 20,
      showThresholdModal: false,
      icons: [
        { top: '51%', left: '66%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', periodIn: 0, periodOut: 0, oldPeriodIn: 0, oldPeriodOut: 0, pulsating: false },
        { top: '40.6%', left: '44%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', periodIn: 0, periodOut: 0, oldPeriodIn: 0, oldPeriodOut: 0, pulsating: false },
        { top: '37.6%', left: '64.7%', src: odorIcon, label: 'Bathroom Odor Detector', type: 'Odor Sensor', battery: 0, nh3: 0, h2s: 0, temperature: 0, humidity: 0 },
        { top: '36%', left: '18%', src: odorIcon, label: 'Bathroom Odor Detector', type: 'Odor Sensor', battery: 0, nh3: 0, h2s: 0, temperature: 0, humidity: 0 },
        { top: '46%', left: '51.5%', src: waterMeterIcon, label: 'Water Meter', type: 'Water Meter', dailyUsage: [] }
      ],
      notifications: []
    };
  },
  methods: {
    updateWaterMeterData(dailyUsage) {
      const waterMeterIcon = this.icons.find(icon => icon.type === 'Water Meter');
      if (waterMeterIcon) {
        waterMeterIcon.dailyUsage = dailyUsage;
      }
    },
    async fetchData() {
      try {
        const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Lorawan/latest/toilet');
        const data = response.data;
        console.log('API Response:', data);
        // Update the People Counters and trigger animation
        // (The original code was updating these using data from the toilet API.)
        // With the People API, the update will be handled in fetchPeopleData().
        // You can comment out these lines if not needed:
        // this.updateCounterData(0, data['24e124716d496395']);
        // this.updateCounterData(1, data['24e124716d496118']);
        // Update the Odor Sensors:
        const odorData1 = data['24e124798d482591'];
        this.updateOdorData(2, odorData1);
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
      const newIn = parseInt(newData.period_in, 10) || 0;
      const newOut = parseInt(newData.period_out, 10) || 0;
      console.log(`People Counter ${index + 1} - In: ${newIn}, Out: ${newOut}`);
      icon.periodIn = newIn;
      icon.periodOut = newOut;
      if (newIn > oldIn || newOut > oldOut) {
        icon.pulsating = true;
        setTimeout(() => {
          icon.pulsating = false;
        }, 2000);
      }
      icon.oldPeriodIn = newIn;
      icon.oldPeriodOut = newOut;
      if (newIn > this.threshold) {
        this.sendAlert(`People Counter ${index + 1} exceeded the threshold with ${newIn} people.`);
      }
    },
    // New method to fetch People data from the API and update the people counters:
    async fetchPeopleData() {
      try {
        const response = await axios.get(
          'https://015d-119-56-103-190.ngrok-free.app/data/latest/People',
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        const peopleDataArray = response.data;
        // Map the devEUI values to the corresponding icon index.
        // For example, here we assume:
        // devEUI "24e124716d496395" -> icon index 0 (e.g., Occupancy for Female Toilet)
        // devEUI "24e124716d496118" -> icon index 1 (e.g., Occupancy for Male Toilet)
        const mapping = {
          "24e124716d496395": 0,
          "24e124716d496118": 1
        };
        peopleDataArray.forEach(item => {
          const devEUI = item.devEUI;
          const index = mapping[devEUI];
          if (index !== undefined) {
            this.updateCounterData(index, item.data);
          }
        });
      } catch (error) {
        console.error('Error fetching people data:', error);
      }
    },
    async fetchOdorData() {
      try {
        const response = await axios.get(
          'https://015d-119-56-103-190.ngrok-free.app/data/latest/Odor',
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        );
        const odorDataArray = response.data;
        // Map devEUI to the icon index:
        // Here, we assume that:
        // • "24e124798d482365" should update the icon at index 3
        // • "24e124798d482591" (if available later) should update the icon at index 2
        const mapping = {
          "24e124798d482365": 3,
          "24e124798d482591": 2,
        };
        odorDataArray.forEach(item => {
          const devEUI = item.devEUI;
          const index = mapping[devEUI];
          if (index !== undefined) {
            this.updateOdorData(index, item);
          }
        });
      } catch (error) {
        console.error('Error fetching odor data:', error);
      }
    },
    sendAlert(message) {
      const timestamp = new Date().toLocaleString();
      const alert = { message, timestamp };
      this.notifications.push(alert);
      const storedAlerts = JSON.parse(localStorage.getItem('alerts')) || [];
      storedAlerts.push(alert);
      localStorage.setItem('alerts', JSON.stringify(storedAlerts));
      console.log('Alert sent:', message);
    },
    updateOdorData(index, newData) {
      // Check if the object has a nested "data" property; if so, use that.
      const data = newData.data ? newData.data : newData;
      const icon = this.icons[index];
      icon.battery = data.battery || 0;
      icon.nh3 = data.nh3 || 0;
      icon.h2s = data.h2s || 0;
      icon.temperature = data.temperature || 0;
      icon.humidity = data.humidity || 0;
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
    openThresholdModal() {
      this.showThresholdModal = true;
    },
    closeThresholdModal() {
      this.showThresholdModal = false;
    },
    saveThreshold() {
      localStorage.setItem('peopleCounterThreshold', this.threshold);
      console.log('Threshold saved:', this.threshold);
      this.closeThresholdModal();
    },
    getStoredAlerts() {
      return JSON.parse(localStorage.getItem('alerts')) || [];
    },
    generateChart() {
      Chart.register(
        BarController,
        LineController,
        BarElement,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Title,
        Tooltip,
        Legend
      );
      const canvas = document.getElementById('waterChart');
      const ctx = canvas.getContext('2d');

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Retrieve chart data from local storage if available.
      const storedLabels = JSON.parse(localStorage.getItem('waterMeterChartLabels')) || this.chartLabels;
      const storedData = JSON.parse(localStorage.getItem('waterMeterChartData')) || this.chartData;

      this.chartLabels = storedLabels;
      this.chartData = storedData;

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              label: 'Water Consumption (m³)',
              data: this.chartData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: 'white',
              },
            },
            title: {
              display: true,
              text: 'Daily Water Consumption',
              color: 'white',
            },
            tooltip: {
              titleColor: 'white',
              bodyColor: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
                color: 'white',
              },
              ticks: {
                color: 'white',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
            y: {
              title: {
                display: true,
                text: 'm³',
                color: 'white',
              },
              ticks: {
                color: 'white',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          },
        },
      });
    },
    async fetchDataAndCalculateUsage() {
      try {
        // Set endDate as today (or the desired display end date)
        const endDate = new Date();
        // To compute differences for 3 days (e.g., 09/02, 10/02, 11/02) we need the reading from the day before the first desired day.
        // So, set startDate to 4 days before endDate.
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 4);

        // Convert to ISO strings (the API expects ISO format)
        const start_date_str = startDate.toISOString();
        const end_date_str = endDate.toISOString();

        // Build the API URL with dynamic query parameters.
        const url = `https://015d-119-56-103-190.ngrok-free.app/data/history/WaterMeter?start_date=${start_date_str}&end_date=${end_date_str}`;
        console.log("Fetching water meter history from:", url);

        // Fetch data with the required header.
        const response = await axios.get(url, { headers: { 'ngrok-skip-browser-warning': 'true' } });
        const historyData = response.data; // An array of readings.
        console.log("Water Meter History Data:", historyData);

        // Group the readings by date (YYYY-MM-DD) and take the latest reading for each date.
        let groupedReadings = {};
        historyData.forEach(item => {
          if (item.data && item.data.postDate) {
            const postDate = item.data.postDate; // e.g., "2025-02-10 11:55:00"
            const dateKey = postDate.split(" ")[0]; // e.g., "2025-02-10"
            if (
              !groupedReadings[dateKey] ||
              new Date(item.data.postDate) > new Date(groupedReadings[dateKey].data.postDate)
            ) {
              groupedReadings[dateKey] = item;
            }
          }
        });

        // Convert the grouped object to an array of objects with cumulative reading.
        let readingsArray = Object.keys(groupedReadings).map(date => ({
          date: date, // Format: "YYYY-MM-DD"
          reading: parseFloat(groupedReadings[date].data.dispNum)
        }));
        // Sort the readings in ascending order by date.
        readingsArray.sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log("Readings Array:", readingsArray);

        // Compute daily usage by subtracting the previous day's cumulative reading.
        // This produces an array of daily differences starting from the second reading.
        let dailyUsage = [];
        for (let i = 1; i < readingsArray.length; i++) {
          dailyUsage.push({
            date: readingsArray[i].date, // This is the day for which usage is computed.
            usage: readingsArray[i].reading - readingsArray[i - 1].reading
          });
        }
        console.log("Calculated Daily Usage:", dailyUsage);

        // We want to display daily usage for the last 3 days (excluding today's data).
        // If endDate is today (say 11/02), we want differences for 09/02, 10/02, and 11/02.
        // Ensure we have at least 3 dailyUsage entries.
        const displayDailyUsage = dailyUsage.slice(-3);

        // Update chart data using displayDailyUsage.
        this.chartLabels = displayDailyUsage.map(item => {
          const parts = item.date.split("-");
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        });
        this.chartData = displayDailyUsage.map(item => item.usage);
        console.log("Chart Labels:", this.chartLabels);
        console.log("Chart Data:", this.chartData);

        // Update the water meter icon's dailyUsage property.
        const waterMeterIconObj = this.icons.find(icon => icon.type === 'Water Meter');
        if (waterMeterIconObj) {
          waterMeterIconObj.dailyUsage = displayDailyUsage;
        }

        // Optionally, store these values in local storage.
        localStorage.setItem('waterMeterChartLabels', JSON.stringify(this.chartLabels));
        localStorage.setItem('waterMeterChartData', JSON.stringify(this.chartData));

        // Generate (or update) the chart.
        this.generateChart();
      } catch (error) {
        console.error("Error fetching and processing water meter history data:", error);
      }
    }
  },
  mounted() {
    // Fetch People data from the People API every 5 seconds.
    this.fetchPeopleData();
    setInterval(this.fetchPeopleData, 5000);
    // Other initial data fetches:
    this.fetchData();
    this.generateChart();
    this.fetchDataAndCalculateUsage();
    this.fetchOdorData();
  }
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
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
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
  visibility: hidden;
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
  font-size: 18px;
}

/* Button to Set Threshold */
.threshold-button {
  position: absolute;
  bottom: 30px;
  right: 10px;
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

/* Modal and overlay styles */
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
  z-index: 1050;
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
  width: 400px;
}

.modal-header .btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-title {
  color: black;
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

/* Container for people counters placed on the left side */
.people-counter-info {
  margin-right: 10px;
  /* Space between the counter boxes and the floorplan */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.male-counter-box,
.female-counter-box {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 5px;
  color: white;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 150px;
  /* Adjust the width as needed */
}

.male-counter-box h5,
.female-counter-box h5 {
  margin-bottom: 10px;
  font-weight: bold;
}
</style>

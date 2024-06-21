<template>
  <div class="overview-container">
    <div class="summary-be">
      <h3>Summary of BE</h3>
      <div class="summary-content">
        <div class="progress-bars">
          <div v-for="(progress, index) in progressData" :key="index" class="progress-bar-container">
            <CircularProgressBar :percentage="progress.value" :label="progress.label" />
          </div>
        </div>
      </div>
    </div>
    <div class="map-hierarchy">
      <h3>Map of Area or Sub-System Hierarchy Selection</h3>
      <div class="map-content">
        <img src="@/assets/ITE_EAST_FLOORPLAN.jpg" alt="ITE East Floor Plan" class="img-fluid fixed-size">
      </div>
    </div>
    <div class="summary-subsystems">
      <h3>Summary of Sub-Systems</h3>
      <div class="subsystems-content">
        <div class="subsystem-card">
          <h4>{{ currentFireAlarm.name }}</h4>
          <div v-if="currentFireAlarmIndex === 0" class="semi-circle-progress">
            <SemiCircleProgressBar :percentage="currentFireAlarm.operational" />
          </div>
          <div v-else>
            <p>Status: {{ currentFireAlarm.status }}
              <span :class="{'status-dot': true, 'status-online': currentFireAlarm.status === 'Online', 'status-offline': currentFireAlarm.status === 'Offline'}"></span>
            </p>
            <p>Last Updated: {{ currentFireAlarm.lastUpdated }}</p>
          </div>
          <div class="card-footer">
            <div class="card-pagination">
              <button @click="prevFireAlarm" :disabled="currentFireAlarmIndex === 0">&lt;</button>
              <p>{{ currentFireAlarmIndex + 1 }}/7</p>
              <button @click="nextFireAlarm" :disabled="currentFireAlarmIndex === fireAlarms.length - 1">&gt;</button>
            </div>
            <router-link to="/fire-alarm-system" class="see-more">View Details</router-link>
          </div>
        </div>
        <div class="subsystem-card">
          <h4>{{ currentIAQDevice.name }}</h4>
          <div v-if="currentIAQDeviceIndex === 0" class="semi-circle-progress">
            <SemiCircleProgressBar :percentage="currentIAQDevice.operational" />
          </div>
          <div v-else>
            <p>Status: {{ currentIAQDevice.status }}
              <span :class="{'status-dot': true, 'status-online': currentIAQDevice.status === 'Online', 'status-offline': currentIAQDevice.status === 'Offline'}"></span>
            </p>
            <p>Average Temp: {{ currentIAQDevice.avgTemp }}°C</p>
            <p>Average Humidity: {{ currentIAQDevice.avgHumidity }}%</p>
            <p>Average Pressure: {{ currentIAQDevice.avgPressure }} hPa</p>
            <p>Average CO2: {{ currentIAQDevice.avgCO2 }} ppm</p>
          </div>
          <div class="card-footer">
            <div class="card-pagination">
              <button @click="prevIAQDevice" :disabled="currentIAQDeviceIndex === 0">&lt;</button>
              <p>{{ currentIAQDeviceIndex + 1 }}/{{ iaqDevices.length }}</p>
              <button @click="nextIAQDevice" :disabled="currentIAQDeviceIndex === iaqDevices.length - 1">&gt;</button>
            </div>
            <router-link to="/iaq-devices-reading" class="see-more">View Details</router-link>
          </div>
        </div>
        <div class="subsystem-card">
          <h4>{{ currentPowerMeter.name }}</h4>
          <div v-if="currentPowerMeterIndex === 0" class="semi-circle-progress">
            <SemiCircleProgressBar :percentage="currentPowerMeter.operational" />
          </div>
          <div v-else>
            <p>Status: {{ currentPowerMeter.status }}
              <span :class="{'status-dot': true, 'status-online': currentPowerMeter.status === 'Online', 'status-offline': currentPowerMeter.status === 'Offline'}"></span>
            </p>
            <p>Average kWh: {{ currentPowerMeter.avgKwh }} kWh</p>
            <p>Total kWh: {{ currentPowerMeter.totalKwh }} kWh</p>
          </div>
          <div class="card-footer">
            <div class="card-pagination">
              <button @click="prevPowerMeter" :disabled="currentPowerMeterIndex === 0">&lt;</button>
              <p>{{ currentPowerMeterIndex + 1 }}/{{ powerMeters.length }}</p>
              <button @click="nextPowerMeter" :disabled="currentPowerMeterIndex === powerMeters.length - 1">&gt;</button>
            </div>
            <router-link to="/power-meter-reading" class="see-more">View Details</router-link>
          </div>
        </div>
        <div class="subsystem-card">
          <h4>{{ currentWaterMeter.name }}</h4>
          <div v-if="currentWaterMeterIndex === 0" class="semi-circle-progress">
            <SemiCircleProgressBar :percentage="currentWaterMeter.operational" />
          </div>
          <div v-else>
            <p>Status: {{ currentWaterMeter.status }}
              <span :class="{'status-dot': true, 'status-online': currentWaterMeter.status === 'Online', 'status-offline': currentWaterMeter.status === 'Offline'}"></span>
            </p>
            <p>Average Flow Rate: {{ currentWaterMeter.avgFlowRate }} L/min</p>
            <p>Average Usage: {{ currentWaterMeter.avgUsage }} L</p>
            <p>Average Pressure: {{ currentWaterMeter.avgPressure }} kPa</p>
            <p>Average Temperature: {{ currentWaterMeter.avgTemperature }}°C</p>
          </div>
          <div class="card-footer">
            <div class="card-pagination">
              <button @click="prevWaterMeter" :disabled="currentWaterMeterIndex === 0">&lt;</button>
              <p>{{ currentWaterMeterIndex + 1 }}/{{ waterMeters.length }}</p>
              <button @click="nextWaterMeter" :disabled="currentWaterMeterIndex === waterMeters.length - 1">&gt;</button>
            </div>
            <router-link to="/water-meter-reading" class="see-more">View Details</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SemiCircleProgressBar from '@/components/SemiCircleProgressBar.vue';
import CircularProgressBar from '@/components/CircularProgressBar.vue';

export default {
  name: 'OverviewPage',
  components: {
    SemiCircleProgressBar,
    CircularProgressBar,
  },
  data() {
    return {
      selectedArea: null,
      totalGroups: 0,
      totalItems: 0,
      itemsWithConnectionIssues: 0,
      progressData: [
        { label: 'Energy Efficiency', value: 100 },
        { label: 'Water Usage', value: 100 },
        { label: 'Temperature Control', value: 100 },
        { label: 'Air Quality', value: 100 },
        { label: 'System Performance', value: 100 },
      ],
      fireAlarms: [
        { name: 'Fire Alarm System Overview', operational: 100 },
        { name: 'SAP-1', status: 'Online', lastUpdated: '2024-05-29 14:30:00' },
        { name: 'SAP-2', status: 'Offline', lastUpdated: '2024-05-29 14:20:00' },
        { name: 'SAP-3', status: 'Online', lastUpdated: '2024-05-29 14:25:00' },
        { name: 'SAP-4', status: 'Online', lastUpdated: '2024-05-29 14:15:00' },
        { name: 'SAP-5', status: 'Online', lastUpdated: '2024-05-29 14:35:00' },
        { name: 'SAP-6', status: 'Online', lastUpdated: '2024-05-29 14:10:00' },
      ],
      iaqDevices: [
        { name: 'IAQ Devices Overview', operational: 100 },
        { name: 'Device 1', status: 'Online', avgTemp: 23.0, avgHumidity: 65.0, avgPressure: 1009.0, avgCO2: 440.0 },
        { name: 'Device 2', status: 'Online', avgTemp: 24.0, avgHumidity: 64.0, avgPressure: 1008.0, avgCO2: 450.0 },
      ],
      powerMeters: [
        { name: 'Power Meter Overview', operational: 100 },
        { name: 'Power Meter 1', status: 'Online', avgKwh: 59.13, totalKwh: 531.67 },
        { name: 'Power Meter 2', status: 'Online', avgKwh: 60.00, totalKwh: 600.00 },
      ],
      waterMeters: [
        { name: 'Water Meter Overview', operational: 100 },
        { name: 'Water Meter 1', status: 'Online', avgFlowRate: 12.18, avgUsage: 420.0, avgPressure: 100.5, avgTemperature: 20.32 },
        { name: 'Water Meter 2', status: 'Online', avgFlowRate: 13.00, avgUsage: 430.0, avgPressure: 101.0, avgTemperature: 21.00 },
      ],
      currentFireAlarmIndex: 0,
      currentIAQDeviceIndex: 0,
      currentPowerMeterIndex: 0,
      currentWaterMeterIndex: 0,
    };
  },
  computed: {
    currentFireAlarm() {
      return this.fireAlarms[this.currentFireAlarmIndex];
    },
    currentIAQDevice() {
      return this.iaqDevices[this.currentIAQDeviceIndex];
    },
    currentPowerMeter() {
      return this.powerMeters[this.currentPowerMeterIndex];
    },
    currentWaterMeter() {
      return this.waterMeters[this.currentWaterMeterIndex];
    },
  },
  methods: {
    selectArea(area) {
      this.selectedArea = area;
    },
    async fetchSummaryData() {
      try {
        const response = await fetch('https://hammerhead-app-kva7n.ondigitalocean.app/Bacnet/api/get/east/bms/groups');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let textData = await response.text();
        textData = textData.replace(/ObjectId\("([^"]+)"\)/g, '"$1"');
        const groupsData = JSON.parse(textData);

        const dataResponse = await fetch('https://hammerhead-app-kva7n.ondigitalocean.app/Bacnet/api/get/all/east/latest/data');
        if (!dataResponse.ok) {
          throw new Error('Network response was not ok');
        }
        let latestTextData = await dataResponse.text();
        latestTextData = latestTextData.replace(/ObjectId\("([^"]+)"\)/g, '"$1"');
        latestTextData = latestTextData.replace(/ISODate\("([^"]+)"\)/g, '"$1"');
        const latestData = JSON.parse(latestTextData);

        this.totalGroups = groupsData.length;
        this.totalItems = groupsData.reduce((total, group) => total + group.group.length, 0);
        this.itemsWithConnectionIssues = latestData.filter(item => item.Status !== 'OK').length;

      } catch (error) {
        console.error('Error fetching summary data:', error);
      }
    },
    nextFireAlarm() {
      if (this.currentFireAlarmIndex < this.fireAlarms.length - 1) {
        this.currentFireAlarmIndex++;
      }
    },
    prevFireAlarm() {
      if (this.currentFireAlarmIndex > 0) {
        this.currentFireAlarmIndex--;
      }
    },
    nextIAQDevice() {
      if (this.currentIAQDeviceIndex < this.iaqDevices.length - 1) {
        this.currentIAQDeviceIndex++;
      }
    },
    prevIAQDevice() {
      if (this.currentIAQDeviceIndex > 0) {
        this.currentIAQDeviceIndex--;
      }
    },
    nextPowerMeter() {
      if (this.currentPowerMeterIndex < this.powerMeters.length - 1) {
        this.currentPowerMeterIndex++;
      }
    },
    prevPowerMeter() {
      if (this.currentPowerMeterIndex > 0) {
        this.currentPowerMeterIndex--;
      }
    },
    nextWaterMeter() {
      if (this.currentWaterMeterIndex < this.waterMeters.length - 1) {
        this.currentWaterMeterIndex++;
      }
    },
    prevWaterMeter() {
      if (this.currentWaterMeterIndex > 0) {
        this.currentWaterMeterIndex--;
      }
    },
  },
  async created() {
    await this.fetchSummaryData();
  },
};
</script>

<style scoped>
.overview-container {
  display: grid;
  grid-template-areas:
    "summary-be map-hierarchy"
    "summary-subsystems map-hierarchy";
  grid-gap: 20px;
  padding: 20px;
}

.summary-be {
  grid-area: summary-be;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.progress-bars {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.progress-bar-container {
  flex: 1;
  min-width: 100px;
}

.map-hierarchy {
  grid-area: map-hierarchy;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.summary-subsystems {
  grid-area: summary-subsystems;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.summary-content,
.map-content,
.subsystems-content {
  display: flex;
  flex-direction: column;
}

.subsystems-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.subsystem-card {
  background: #1c1e29;
  color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.subsystem-card h4 {
  color: #ffffff;
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.card-pagination button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 18px;
}

.card-pagination p {
  margin: 0 5px;
}

.semi-circle-progress {
  margin: 20px 0;
}

.status-dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 5px;
}

.status-online {
  background-color: green;
}

.status-offline {
  background-color: red;
}

.see-more {
  color: #007bff;
  text-decoration: none;
}

.fixed-size {
  width: 100%;
  height: 400px; /* Adjust height as needed */
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>

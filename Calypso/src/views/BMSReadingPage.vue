<template>
  <div class="container">
    <h2 class="text-center mb-4">Building Management System</h2>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentView === 'bms' }" @click="toggleView('bms')">BMS</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: currentView === 'groupings' }" @click="toggleView('groupings')">Groupings</a>
      </li>
    </ul>
    <div v-if="currentView === 'bms'" class="tab-content">
      <div class="image-container">
        <img src="@/assets/BMS.jpg" alt="Chiller Plant Room" class="background-image">
        <div v-for="(position, sensorName) in sensorPositions" :key="sensorName" class="sensor-value" :style="position" :class="{ slantedNegative: isSlantedNegative(sensorName), slantedPositive: isSlantedPositive(sensorName) }">
          {{ getValue(sensorName) }}
        </div>
      </div>
    </div>
    <div v-if="currentView === 'groupings'" class="group-sensors">
      <div v-for="(group) in filteredGroups" :key="group._id" class="mb-4">
        <h3>{{ group.name }}</h3>
        <div class="sensor-list">
          <div v-for="(id, index) in group.group" :key="id" class="sensor-item">
            <h5>{{ group.item_name[index] || 'Data Unavailable' }}</h5>
            <p>
              <span :class="['status-label', getStatusClass(findLatestDataById(id).Status)]">
                Connection: {{ findLatestDataById(id).Status || 'N/A' }}
              </span>
            </p>
            <p>
              <span v-if="shouldShowStatus(findLatestDataById(id).Name || '')" :class="['status-label', getActiveClass(id)]">
                Status: {{ getActiveValue(id) || 'N/A' }}
              </span>
            </p>
            <p>Value: {{ formatValue(getPresentValue(id)) }} {{ group.units[index] || '' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as CacheManager from '@/CacheManager.js';

export default {
  data() {
    return {
      currentView: 'bms',
      groups: [],
      loading: true,
      error: null,
      latestData: [],
      refreshInterval: null,
      search: '',
      sensors: {
        'Chilled Water Flow Meter': { value: 0.0, unit: 'L/s' },
        'Chilled Water Return Temperature': { value: 25.0, unit: '°C' },
        'Chilled Water Supply Temperature': { value: 25.3, unit: '°C' },
        'Cond Water Flow Meter': { value: 0.0, unit: 'L/s' },
        'Cond Water Return Temperature': { value: 26.7, unit: '°C' },
        'Cooling Tower Supply Temperature': { value: 30.0, unit: '°C' },
        'Outdoor Temperature': { value: 30.5, unit: '°C' },
        'Outdoor Humidity': { value: 49.1, unit: '%RH' },
        'Cond Water Supply Temperature': { value: 26.5, unit: '°C' },
        'AHU Flow Rate': { value: -0.0, unit: 'L/s' },
        'AHU Valve': { value: 0.0, unit: '%' },
        'Supply Air Temperature': { value: 27.1, unit: '°C' },
        'Total Cooling Load': { value: 0.0, unit: '' },
        'Total Power Consumption': { value: 0.3, unit: '' },
        'System Efficiency': { value: 0.0, unit: '' },
        'Heat Balance': { value: 0.0, unit: '' },
        'STOP 1': { value: 'STOP' },
        'STOP 2': { value: 'STOP' },
        'STOP 3': { value: 'STOP' },
        'STOP 4': { value: 'STOP' },
        'STOP 5': { value: 'STOP' },
        'STOP 6': { value: 'STOP' },
        'OFF 1': { value: 'OFF' },
        'OFF 2': { value: 'OFF' },
        'OFF 3': { value: 'OFF' },
        'OFF 4': { value: 'OFF' },
        'OFF 5': { value: 'OFF' },
        'ALARM': { value: 'ALARM' }
      },
      sensorPositions: {
        'Chilled Water Flow Meter': { top: '512px', left: '183px' },
        'Chilled Water Return Temperature': { top: '525px', left: '375px' },
        'Chilled Water Supply Temperature': { top: '499px', left: '399px' },
        'Cond Water Flow Meter': { top: '260px', left: '514px' },
        'Cond Water Return Temperature': { top: '227px', left: '485px' },
        'Cooling Tower Supply Temperature': { top: '148px', left: '461px' },
        'Outdoor Temperature': { top: '67px', left: '557px' },
        'Outdoor Humidity': { top: '95px', left: '547px' },
        'Cond Water Supply Temperature': { top: '230px', left: '633px' },
        'AHU Flow Rate': { top: '458px', left: '681px' },
        'AHU Valve': { top: '403px', left: '785px' },
        'Supply Air Temperature': { top: '338px', left: '1008px' },
        'Total Cooling Load': { top: '135px', left: '794px' },
        'Total Power Consumption': { top: '135px', left: '892px' },
        'System Efficiency': { top: '135px', left: '999px' },
        'Heat Balance': { top: '135px', left: '1100px' },
        'STOP 1': { top: '345px', left: '567px' },
        'STOP 2': { top: '388px', left: '1017px' },
        'STOP 3': { top: '555px', left: '973px' },
        'STOP 4': { top: '325px', left: '307px' },
        'STOP 5': { top: '147px', left: '183px' },
        'STOP 6': { top: '576px', left: '76px' },
        'OFF 1': { top: '412px', left: '1022px' },
        'OFF 2': { top: '373px', left: '572px' },
        'OFF 3': { top: '352px', left: '313px' },
        'OFF 4': { top: '171px', left: '186px' },
        'OFF 5': { top: '601px', left: '81px' },
        'ALARM': { top: '600px', left: '931px' }
      },
    };
  },
  async created() {
    if (CacheManager.getItem('bms') != null) {
      this.latestData = CacheManager.getItem('bms');
      await this.fetchLatestData();
      await this.fetchData();
    } else {
      await this.fetchLatestData();
      await this.fetchData();
    }
    this.setRefreshInterval();
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  computed: {
    filteredGroups() {
      const searchTerm = this.search.toLowerCase();
      return this.groups.filter(group => group.name.toLowerCase().includes(searchTerm));
    },
  },
  methods: {
    toggleView(view) {
      this.currentView = view;
    },
    setRefreshInterval() {
      this.refreshInterval = setInterval(() => {
        this.fetchLatestData();
      }, 120000);
    },
    async fetchData() {
      this.loading = true;
      try {
        const response = await fetch('https://hammerhead-app-kva7n.ondigitalocean.app/Bacnet/api/get/east/bms/groups');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let textData = await response.text();
        textData = textData.replace(/ObjectId\("([^"]+)"\)/g, '"$1"');
        const data = JSON.parse(textData);
        this.groups = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchLatestData() {
      this.loading = true;
      try {
        const response = await fetch('https://hammerhead-app-kva7n.ondigitalocean.app/Bacnet/api/get/all/east/latest/data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let textData = await response.text();
        textData = textData.replace(/ObjectId\("([^"]+)"\)/g, '"$1"');
        textData = textData.replace(/ISODate\("([^"]+)"\)/g, '"$1"');
        const data = JSON.parse(textData);
        this.latestData = data;

        CacheManager.setItem('bms', this.latestData);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    findLatestDataById(objectId) {
      const filteredData = this.latestData.filter(data => data.ObjectId === objectId);
      return filteredData.length > 0 ? filteredData[filteredData.length - 1] : {};
    },
    toggleGroupCommand(group, event) {
      const command = event.target.checked ? 0 : 1;
      group.group.forEach(id => {
        const data = this.findLatestDataById(id);
        if (data) {
          data.Value = command;
        }
      });
    },
    getActiveValue(id) {
      const latestData = this.findLatestDataById(id);
      if (latestData.Name && latestData.Name.includes('Status')) {
        return latestData.Value >= 1 ? 'On' : 'Off';
      } else if (latestData.Name && latestData.Name.includes('_GD')) {
        return latestData.Value >= 1 ? 'Close' : 'Open';
      } else if (latestData.Name && latestData.Name.includes('_SD')) {
        return latestData.Value >= 1 ? 'Close' : 'Open';
      }
      return 'Active';
    },
    getPresentValue(id) {
      const latestData = this.findLatestDataById(id);
      return latestData.Value;
    },
    shouldShowStatus(name) {
      return name && (name.includes('Status') || name.includes('_GD') || name.includes('_SD'));
    },
    getStatusClass(status) {
      return status === 'OK' ? 'ok' : 'not-ok';
    },
    getActiveClass(id) {
      const activeValue = this.getActiveValue(id);
      return activeValue === 'On' || activeValue === 'Open' ? 'ok' : 'not-ok';
    },
    formatValue(value) {
      const numValue = Number(value);
      return isNaN(numValue) ? 'N/A' : numValue.toFixed(1);
    },
    getValue(sensorName) {
      const sensor = this.sensors[sensorName];
      return sensor ? `${sensor.value} ${sensor.unit || ''}` : 'N/A';
    },
    isSlantedNegative(sensorName) {
      return ['Chilled Water Flow Meter'].includes(sensorName);
    },
    isSlantedPositive(sensorName) {
      return ['Chilled Water Supply Temperature', 'Chilled Water Return Temperature'].includes(sensorName);
    }
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}
.nav-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.nav-tabs .nav-item {
  margin-right: 5px;
}
.nav-tabs .nav-link {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.nav-tabs .nav-link.active {
  background-color: #007bff;
  color: white;
}
.image-container {
  position: relative;
}

.background-image {
  width: 100%;
  height: auto;
}

.sensor-value {
  position: absolute;
  padding: 5px;
  border-radius: 3px;
  font-weight: bold;
  /* Adjust styles as needed */
}

.slantedNegative {
  transform: rotate(-20deg);
}

.slantedPositive {
  transform: rotate(20deg);
}

.group-sensors {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.sensor-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.sensor-item {
  border: 1px solid lightgrey;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 18rem;
}
.status-label {
  display: inline-block;
  padding: 0.25em 0.6em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.375rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.ok {
  color: #fff;
  background-color: #28a745;
}
.not-ok {
  color: #fff;
  background-color: #dc3545;
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
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}
.grid-item {
  border: 1px solid lightgrey;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>

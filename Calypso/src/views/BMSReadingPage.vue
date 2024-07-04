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
        <div v-for="(position, sensorName) in sensorPositions" :key="sensorName" class="sensor-value" :style="position">
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
            <p>Date: {{ findLatestDataById(id).dateTime || 'N/A' }}</p>
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
      sensorPositions: {
        'Cooling Tower Supply Temperature': { top: '50px', left: '200px' },
        'Outdoor Temperature': { top: '80px', left: '400px' },
        'Outdoor Humidity': { top: '110px', left: '400px' },
        'Cond Water Return Temperature': { top: '150px', left: '250px' },
        'Cond Water Supply Temperature': { top: '180px', left: '350px' },
        'Cond Water Flow Meter': { top: '210px', left: '300px' },
        'Chilled Water Flow Meter': { top: '240px', left: '450px' },
        'Chilled Water Supply Temperature': { top: '270px', left: '550px' },
        'Chilled Water Return Temperature': { top: '300px', left: '600px' },
        'Supply Air Temperature': { top: '330px', left: '650px' },
        'AHU Status': { top: '50px', left: '700px' },
        'AHU Command': { top: '80px', left: '700px' },
        'AHU Valve': { top: '110px', left: '700px' },
        'AHU Flow Rate': { top: '140px', left: '700px' },
        'Chilled Water Pump Status': { top: '170px', left: '700px' },
        'Chilled Water Pump Command': { top: '200px', left: '700px' },
        'Chiller Status': { top: '260px', left: '700px' },
        'Chiller Command': { top: '290px', left: '700px' },
        'System Efficiency': { top: '320px', left: '700px' },
        'Total Power Consumption': { top: '350px', left: '700px' },
        'Total Cooling Load': { top: '380px', left: '700px' },
        'Heat Balance': { top: '410px', left: '700px' },
        'Cond Water Pump Status': { top: '440px', left: '700px' },
        'Cond Water Pump Command': { top: '470px', left: '700px' },
        'Cooling Tower Status': { top: '530px', left: '700px' },
        'Cooling Tower Command': { top: '560px', left: '700px' },
        'Cond Water Return Temperature 2': { top: '590px', left: '700px' },
        'Cond Water Supply Temperature 2': { top: '620px', left: '700px' },
        'System Failure Alarm': { top: '650px', left: '700px' },
        'System Command': { top: '680px', left: '700px' },
      },
      sensors: {
        'Cooling Tower Supply Temperature': { value: 30.0, unit: '°C', dateTime: '07/04/2024 8:24:37 PM' },
        'Outdoor Temperature': { value: 30.5, unit: '°C', dateTime: '07/04/2024 8:24:52 PM' },
        'Outdoor Humidity': { value: 49.1, unit: '%RH', dateTime: '07/04/2024 8:24:58 PM' },
        'Cond Water Return Temperature': { value: 26.7, unit: '°C', dateTime: '07/04/2024 8:24:58 PM' },
        'Cond Water Supply Temperature': { value: 26.5, unit: '°C', dateTime: '07/04/2024 8:24:58 PM' },
        'Cond Water Flow Meter': { value: 0.0, unit: 'L/s', dateTime: '07/04/2024 8:24:56 PM' },
        'Chilled Water Flow Meter': { value: 0.0, unit: 'L/s', dateTime: '07/04/2024 8:25:01 PM' },
        'Chilled Water Supply Temperature': { value: 25.3, unit: '°C', dateTime: '07/04/2024 8:24:59 PM' },
        'Chilled Water Return Temperature': { value: 25.0, unit: '°C', dateTime: '07/04/2024 8:24:56 PM' },
        'Supply Air Temperature': { value: 27.1, unit: '°C', dateTime: '07/04/2024 8:24:52 PM' },
        'AHU Status': { value: 0.0, unit: '', dateTime: '07/04/2024 8:24:52 PM' },
        'AHU Command': { value: 0.0, unit: '', dateTime: '07/04/2024 8:24:52 PM' },
        'AHU Valve': { value: 0.0, unit: '%', dateTime: '07/04/2024 8:24:49 PM' },
        'AHU Flow Rate': { value: -0.0, unit: 'L/s', dateTime: '07/04/2024 8:24:51 PM' },
        'Chilled Water Pump Status': { value: 0.0, unit: '', dateTime: '07/04/2024 8:24:54 PM' },
        'Chilled Water Pump Command': { value: 0.0, unit: '', dateTime: '07/04/2024 8:24:56 PM' },
        'Chiller Status': { value: 0.0, unit: '', dateTime: '07/04/2024 8:24:56 PM' },
        'Chiller Command': { value: 0.0, unit: '', dateTime: '07/04/2024 8:24:56 PM' },
        'System Efficiency': { value: 0.0, unit: 'KW/TON', dateTime: '07/04/2024 8:24:57 PM' },
        'Total Power Consumption': { value: 0.3, unit: 'KW', dateTime: '07/04/2024 8:24:56 PM' },
        'Total Cooling Load': { value: 0.0, unit: 'KW', dateTime: '07/04/2024 8:24:56 PM' },
        'Heat Balance': { value: 0.0, unit: '%', dateTime: '07/04/2024 8:24:58 PM' },
        'Cond Water Pump Status': { value: 'N/A', unit: '', dateTime: 'N/A' },
        'Cond Water Pump Command': { value: 'N/A', unit: '', dateTime: 'N/A' },
        'Cooling Tower Status': { value: 0.0, unit: '', dateTime: '07/04/2024 8:24:58 PM' },
        'Cooling Tower Command': { value: 'N/A', unit: '', dateTime: 'N/A' },
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
      return sensor ? `${sensor.value} ${sensor.unit}` : 'N/A';
    },
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
.overview-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 80vh;
  overflow-y: auto;
}
.overview-list::-webkit-scrollbar {
  width: 8px;
}
.overview-list::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 5px;
}
.overview-list::-webkit-scrollbar-thumb {
  background-color: lightgrey;
  border-radius: 5px;
  border: 2px solid #f8f9fa;
}
.overview-item {
  border: 1px solid lightgrey;
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.overview-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.overview-item h5 {
  margin-bottom: 10px;
  font-size: 1.25rem;
  font-weight: bold;
  color: #007bff;
}
.toggle-switch {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 34px;
}
.toggle-switch input {
  display: none;
}
.switch-label {
  display: block;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 20px;
}
.switch-label .switch-inner {
  display: block;
  width: 200%;
  margin-left: -100%;
  transition: margin 0.3s ease-in 0s;
  background-color: #ccc;
}
.switch-label .switch-inner::before, .switch-label .switch-inner::after {
  display: block;
  float: left;
  width: 50%;
  height: 34px;
  padding: 0;
  line-height: 34px;
  font-size: 14px;
  color: white;
  font-weight: bold;
  box-sizing: border-box;
}
.switch-label .switch-inner::before {
  content: "OFF";
  padding-left: 10px;
  background-color: #dc3545;
  color: white;
}
.switch-label .switch-inner::after {
  content: "ON";
  padding-right: 10px;
  background-color: #28a745;
  color: white;
  text-align: right;
}
.switch-label .switch-switch {
  display: block;
  width: 26px;
  height: 26px;
  margin: 4px;
  background: white;
  position: absolute;
  top: 2px;
  bottom: 0;
  right: 44px;
  border: 2px solid transparent;
  border-radius: 20px;
  transition: all 0.3s ease-in 0s;
}
input:checked + .switch-label .switch-inner {
  margin-left: 0;
}
input:checked + .switch-label .switch-switch {
  right: 4px;
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
.image-container {
  position: relative;
}

.background-image {
  width: 100%;
  height: auto;
}

.sensor-value {
  position: absolute;
  background: rgba(255, 255, 255, 0.7);
  padding: 5px;
  border-radius: 3px;
  font-weight: bold;
  /* Adjust styles as needed */
}
</style>

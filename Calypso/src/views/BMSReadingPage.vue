<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Building Management System (JCS) Reading</h2>
    <div class="row">
      <div class="col-md-3">
        <h4 class="section-title">Building Management System Groups</h4>
        <div class="overview-list">
          <div
            v-for="(group, index) in groups"
            :key="index"
            :class="['overview-item', { 'highlight': hoveredGroup === index }]"
            @mouseenter="hoveredGroup = index"
            @mouseleave="hoveredGroup = null"
          >
            <h5>{{ group.name }}</h5>
            <div class="toggle-switch">
              <input type="checkbox" :id="'switch' + index" @change="toggleGroupCommand(group, $event)" />
              <label :for="'switch' + index" class="switch-label">
                <span class="switch-inner"></span>
                <span class="switch-switch"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div class="view-switcher">
          <button @click="toggleView('groupings')" :class="{ 'active': currentView === 'groupings' }">Groupings</button>
          <!-- Add other view buttons here if needed -->
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
                <p>Value: {{ getPresentValue(id) }} {{ group.units[index] || '' }}</p>
                <p>Date: {{ findLatestDataById(id).dateTime || 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="link-button">
          <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
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
      currentView: 'groupings',
      hoveredGroup: null,
      groups: [],
      loading: true,
      error: null,
      latestData: [],
      refreshInternal: null,
      search: '',
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
    navigateTo3DLandscape() {
      window.location.href = 'https://your-3d-landscape-url.com';
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
  gap: 10px;
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
  border-radius: 0.375rem; /* Rounded corners */
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.ok {
  color: #fff;
  background-color: #28a745; /* Green background for 'OK' status */
}
.not-ok {
  color: #fff;
  background-color: #dc3545; /* Red background for non-'OK' statuses */
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
</style>

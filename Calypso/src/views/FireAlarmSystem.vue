<template>
  <div class="container mt-5 bordered-container">
    <h2 class="text-center mb-4">Fire Alarm System</h2>
    <div class="row">
      <div class="col-md-3">
        <h4 class="section-title">Fire Alarm Sensors</h4>
        <div class="overview-list">
          <div
            v-for="(alarm, index) in alarms"
            :key="index"
            :class="['overview-item', { 'highlight': hoveredAlarm === index }]"
            @mouseenter="hoveredAlarm = index"
            @mouseleave="hoveredAlarm = null"
          >
            <h5>SAP-{{ alarm.id }}</h5>
            <p>
              Status:
              <span :class="{'text-success': alarm.isOnline, 'text-danger': !alarm.isOnline}">
                {{ alarm.isOnline ? 'Online' : 'Offline' }}
              </span>
            </p>
            <p>
              Fire Alarm:
              <span :class="{'text-danger': alarm.isActive, 'text-success': !alarm.isActive}">
                {{ alarm.isActive ? 'On' : 'Off' }}
              </span>
            </p>
            <p>Last Updated: {{ alarm.lastUpdated }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div class="view-switcher">
          <button @click="toggleView('relation')" :class="{'active': currentView === 'relation'}">Relation</button>
        </div>
        <div class="map-container" v-if="currentView === 'relation'">
          <img src="@/assets/ite_firealarm_relation.png" alt="Floor Plan" class="map-image">
          <div
            v-for="(alarm, index) in alarms"
            :key="index"
            class="alarm-status"
            :style="alarmPositions[index]"
            @mouseenter="hoveredAlarm = index"
            @mouseleave="hoveredAlarm = null"
            :class="{ 'highlight': hoveredAlarm === index }"
          >
            <span :class="{'online': alarm.isOnline, 'offline': !alarm.isOnline}"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FireAlarmSystem',
  data() {
    return {
      currentView: 'relation',
      hoveredAlarm: null,
      alarms: [
        { id: 1, isActive: true, isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 2, isActive: false, isOnline: false, lastUpdated: '2024-05-29 14:20:00' },
       
        { id: 3, isActive: true, isOnline: true, lastUpdated: '2024-05-29 14:25:00' },
        { id: 4, isActive: true, isOnline: true, lastUpdated: '2024-05-29 14:15:00' },
        { id: 5, isActive: true, isOnline: true, lastUpdated: '2024-05-29 14:35:00' },
        { id: 6, isActive: true, isOnline: true, lastUpdated: '2024-05-29 14:10:00' },
      ],
      alarmPositions: [
        { top: '41.2%', left: '84.2%' },
        { top: '41.2%', left: '63.3%' },
        { top: '41.2%', left: '42.3%' },
        { top: '87.8%', left: '84.2%' },
        { top: '87.8%', left: '63.3%' },
        { top: '87.8%', left: '42.3%' },
      ],
    };
  },
  methods: {
    toggleView(view) {
      this.currentView = view;
    },
    navigateTo3DLandscape() {
      window.location.href = "https://your-3d-landscape-url.com";
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
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid lightgrey; /* Add a light grey border to each overview item */
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
.map-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid lightgrey; /* Add a border to the map container */
  border-radius: 5px; /* Optional: Add rounded corners to the map container */
}
.map-image {
  width: 100%;
  height: auto;
}
.alarm-status {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 1px solid black; /* Adding black border */
}
.alarm-status span {
  display: block;
  width: 100%;
  height: 100%;
}
.online {
  background-color: green;
  border-radius: 2px;
  border: 1px solid black; /* Adding black border */
}
.offline {
  background-color: red;
  border-radius: 2px;
  border: 1px solid black; /* Adding black border */
}
.text-danger {
  color: #dc3545 !important;
}
.text-success {
  color: #28a745 !important;
}
.highlight {
  border: 2px solid #00BCD4;
  border-radius: 2px;
}
.link-button {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
}
</style>

<template>
  <div class="container mt-5 bordered-container">
    <h2 class="text-center mb-4">Fire Alarm System</h2>
    <div class="view-switcher">
      <button @click="toggleView('relation')" :class="{'active': currentView === 'relation'}">Relation</button>
      <button @click="toggleView('devices')" :class="{'active': currentView === 'devices'}">Devices</button>
    </div>
    <div v-if="currentView === 'relation'" class="map-container">
      <img src="@/assets/ite_firealarm_relation.png" alt="Floor Plan" class="map-image">
      <div
        v-for="(alarm, index) in sortedAlarms"
        :key="index"
        class="alarm-status"
        :style="alarmPositions[index]"
        @mouseenter="hoveredAlarm = index"
        @mouseleave="hoveredAlarm = null"
        :class="{ 'highlight': hoveredAlarm === index }"
      >
        <span :class="{'online': alarm.status === 'ON', 'offline': alarm.status === 'OFF'}"></span>
      </div>
    </div>
    <div v-if="currentView === 'devices'" class="devices-grid">
      <div
        v-for="(alarm, index) in sortedAlarms"
        :key="index"
        :class="['device-item', { 'highlight': hoveredAlarm === index }]"
        @mouseenter="hoveredAlarm = index"
        @mouseleave="hoveredAlarm = null"
      >
        <h5>{{ alarm.name }}</h5>
        <p>
          Status:
          <span :class="{'text-success': alarm.status === 'ON', 'text-danger': alarm.status === 'OFF'}">
            {{ alarm.status === 'ON' ? 'Online' : 'Offline' }}
          </span>
        </p>
        <p>Last Updated: {{ alarm.dateTimeRecorded }}</p>
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
      alarms: [],
      alarmPositions: [
        { top: '41.2%', left: '84.2%' },
        { top: '41.2%', left: '63.3%' },
        { top: '41.2%', left: '42.3%' },
        { top: '87.9%', left: '84.2%' },
        { top: '87.9%', left: '63.3%' },
        { top: '87.9%', left: '42.3%' },
      ],
    };
  },
  async created() {
    await this.fetchAlarms();
  },
  computed: {
    sortedAlarms() {
      return this.alarms.slice().sort((a, b) => {
        const zoneA = parseInt(a.name.split(' ')[1]);
        const zoneB = parseInt(b.name.split(' ')[1]);
        return zoneA - zoneB;
      });
    },
  },
  methods: {
    toggleView(view) {
      this.currentView = view;
    },
    async fetchAlarms() {
      try {
        const response = await fetch('https://hammerhead-app-kva7n.ondigitalocean.app/api/FireAlarm/data/latest');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.alarms = data;
      } catch (error) {
        console.error('Error fetching alarms:', error);
      }
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
}
.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
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
  border: 1px solid lightgrey;
  border-radius: 5px;
}
.map-image {
  width: 100%;
  height: auto;
}
.alarm-status {
  position: absolute;
  width: 28px;
  height: 28px;
  border: 1px solid black;
}
.alarm-status span {
  display: block;
  width: 100%;
  height: 100%;
}
.online {
  background-color: green;
  border-radius: 2px;
  border: 1px solid black;
}
.offline {
  background-color: red;
  border-radius: 2px;
  border: 1px solid black;
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
.devices-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.device-item {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid lightgrey;
  transition: transform 0.3s, box-shadow 0.3s;
}
.device-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.device-item h5 {
  margin-bottom: 10px;
  font-size: 1.25rem;
  font-weight: bold;
  color: #007bff;
}
</style>

<!-- eslint-disable -->
<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Fire Alarm System</h2>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="(alarm, index) in alarms" :key="index">
        <div class="card custom-card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">SAP-{{ alarm.id }}</h5>
            <p class="card-text">
              Status: <span :class="{'text-success': alarm.isOnline, 'text-danger': !alarm.isOnline}">
                {{ alarm.isOnline ? 'Online' : 'Offline' }}
              </span>
            </p>
            <p class="card-text">
              Fire Alarm: <span :class="{'text-danger': alarm.isActive, 'text-success': !alarm.isActive}">
                {{ alarm.isActive ? 'On' : 'Off' }}
              </span>
            </p>
            <p class="card-text">Last Updated: {{ alarm.lastUpdated }}</p>
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
      alarms: [
        { id: 1, isActive: true, isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 2, isActive: false, isOnline: true, lastUpdated: '2024-05-29 14:20:00' },
        { id: 3, isActive: true, isOnline: true, lastUpdated: '2024-05-29 14:25:00' },
        { id: 4, isActive: false, isOnline: false, lastUpdated: '2024-05-29 14:15:00' },
        { id: 5, isActive: true, isOnline: false, lastUpdated: '2024-05-29 14:35:00' },
        { id: 6, isActive: false, isOnline: true, lastUpdated: '2024-05-29 14:10:00' },
      ],
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
.custom-card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}
.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card-title {
  margin-bottom: 15px;
  font-size: 1.25rem;
  font-weight: bold;
  color: #007bff;
}
.card-text {
  font-size: 1rem;
  text-align: center;
}
.text-danger {
  color: #dc3545 !important;
}
.text-success {
  color: #28a745 !important;
}
</style>

<!-- eslint-disable -->
<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <!-- Fire Alarm System -->
      <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            Fire Alarm System
          </div>
          <div class="card-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Alarm</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="alarm in alarms" :key="alarm.id">
                  <td>Alarm {{ alarm.id }}</td>
                  <td>
                    <span :class="{'badge bg-success': alarm.isActive, 'badge bg-danger': !alarm.isActive}">
                      {{ alarm.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>{{ alarm.lastUpdated }}</td>
                </tr>
              </tbody>
            </table>
            <button @click="navigateTo('/fire-alarm-system')" class="btn btn-primary mt-3 w-100">View Details</button>
          </div>
        </div>
      </div>

      <!-- IAQ Devices -->
      <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            IAQ Devices
          </div>
          <div class="card-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Average Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Temperature</td>
                  <td>{{ calculateAverage(devices, 'temperature') }} °C</td>
                </tr>
                <tr>
                  <td>Humidity</td>
                  <td>{{ calculateAverage(devices, 'humidity') }} %</td>
                </tr>
                <tr>
                  <td>Pressure</td>
                  <td>{{ calculateAverage(devices, 'pressure') }} hPa</td>
                </tr>
                <tr>
                  <td>CO2</td>
                  <td>{{ calculateAverage(devices, 'co2') }} ppm</td>
                </tr>
              </tbody>
            </table>
            <button @click="navigateTo('/iaq-devices-reading')" class="btn btn-primary mt-3 w-100">View Details</button>
          </div>
        </div>
      </div>

      <!-- Power Meter -->
      <div class="col-lg-2 col-md-6 col-sm-12 mb-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            Power Meter
          </div>
          <div class="card-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Average Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>kWh</td>
                  <td>{{ calculateAverage(powerDevices, 'kwh') }}</td>
                </tr>
              </tbody>
            </table>
            <button @click="navigateTo('/power-meter-reading')" class="btn btn-primary mt-3 w-100">View Details</button>
          </div>
        </div>
      </div>

      <!-- Water Meter -->
      <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            Water Meter
          </div>
          <div class="card-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Average Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Flow Rate</td>
                  <td>{{ calculateAverage(waterReadings, 'flowRate') }} L/min</td>
                </tr>
                <tr>
                  <td>Usage</td>
                  <td>{{ calculateAverage(waterReadings, 'usage') }} L</td>
                </tr>
                <tr>
                  <td>Pressure</td>
                  <td>{{ calculateAverage(waterReadings, 'pressure') }} kPa</td>
                </tr>
                <tr>
                  <td>Temperature</td>
                  <td>{{ calculateAverage(waterReadings, 'temperature') }} °C</td>
                </tr>
              </tbody>
            </table>
            <button @click="navigateTo('/water-meter-reading')" class="btn btn-primary mt-3 w-100">View Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alarms: [
        { id: 1, isActive: true, lastUpdated: '2024-06-07 14:30:15' },
        { id: 2, isActive: true, lastUpdated: '2024-06-07 14:20:23' },
        { id: 3, isActive: true, lastUpdated: '2024-06-07 14:25:22' },
        { id: 4, isActive: false, lastUpdated: '2024-06-07 14:15:56' },
        { id: 5, isActive: true, lastUpdated: '2024-06-07 14:35:23' },
        { id: 6, isActive: false, lastUpdated: '2024-06-07 14:10:53' },
      ],
      devices: [
        { id: 1, name: 'Device 1', temperature: 22, humidity: 45, pressure: 1013, co2: 400 },
        { id: 2, name: 'Device 2', temperature: 23, humidity: 50, pressure: 1012, co2: 420 },
        { id: 3, name: 'Device 3', temperature: 21, humidity: 55, pressure: 1011, co2: 410 },
        { id: 4, name: 'Device 4', temperature: 20, humidity: 60, pressure: 1010, co2: 430 },
        { id: 5, name: 'Device 5', temperature: 19, humidity: 65, pressure: 1009, co2: 440 },
        { id: 6, name: 'Device 6', temperature: 24, humidity: 70, pressure: 1008, co2: 450 },
        { id: 7, name: 'Device 7', temperature: 25, humidity: 75, pressure: 1007, co2: 460 },
        { id: 8, name: 'Device 8', temperature: 26, humidity: 80, pressure: 1006, co2: 470 },
        { id: 9, name: 'Device 9', temperature: 27, humidity: 85, pressure: 1005, co2: 480 },
      ],
      powerDevices: [
        { id: 1, name: 'Device 1', kwh: 123.45 },
        { id: 2, name: 'Device 2', kwh: 67.89 },
        { id: 3, name: 'Device 3', kwh: 45.67 },
        { id: 4, name: 'Device 4', kwh: 89.12 },
        { id: 5, name: 'Device 5', kwh: 23.45 },
        { id: 6, name: 'Device 6', kwh: 78.90 },
        { id: 7, name: 'Device 7', kwh: 56.78 },
        { id: 8, name: 'Device 8', kwh: 34.56 },
        { id: 9, name: 'Device 9', kwh: 12.34 },
      ],
      waterReadings: [
        {
          device: 'Water Meter 1',
          flowRate: 12.5,
          usage: 450,
          pressure: 101,
          temperature: 20.5,
        },
        {
          device: 'Water Meter 2',
          flowRate: 10.3,
          usage: 300,
          pressure: 99,
          temperature: 21.0,
        },
        {
          device: 'Water Meter 3',
          flowRate: 14.8,
          usage: 520,
          pressure: 102,
          temperature: 19.8,
        },
        {
          device: 'Water Meter 4',
          flowRate: 11.1,
          usage: 410,
          pressure: 100,
          temperature: 20.0,
        },
      ],
    };
  },
  methods: {
    calculateAverage(data, key) {
      const total = data.reduce((sum, item) => sum + item[key], 0);
      return (total / data.length).toFixed(2);
    },
    navigateTo(page) {
      this.$router.push(page);
    },
  },
};
</script>

<style scoped>
.container-fluid {
  max-width: 1200px;
}
.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.card-header {
  font-size: 1.2rem;
}
.card-body {
  padding: 15px;
}
.table {
  margin-bottom: 0;
}
.badge {
  font-size: 0.9rem;
}
.badge.bg-danger {
  background-color: #dc3545;
}
.badge.bg-success {
  background-color: #28a745;
}
.btn {
  font-size: 1rem;
  font-weight: bold;
}
</style>

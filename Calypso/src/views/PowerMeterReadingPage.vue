<template>
  <div class="container mt-5">
    <h2>Power Meter Reading</h2>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="device in devices" :key="device.id">
        <div class="card custom-card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ device.name }}</h5>
            <p class="card-text">kWh: {{ device.kwh }}</p>
            <p class="card-text">Voltage: {{ device.voltage }}</p>
            <p class="card-text">Current: {{ device.current }}</p>
            <p class="card-text">Power Factor: {{ device.powerFactor }}</p>
            <button @click="viewDetails(device.id)" class="btn btn-primary mt-auto">View Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PowerMeterReadingPage',
  data() {
    return {
      devices: [
        { id: 1, name: 'Device 1', kwh: 123.45, voltage: 220, current: 10, powerFactor: 0.95 },
        { id: 2, name: 'Device 2', kwh: 67.89, voltage: 220, current: 8, powerFactor: 0.9 },
        { id: 3, name: 'Device 3', kwh: 45.67, voltage: 220, current: 5, powerFactor: 0.85 },
        { id: 4, name: 'Device 4', kwh: 89.12, voltage: 220, current: 12, powerFactor: 0.92 },
        { id: 5, name: 'Device 5', kwh: 23.45, voltage: 220, current: 4, powerFactor: 0.87 },
        { id: 6, name: 'Device 6', kwh: 78.90, voltage: 220, current: 9, powerFactor: 0.93 },
        { id: 7, name: 'Device 7', kwh: 56.78, voltage: 220, current: 7, powerFactor: 0.88 },
        { id: 8, name: 'Device 8', kwh: 34.56, voltage: 220, current: 6, powerFactor: 0.86 },
        { id: 9, name: 'Device 9', kwh: 12.34, voltage: 220, current: 3, powerFactor: 0.89 },
      ],
    };
  },
  methods: {
    viewDetails(deviceId) {
      this.$router.push({ name: 'PowerDeviceDetail', params: { id: deviceId } });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}
.custom-card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}
.card-text {
  font-size: 1rem;
}
.btn {
  margin-top: auto;
}
</style>

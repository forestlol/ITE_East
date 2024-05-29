<template>
  <div class="container mt-5">
    <h1 class="mb-4">Water Meter Reading</h1>
    <p>This is the Water Meter Reading page.</p>
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4" v-for="(reading, index) in waterReadings" :key="index">
        <div class="card custom-card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ reading.device }}</h5>
            <p class="card-text"><strong>Water Flow Rate:</strong> {{ reading.flowRate }} L/min</p>
            <p class="card-text"><strong>Water Usage:</strong> {{ reading.usage }} L</p>
            <p class="card-text"><strong>Pressure:</strong> {{ reading.pressure }} kPa</p>
            <p class="card-text"><strong>Temperature:</strong> {{ reading.temperature }} °C</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WaterMeterReading',
  data() {
    return {
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
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.custom-card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}
.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.card-body {
  padding: 20px;
}
.card-title {
  margin-bottom: 15px;
  font-size: 1.25rem;
  font-weight: bold;
  color: #007bff;
}
.card-text {
  margin-bottom: 10px;
  font-size: 1rem;
  color: #555;
}
</style>

<template>
  <div class="container mt-5">
    <h1 class="mb-4">BMS Reading</h1>
    <p>This is the BMS reading page.</p>
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4" v-for="(reading, index) in bmsReadings" :key="index">
        <div class="card custom-card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ reading.device }}</h5>
            <p class="card-text"><strong>Temperature:</strong> {{ reading.temperature }} °C</p>
            <p class="card-text"><strong>Humidity:</strong> {{ reading.humidity }} %</p>
            <p class="card-text"><strong>Air Pressure:</strong> {{ reading.pressure }} hPa</p>
            <p class="card-text"><strong>Carbon Footprint:</strong> {{ reading.co2 }} ppm</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BMSReading',
  data() {
    return {
      bmsReadings: [
        {
          device: 'BMS Device 1',
          temperature: 22.5,
          humidity: 45,
          pressure: 1013,
          co2: 400,
        },
        {
          device: 'BMS Device 2',
          temperature: 23.1,
          humidity: 47,
          pressure: 1012,
          co2: 420,
        },
        {
          device: 'BMS Device 3',
          temperature: 21.8,
          humidity: 50,
          pressure: 1011,
          co2: 410,
        },
        {
          device: 'BMS Device 4',
          temperature: 22.0,
          humidity: 46,
          pressure: 1013,
          co2: 405,
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

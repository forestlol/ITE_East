<template>
  <div class="container mt-5">
    <h2>Dashboard Overview</h2>
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Power Meter Reading</h5>
            <p class="card-text">View the power meter readings for your devices.</p>
            <router-link to="/power-meter-reading" class="btn btn-primary">Go to Power Meter</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Water Meter Reading</h5>
            <p class="card-text">View the water meter readings for your devices.</p>
            <router-link to="/water-meter-reading" class="btn btn-primary">Go to Water Meter</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">IAQ Devices Reading</h5>
            <p class="card-text">View the IAQ device readings for your devices.</p>
            <router-link to="/iaq-devices-reading" class="btn btn-primary">Go to IAQ Devices</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">BMS Reading</h5>
            <p class="card-text">View the BMS readings for your devices.</p>
            <router-link to="/bms-reading" class="btn btn-primary">Go to BMS</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverviewPage',
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 8px;
}
.card-body {
  padding: 20px;
}
.card-title {
  margin-bottom: 15px;
  font-size: 1.25rem;
  font-weight: bold;
}
.card-text {
  margin-bottom: 20px;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}
</style>

<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Dashboard Overview</h2>
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4" v-for="(card, index) in cards" :key="index">
        <div class="card custom-card h-100">
          <div class="card-body d-flex flex-column">
            <div class="icon-wrapper mb-3">
              <i :class="card.iconClass"></i>
            </div>
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text" v-if="card.average">Average: {{ card.average }}</p>
            <p class="card-text">{{ card.text }}</p>            
            <div class="mt-auto">
              <router-link :to="card.link" class="btn btn-primary">{{ card.buttonText }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverviewPage',
  data() {
    return {
      cards: [
        {
          title: 'Power Meter Reading',
          text: 'View the power meter readings for your devices.',
          buttonText: 'Go to Power Meter',
          link: '/power-meter-reading',
          iconClass: 'fas fa-bolt',
          average: '100 kWh',
        },
        {
          title: 'Water Meter Reading',
          text: 'View the water meter readings for your devices.',
          buttonText: 'Go to Water Meter',
          link: '/water-meter-reading',
          iconClass: 'fas fa-tint',
          average: '500 L',
        },
        {
          title: 'IAQ Devices Reading',
          text: 'View the IAQ device readings for your devices.',
          buttonText: 'Go to IAQ Devices',
          link: '/iaq-devices-reading',
          iconClass: 'fas fa-wind',
          average: '22.5 °C, 45% Humidity',
        },
        {
          title: 'BMS Reading',
          text: 'View the BMS readings for your devices.',
          buttonText: 'Go to BMS',
          link: '/bms-reading',
          iconClass: 'fas fa-building',
          average: '20.5 °C, 400 ppm CO2',
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
.icon-wrapper {
  font-size: 3rem;
  color: #007bff;
}
.card-title {
  margin-bottom: 15px;
  font-size: 1.5rem;
  font-weight: bold;
}
.card-text {
  margin-bottom: 10px;
  font-size: 1rem;
  color: #555;
  text-align: center;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  transition: background-color 0.3s, border-color 0.3s;
}
.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>

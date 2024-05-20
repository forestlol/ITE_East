<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Dashboard Overview</h2>
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4" v-for="(card, index) in cards" :key="index">
        <div class="card custom-card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ card.title }}</h5>
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
        },
        {
          title: 'Water Meter Reading',
          text: 'View the water meter readings for your devices.',
          buttonText: 'Go to Water Meter',
          link: '/water-meter-reading',
        },
        {
          title: 'IAQ Devices Reading',
          text: 'View the IAQ device readings for your devices.',
          buttonText: 'Go to IAQ Devices',
          link: '/iaq-devices-reading',
        },
        {
          title: 'BMS Reading',
          text: 'View the BMS readings for your devices.',
          buttonText: 'Go to BMS',
          link: '/bms-reading',
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
}
.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.card-title {
  margin-bottom: 15px;
  font-size: 1.5rem;
  font-weight: bold;
}
.card-text {
  margin-bottom: 20px;
  font-size: 1rem;
  color: #555;
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

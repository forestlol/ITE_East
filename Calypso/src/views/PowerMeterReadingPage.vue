<template>
  <div class="container mt-5">
    <h2>Power Meter Reading</h2>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="device in devices" :key="device.id">
        <DeviceCard :device="device" />
      </div>
    </div>
  </div>
</template>

<script>
import DeviceCard from '@/components/DeviceCard.vue';

export default {
  name: 'PowerMeterReadingPage',
  components: {
    DeviceCard,
  },
  data() {
    return {
      devices: [
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
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>

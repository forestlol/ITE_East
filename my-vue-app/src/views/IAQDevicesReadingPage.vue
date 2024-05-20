<template>
  <div class="container mt-5">
    <h2>IAQ Devices Reading</h2>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="device in devices" :key="device.id">
        <IAQDeviceCard :device="device" />
      </div>
    </div>
  </div>
</template>

<script>
import IAQDeviceCard from '@/components/IAQDeviceCard.vue';

export default {
  name: 'IAQDevicesReadingPage',
  components: {
    IAQDeviceCard,
  },
  data() {
    return {
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
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>

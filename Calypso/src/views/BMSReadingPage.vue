<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">BMS Groups Dashboard</h2>
    <input type="text" class="form-control mb-4" placeholder="Search for a group name..." v-model="searchQuery">
    <div v-for="(group, index) in filteredGroups" :key="index">
      <h4>{{ group.title }}</h4>
      <div class="row">
        <div class="col-md-4 mb-4" v-for="(device, index) in group.devices" :key="index">
          <div class="card custom-card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ device.name }}</h5>
              <p class="card-text">
                <span :class="{'badge bg-success': device.connection === 'OK', 'badge bg-danger': device.connection !== 'OK'}">
                  Connection: {{ device.connection }}
                </span>
              </p>
              <p class="card-text">
                <span :class="{'badge bg-success': device.status === 'On', 'badge bg-danger': device.status !== 'On'}">
                  Status: {{ device.status }}
                </span>
              </p>
              <p class="card-text">Value: {{ device.value }}</p>
              <p class="card-text">Date: {{ device.date }}</p>
            </div>
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
      searchQuery: '',
      bmsGroups: [
        {
          title: 'Air Direction Status',
          devices: [
            { name: 'AirDirectionStatus_001', connection: 'OK', status: 'On', value: 3, date: '3/6/2024 2:35:29 pm' },
            { name: 'AirDirectionStatus_000', connection: 'OK', status: 'On', value: 2, date: '3/6/2024 2:35:29 pm' },
            { name: 'AirDirectionStatus_002', connection: 'OK', status: 'On', value: 7, date: '3/6/2024 2:35:29 pm' },
          ],
        },
        {
          title: 'Air Direction Command',
          devices: [
            { name: 'AirDirectionCommand_001', connection: 'OK', status: 'On', value: 3, date: '3/6/2024 2:35:29 pm' },
            { name: 'AirDirectionCommand_000', connection: 'OK', status: 'On', value: 2, date: '3/6/2024 2:35:29 pm' },
            { name: 'AirDirectionCommand_002', connection: 'OK', status: 'On', value: 7, date: '3/6/2024 2:35:29 pm' },
          ],
        },
        {
          title: 'Room Temperature',
          devices: [
            { name: 'RoomTemp_000', connection: 'OK', status: 'On', value: 22, date: '3/6/2024 2:35:29 pm' },
            { name: 'RoomTemp_001', connection: 'OK', status: 'On', value: 23, date: '3/6/2024 2:35:29 pm' },
            { name: 'RoomTemp_002', connection: 'OK', status: 'On', value: 21, date: '3/6/2024 2:35:29 pm' },
          ],
        },
      ],
    };
  },
  computed: {
    filteredGroups() {
      if (!this.searchQuery) {
        return this.bmsGroups;
      }
      return this.bmsGroups.filter(group =>
        group.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
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
}
.custom-card .card-body {
  padding: 15px;
}
.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}
.card-text {
  font-size: 1rem;
}
.badge {
  font-size: 0.9rem;
}
</style>

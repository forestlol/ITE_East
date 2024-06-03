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
                <span :class="{'badge bg-success': device.status === 'On' || device.status === 'Close' || device.status === 'OK', 'badge bg-danger': device.status === 'Off' || device.status === 'Open'}">
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
      bmsGroups: [],
      refreshTimer: null,
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
  mounted() {
    this.fetchDeviceData();
    this.refreshTimer = setInterval(() => {
      this.fetchDeviceData();
    }, 120000); // Refresh data every 2 minutes
  },
  beforeUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  },
  methods: {
    async fetchDeviceData() {
      try {
        const response = await fetch('https://hammerhead-app-kva7n.ondigitalocean.app/Bacnet/api/get/all/latest/data');
        if (!response.ok) throw new Error('Failed to fetch');
        const rawData = await response.text();
        const cleanedData = this.cleanResponse(rawData);
        const parsedData = JSON.parse(cleanedData);
        this.processData(parsedData);
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    },
    cleanResponse(rawData) {
      return rawData
        .replace(/ObjectId\("([^"]+)"\)/g, '"$1"')
        .replace(/ISODate\("([^"]+)"\)/g, '"$1"');
    },
    processData(devices) {
      const latestReadings = {};

      devices.forEach(device => {
        const { Name, dateTime } = device;

        if (!latestReadings[Name] || new Date(dateTime) > new Date(latestReadings[Name].dateTime)) {
          latestReadings[Name] = { ...device };
        }
      });

      const grouped = {};

      Object.values(latestReadings).forEach(device => {
        const { Name, Value, Status, dateTime } = device;
        const groupName = this.getGroupName(Name);

        if (!grouped[groupName]) {
          grouped[groupName] = { title: groupName, devices: [] };
        }

        grouped[groupName].devices.push({
          name: Name,
          connection: 'OK',
          status: Status,
          value: Value,
          date: dateTime,
        });
      });

      // Sort the groups by title and the devices within each group by name
      const sortedGroups = Object.values(grouped).sort((a, b) => a.title.localeCompare(b.title));
      sortedGroups.forEach(group => {
        group.devices.sort((a, b) => a.name.localeCompare(b.name));
      });

      this.bmsGroups = sortedGroups;
    },
    getGroupName(name) {
      if (name.includes('AirDirectionStatus')) return 'Air Direction Status';
      if (name.includes('AirDirectionCommand')) return 'Air Direction Command';
      if (name.includes('RoomTemp')) return 'Room Temperature';
      if (name.includes('TempAdjust')) return 'Temperature Adjustment';
      if (name.includes('AHU')) return 'Air Handling Unit (AHU)';
      if (name.includes('CH')) return 'Chiller Plant';
      if (name.includes('CHWP')) return 'Chilled Water Pump';
      if (name.includes('CT')) return 'Cooling Tower';
      if (name.includes('CWP')) return 'Condensor Water';
      if (name.includes('Water Flow')) return 'Water Flow';
      if (name.includes('Genset')) return 'Genset';
      if (name.includes('Fire Alarm')) return 'Fire Alarm';
      if (name.includes('SPR_PMP')) return 'Sprinkler Pump';
      if (name.includes('Transfer_PMP')) return 'Transfer Pump';
      if (name.includes('WCPU')) return 'Water Cooled Packaged Unit';
      if (name.includes('VRV')) return 'VRV';
      if (name.includes('Smart_FM')) return 'Smart FM Lab';
      if (name.includes('EM_')) return 'Energy Management Lab';
      if (name.includes('ADL_')) return 'Residential Aircon Lab';
      if (name.includes('EDL_')) return 'Electrical Diagnostics Lab';
      if (name.includes('PS_')) return 'Piping Systems Lab';
      if (name.includes('MSL_')) return 'Mechanical Systems Lab';

      return 'Miscellaneous';
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

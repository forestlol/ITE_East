<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Asset Tagging System</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="relation-section">
          <h4 class="text-center mb-4">Sensor Detection</h4>
          <div class="sensor-detection-diagram">
            <img src="@/assets/Asset Tagging Algo.png" alt="Relation View" class="relation-image">
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="out-of-range-section">
          <h4 class="text-center mb-4">Out of Range</h4>
          <ul class="out-of-range-list">
            <li v-for="tag in outOfRangeTags" :key="tag.id" class="out-of-range-item">
              <span class="tag-name">{{ tag.name }}</span> - 
              <span class="tag-updated">{{ tag.lastUpdated }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row mt-4 justify-content-center">
      <div class="col-md-3" v-for="device in devices" :key="device.id">
        <div class="device-status-card">
          <h5>{{ device.name }}</h5>
          <p class="status" :class="{ 'text-success': device.isOnline, 'text-danger': !device.isOnline }">
            {{ device.isOnline ? 'Online' : 'Offline' }}
          </p>
          <p>Type: {{ device.type }}</p>
          <p>Last Updated: {{ device.lastUpdated }}</p>
        </div>
      </div>
    </div>
    <div class="condition mt-4 text-center">
      <p>If BLE Beacon 1 and Beacon 2 are on, BLE Tags are able to detect within range.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssetTaggingSystem',
  data() {
    return {
      devices: [
        { id: 1, name: 'BLE Beacon 1', type: 'Asset Tag', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 4, name: 'BLE Beacon 2', type: 'Temperature Tag', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        { id: 5, name: 'BLE Tags', type: 'Humidity Tag', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
      ],
      outOfRangeTags: [
        { id: 6, name: 'BLE Tag 3', type: 'Humidity Tag', lastUpdated: '2024-05-29 14:30:00' },
        { id: 7, name: 'BLE Tag 4', type: 'Temperature Tag', lastUpdated: '2024-05-29 14:30:00' },
      ]
    };
  }
};
</script>

<style scoped>
.container-fluid {
  width: 100%;
  padding: 2rem;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
}

.relation-section,
.out-of-range-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 100%;
}

.sensor-detection-diagram {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  overflow: hidden;
}

.relation-image {
  max-width: 100%;
  max-height: 100%;
}

.out-of-range-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.out-of-range-item {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.tag-name {
  font-weight: bold;
}

.device-status-card {
  background-color: #e9f7fd;
  padding: 15px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.device-status-card h5 {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.device-status-card .status {
  font-size: 1.5rem;
  font-weight: bold;
}

.condition p {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>

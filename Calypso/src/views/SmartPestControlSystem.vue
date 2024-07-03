<template>
    <div class="container mt-5">
      <h2 class="text-center mb-4">Smart Pest Control System</h2>
      <div class="row">
        <div class="col-md-12">
          <div class="view-switcher">
            <button @click="toggleView('relation')" :class="{ active: currentView === 'relation' }">Relation</button>
            <button @click="toggleView('floorplan')" :class="{ active: currentView === 'floorplan' }">Floorplan</button>
            <button @click="toggleView('devices')" :class="{ active: currentView === 'devices' }">Devices</button>
          </div>
          <div class="view-container" v-if="currentView === 'relation'">
            <div class="map-container">
              <img src="@/assets/ITE_EAST_FLOORPLAN.jpg" alt="Relation View" class="map-image">
            </div>
            <div class="map-container">
              <img src="@/assets/ITE_EAST_FLOORPLAN.jpg" alt="Relation View" class="map-image">
            </div>
            <div class="link-button">
              <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
            </div>
          </div>
          <div class="view-container" v-if="currentView === 'floorplan'">
            <div class="map-container">
              <img src="@/assets/ITE_EAST_FLOORPLAN.jpg" alt="Floorplan View" class="map-image">
            </div>
            <div class="link-button">
              <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
            </div>
          </div>
          <div class="view-container" v-if="currentView === 'devices'">
            <div class="device-category" v-for="(devices, category) in groupedDevices" :key="category">
              <h4 class="category-title">{{ category }}</h4>
              <div class="device-grid">
                <div v-for="device in devices" :key="device.id" class="device-item">
                  <h5>{{ device.name }}</h5>
                  <p>Status: <span :class="{ 'text-success': device.isOnline, 'text-danger': !device.isOnline }">{{ device.isOnline ? 'Online' : 'Offline' }}</span></p>
                  <p>Type: {{ device.type }}</p>
                  <p>Last Updated: {{ device.lastUpdated }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SmartPestControlSystem',
    data() {
      return {
        currentView: 'relation',
        devices: [
          { id: 1, name: 'Rodent Trap Sensor 1', type: 'Rodent Trap Sensor', typeClass: 'rodent-trap', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 2, name: 'Rodent Trap Sensor 2', type: 'Rodent Trap Sensor', typeClass: 'rodent-trap', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 3, name: 'Insect Trap Sensor 1', type: 'Insect Trap Sensor', typeClass: 'insect-trap', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 4, name: 'Insect Trap Sensor 2', type: 'Insect Trap Sensor', typeClass: 'insect-trap', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 5, name: 'Insect Trap Sensor 3', type: 'Insect Trap Sensor', typeClass: 'insect-trap', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 6, name: 'Insect Trap Sensor 4', type: 'Insect Trap Sensor', typeClass: 'insect-trap', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 7, name: 'Bait Station Sensor 1', type: 'Bait Station Sensor', typeClass: 'bait-station', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 8, name: 'Bait Station Sensor 2', type: 'Bait Station Sensor', typeClass: 'bait-station', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 9, name: 'Bait Station Sensor 3', type: 'Bait Station Sensor', typeClass: 'bait-station', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 10, name: 'Bait Station Sensor 4', type: 'Bait Station Sensor', typeClass: 'bait-station', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
          { id: 11, name: 'Gateway 1', type: 'LoRaWAN Gateway', typeClass: 'gateway', isOnline: true, lastUpdated: '2024-05-29 14:30:00' },
        ],
      };
    },
    computed: {
      groupedDevices() {
        return this.devices.reduce((acc, device) => {
          const category = device.type + 's';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(device);
          return acc;
        }, {});
      },
    },
    methods: {
      toggleView(view) {
        this.currentView = view;
      },
      navigateTo3DLandscape() {
        window.location.href = 'https://your-3d-landscape-url.com';
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .device-category {
    margin-bottom: 20px;
  }
  
  .category-title {
    font-size: 1.25rem;
    font-weight: bold;
    padding-left: 15px;
  }
  
  .device-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .device-item {
    border: 1px solid lightgrey;
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .device-item h5 {
    margin-bottom: 10px;
    font-size: 1.25rem;
    font-weight: bold;
    color: #007bff;
  }
  
  .view-switcher {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .view-switcher button {
    background-color: #f8f9fa;
    border: none;
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .view-switcher button.active {
    background-color: #007bff;
    color: white;
  }
  
  .view-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
  }
  
  .map-container {
    border: 1px solid lightgrey;
    width: 100%;
    margin-bottom: 20px;
  }
  
  .map-image {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  
  .device-status {
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid black;
  }
  
  .rodent-trap {
    background-color: red;
    border: 1px solid black;
  }
  
  .insect-trap {
    background-color: #92d050;
    border: 1px solid black;
  }
  
  .bait-station {
    background-color: #ffd966;
    width: 15px;
    height: 15px;
    border: 1px solid black;
  }
  
  .gateway {
    background-color: #4472c4;
    width: 21px;
    height: 15px;
    border-radius: 0;
    border: 1px solid black;
  }
  
  .text-danger {
    color: #dc3545 !important;
  }
  
  .text-success {
    color: #28a745 !important;
  }
  
  .link-button {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 10px;
  }
  </style>
  
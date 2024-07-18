<template>
    <div class="container-fluid mt-5">
      <h2 class="text-center mb-4">Alarms & Notifications</h2>
      <div class="alarm-notification-list">
        <div v-for="(feed, index) in feedData" :key="index" class="feed-item">
          <p>{{ feed.message }}</p>
          <small>{{ feed.time }}</small>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AlarmsNotificationsPage',
    data() {
      return {
        feedData: [
          { message: 'Fire Alarm SAP-2 is offline.', time: '2024-06-22 14:30:00' },
          { message: 'AHU-1 temperature record high: 28°C.', time: '2024-06-22 13:45:00' },
          { message: 'IAQ Device 1 CO2 level high: 800 ppm.', time: '2024-06-22 12:00:00' },
          { message: 'Water Meter 1 usage high: 500 L.', time: '2024-06-22 11:15:00' },
          { message: 'Power Meter 2 voltage low: 210V.', time: '2024-06-22 10:30:00' },
          // Add more notifications as needed
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .container-fluid {
    max-width: 1200px;
    min-height: 100vh; /* Ensures the container covers the full viewport height */
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .section-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  .alarm-notification-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 10px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .alarm-notification-list::-webkit-scrollbar {
    width: 8px;
  }
  .alarm-notification-list::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 5px;
  }
  .alarm-notification-list::-webkit-scrollbar-thumb {
    background-color: lightgrey;
    border-radius: 5px;
    border: 2px solid #f8f9fa;
  }
  .feed-item {
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .feed-item:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  .feed-item p {
    margin-bottom: 5px;
    font-size: 1rem;
    color: #333;
  }
  .feed-item small {
    font-size: 0.875rem;
    color: #777;
  }
  </style>
  
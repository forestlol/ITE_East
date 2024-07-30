<template>
    <div class="additional-card quick-links">
      <h4>Fault Call / Ticket</h4>
      <router-link to="/quick-links" class="view-all-link">View All</router-link>
      <div class="links-content">
        <div class="column-titles">
          <span class="column-title">ID</span>
          <span class="column-title">Description</span>
          <span class="column-title">Status</span>
        </div>
        <div
          v-for="(link, index) in quickLinks"
          :key="index"
          :class="['quick-link-item', link.status]"
        >
          <span class="column">{{ link.id }}</span>
          <span class="column">{{ link.description }}</span>
          <span class="column">{{ link.statusText }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FaultCallTicket',
    data() {
      return {
        quickLinks: this.generateFakeData(30), // Generate 30 items for demonstration
      };
    },
    methods: {
      generateFakeData(count) {
        const statuses = [
          { status: 'clear', statusText: '[Clear]' },
          { status: 'leakage', statusText: '[Leakage]' },
          { status: 'issue', statusText: '[Issue]' },
          { status: 'critical', statusText: '[Critical]' },
        ];
        const descriptions = [
          'Asset Missing',
          'Toilet Leakage',
          'Aircon Dusty',
          'Water Leakage',
          'Lights Not Working',
          'Elevator Malfunction',
          'Door Jammed',
          'Window Broken',
        ];
        
        const data = [];
        for (let i = 1; i <= count; i++) {
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
          data.push({
            id: `#${String(i).padStart(4, '0')}`,
            description: randomDescription,
            status: randomStatus.status,
            statusText: randomStatus.statusText,
          });
        }
        return data;
      },
    },
  };
  </script>
  
  <style scoped>
  .additional-card.quick-links {
    flex: 1;
    background: white;
    color: black;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid #d3d3d3; /* Updated border color */
  }
  
  .links-content {
    display: flex;
    flex-direction: column;
    gap: 10px; /* Adjust the gap between buttons as needed */
    margin-top: 10px; /* Add margin to separate the title and content */
    width: 100%; /* Ensure it fills the available width */
    overflow-y: auto; /* Enable vertical scrolling if content overflows */
    max-height: calc(100vh - 150px); /* Adjust based on available space */
  }
  
  .column-titles {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-weight: bold;
  }
  
  .column-title {
    flex: 1;
    text-align: center;
  }
  
  .quick-link-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%; /* Ensure it fills the available width */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
    text-align: center; /* Align text to the center */
    font-size: 14px; /* Smaller font size */
  }
  
  .quick-link-item .column {
    flex: 1;
  }
  
  .quick-link-item.clear {
    background-color: #90ee90; /* Green background for clear status */
    color: black;
  }
  
  .quick-link-item.leakage {
    background-color: #ff4c4c; /* Red background for leakage status */
    color: yellow;
  }
  
  .quick-link-item.issue {
    background-color: #ffcc00; /* Yellow background for issue status */
    color: black;
  }
  
  .quick-link-item.critical {
    background-color: #ff0000; /* Bright red background for critical status */
    color: white;
  }
  
  .view-all-link {
    position: absolute;
    top: 25px;
    right: 20px;
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
  }
  
  .view-all-link:hover {
    color: #0056b3;
  }
  </style>
  
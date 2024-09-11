<template>
  <div class="overview-container">

    <!-- Title and Announcement Bar -->
    <div class="container-fluid title-bar">
      <div class="row align-items-center">
        <div class="col-6">
          <h1 class="title">INTEGRATED OPERATION CENTRE</h1>
        </div>
        <div class="col-6 text-end">
          <div class="announcement-bar">
            Announcement Message Bar
          </div>
        </div>
      </div>
    </div>


    <!-- Map Hierarchy Moved to the Top -->
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="map-hierarchy">
            <h3>Map of Area or Sub-System Hierarchy Selection</h3>
            <div class="map-content">
              <div class="image-container">
                <img src="@/assets/V3/B05V3.png" alt="ITE East Floor Plan" class="img-fluid w-100">

                <!-- Manually Positioned Boxes on Top of the Image -->
                <div class="box" id="box1" @click="goToPageBox('box1')">Box 1</div>
                <div class="box" id="box2" @click="goToPageBox('box2')">Box 2</div>
                <div class="box" id="box3" @click="goToPageBox('box3')">Box 3</div>
                <div class="box" id="box4" @click="goToPageBox('box4')">Box 4</div>
                <div class="box" id="box5" @click="goToPageBox('box5')">Box 5</div>
                <div class="box" id="box6" @click="goToPageBox('box6')">Box 6</div>
                <div class="box" id="box7" @click="goToPageBox('box7')">Box 7</div>
                <div class="box" id="box8" @click="goToPageBox('box8')">Box 8</div>
                <div class="box" id="box9" @click="goToPageBox('box9')">Box 9</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="summary-be">
      <h3>System Healthcheck</h3>
      <div class="summary-content">
        <div class="progress-bars">
          <div v-for="(progress, index) in progressData" :key="index" class="progress-bar-container">
            <CircularProgressBar :percentage="progress.value" :label="progress.label" />
          </div>
        </div>
      </div>
    </div> -->

    <!-- Sub-System Cards Container with Background -->
    <div class="subsystems-container">
      <button class="scroll-button left" @click="scrollLeft">&lt;</button>
      <div class="subsystems-content">
        <div v-for="(subsystem, index) in displayedSubsystems" :key="index" class="subsystem-card">
          <div class="subsystem-header">
            <span class="subsystem-title">{{ subsystem.name }}</span>
            <span class="subsystem-info"><i class="fas fa-smile status-icon"></i></span>
          </div>
        <button class="go-button" @click="goToPage(subsystem.link)">Go</button>
      </div>
    </div>
    <button class="scroll-button right" @click="scrollRight">&gt;</button>

    <!-- Page Indicators Positioned at the Bottom -->
    <div class="page-indicators">
      <span v-for="page in totalPages" :key="page" :class="{ 'active': page === currentPage + 1 }">•</span>
    </div>
  </div>

  <div class="additional-cards">
    <div class="additional-card auto-scroll-feed">
      <h4>Alarm & Notification</h4>
      <router-link to="/alarms-notifications" class="view-all-link">View All</router-link>
      <div class="feed-wrapper">
        <div class="feed-content">
          <div v-for="(feed, index) in feedData" :key="index" class="feed-item">
            <p>{{ feed.message }}</p>
            <small>{{ feed.time }}</small>
          </div>
        </div>
      </div>
    </div>
    <div class="additional-card quick-links">
      <h4>Fault Call / Ticket</h4>
      <router-link to="/quick-links" class="view-all-link">View All</router-link>
      <div class="links-content">
        <!-- Table Headers -->
        <div class="fault-row fault-header">
          <span class="fault-column">ID</span>
          <span class="fault-column">Description</span>
          <span class="fault-column">Status</span>
        </div>
        <!-- Iterate over the faults and render each one -->
        <div v-for="(fault, index) in faults" :key="index" :class="['fault-row', getFaultClass(fault.latest_status)]">
          <span class="fault-column">{{ fault.fault_number }}</span>
          <span class="fault-column">{{ fault.trade_name }}</span>
          <span class="fault-column">{{ fault.latest_status ? fault.latest_status : 'Pending' }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Dialog -->
  <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2>{{ selectedTitle }}</h2>
      <span class="modal-close" @click="closeModal">&times;</span>
      <p>This is your modal content.</p>
      <!-- <img src="path-to-your-image.png" alt="Map" style="width: 100%; height: auto;"> -->
    </div>
  </div>

  </div>
</template>

<script>
// import SemiCircleProgressBar from '@/components/SemiCircleProgressBar.vue';
// import CircularProgressBar from '@/components/CircularProgressBar.vue';

export default {
  name: 'OverviewPage',
  components: {
    // SemiCircleProgressBar,
    // CircularProgressBar,
  },
  data() {
    return {
      isModalVisible: false, // Controls modal visibility
      selectedTitle: '',     // Holds the title of the clicked room
      selectedArea: null,
      currentPage: 0, // Index for the current page of sub-systems
      currentFireAlarmIndex: 0,
      currentIAQDeviceIndex: 0,
      currentPowerMeterIndex: 0,
      currentWaterMeterIndex: 0,
      currentSmartLandscapeIndex: 0,
      currentSmartToiletIndex: 0,
      currentBMSIndex: 0,
      currentSmartPestControlIndex: 0,
      currentSmartSecurityIndex: 0,
      currentSmartLightingIndex: 0,
      currentHybridAirIndex: 0,
      faults: [], // Store fault data
      progressData: [
        { label: 'Air Quality', value: 100 },
        { label: 'Device Operational', value: 100 },
      ],
      subsystemData: [
        { name: 'FAS', type: 'semi-circle', operational: 100, link: '/fire-alarm-system' },
        { name: 'SMS', type: 'semi-circle', operational: 100, link: '/smart-landscape-system' },
        { name: 'BMS', type: 'semi-circle', operational: 100, link: '/bms-reading' },
        { name: 'SWS', type: 'semi-circle', operational: 100, link: '/smart-toilet-system' },
        { name: 'SEMS', type: 'semi-circle', operational: 100, link: '/power-meter-reading' },
        { name: 'SPCS', type: 'semi-circle', operational: 100, link: '/smart-pest-control-system' },
        { name: 'ATS', type: 'semi-circle', operational: 100, link: '/asset-tagging-system' },
        { name: 'SLS', type: 'semi-circle', operational: 100, link: '/smart-lighting-system' },
        { name: 'HAS', type: 'semi-circle', operational: 100, link: '/hybrid-aircon' },
      ],
      fireAlarms: [
        { name: 'Fire Alarm System Overview', operational: 100 },
        { name: 'SAP-1', status: 'Online', lastUpdated: '2024-05-29 14:30:00' },
        { name: 'SAP-2', status: 'Offline', lastUpdated: '2024-05-29 14:20:00' },
        { name: 'SAP-3', status: 'Online', lastUpdated: '2024-05-29 14:25:00' },
        { name: 'SAP-4', status: 'Online', lastUpdated: '2024-05-29 14:15:00' },
        { name: 'SAP-5', status: 'Online', lastUpdated: '2024-05-29 14:35:00' },
        { name: 'SAP-6', status: 'Online', lastUpdated: '2024-05-29 14:10:00' },
      ],
      iaqDevices: [
        { name: 'Smart Air Quality System Overview', operational: 100 },
        { name: 'Device 1', status: 'Online', avgTemp: 23.0, avgHumidity: 65.0, avgPressure: 1009.0, avgCO2: 440.0 },
        { name: 'Device 2', status: 'Online', avgTemp: 24.0, avgHumidity: 64.0, avgPressure: 1008.0, avgCO2: 450.0 },
      ],
      powerMeters: [
        { name: 'Smart Energy Management System Overview', operational: 100 },
        { name: 'Power Meter 1', status: 'Online', avgKwh: 59.13, totalKwh: 531.67 },
        { name: 'Power Meter 2', status: 'Online', avgKwh: 60.00, totalKwh: 600.00 },
      ],
      waterMeters: [
        { name: 'Asset Tagging System Overview', operational: 100 },
        { name: 'Water Meter 1', status: 'Online', avgFlowRate: 12.18, avgUsage: 420.0, avgPressure: 100.5, avgTemperature: 20.32 },
        { name: 'Water Meter 2', status: 'Online', avgFlowRate: 13.00, avgUsage: 430.0, avgPressure: 101.0, avgTemperature: 21.00 },
      ],
      smartLandscape: [
        { name: 'Smart Landscape Overview', operational: 100 },
        { name: 'Landscape-1', status: 'Online', lastUpdated: '2024-05-29 14:30:00' },
        { name: 'Landscape-2', status: 'Offline', lastUpdated: '2024-05-29 14:20:00' },
        { name: 'Landscape-3', status: 'Online', lastUpdated: '2024-05-29 14:25:00' },
        { name: 'Landscape-4', status: 'Online', lastUpdated: '2024-05-29 14:15:00' },
      ],
      smartToilet: [
        { name: 'Smart Washroom System Overview', operational: 100 },
        { name: 'Toilet-1', status: 'Online', lastUpdated: '2024-05-29 14:30:00' },
        { name: 'Toilet-2', status: 'Offline', lastUpdated: '2024-05-29 14:20:00' },
        { name: 'Toilet-3', status: 'Online', lastUpdated: '2024-05-29 14:25:00' },
        { name: 'Toilet-4', status: 'Online', lastUpdated: '2024-05-29 14:15:00' },
      ],
      bms: [
        { name: 'Building Management System (JCS) Overview', operational: 100 },
        { name: 'BMS-1', connection: 'OK', value: '27.03 °C', date: '06/23/2024 5:06:39 PM' },
        { name: 'BMS-2', connection: 'N/A', value: 'N/A', date: '06/23/2024 5:06:39 PM' },
        { name: 'BMS-3', connection: 'OK', value: '27.77 °C', date: '06/23/2024 5:06:39 PM' },
      ],
      smartPestControl: [
        { name: 'Smart Pest Control System Overview', operational: 100 },
        { name: 'Pest-1', status: 'Online', lastUpdated: '2024-05-29 14:30:00' },
        { name: 'Pest-2', status: 'Offline', lastUpdated: '2024-05-29 14:20:00' },
        { name: 'Pest-3', status: 'Online', lastUpdated: '2024-05-29 14:25:00' },
        { name: 'Pest-4', status: 'Online', lastUpdated: '2024-05-29 14:15:00' },
        { name: 'Pest-5', status: 'Online', lastUpdated: '2024-05-29 14:35:00' },
        { name: 'Pest-6', status: 'Online', lastUpdated: '2024-05-29 14:10:00' },
      ],
      smartSecurity: [
        { name: 'Smart Security System Overview', operational: 100 },
        { name: 'Security-1', status: 'Online', lastUpdated: '2024-05-29 14:30:00' },
        { name: 'Security-2', status: 'Offline', lastUpdated: '2024-05-29 14:20:00' },
        { name: 'Security-3', status: 'Online', lastUpdated: '2024-05-29 14:25:00' },
        { name: 'Security-4', status: 'Online', lastUpdated: '2024-05-29 14:15:00' },
        { name: 'Security-5', status: 'Online', lastUpdated: '2024-05-29 14:35:00' },
        { name: 'Security-6', status: 'Online', lastUpdated: '2024-05-29 14:10:00' },
      ],
      smartLighting: [
        { name: 'Smart Lighting System Overview', operational: 100 },
        { name: 'Lighting-1', status: 'Online', lastUpdated: '2024-05-29 14:30:00' },
        { name: 'Lighting-2', status: 'Offline', lastUpdated: '2024-05-29 14:20:00' },
        { name: 'Lighting-3', status: 'Online', lastUpdated: '2024-05-29 14:25:00' },
        { name: 'Lighting-4', status: 'Online', lastUpdated: '2024-05-29 14:15:00' },
      ],
      hybridAir: [
        { name: 'Hybrid Air System Overview', operational: 100 },
        { name: 'Air-1', status: 'Online', lastUpdated: '2024-05-29 14:30:00' },
        { name: 'Air-2', status: 'Offline', lastUpdated: '2024-05-29 14:20:00' },
        { name: 'Air-3', status: 'Online', lastUpdated: '2024-05-29 14:25:00' },
        { name: 'Air-4', status: 'Online', lastUpdated: '2024-05-29 14:15:00' },
      ],
      feedData: [
        { message: 'Fire Alarm SAP-2 is offline.', time: '2024-06-22 14:30:00' },
        { message: 'AHU-1 temperature record high: 28°C.', time: '2024-06-22 13:45:00' },
        { message: 'IAQ Device 1 CO2 level high: 800 ppm.', time: '2024-06-22 12:00:00' },
        { message: 'Water Meter 1 usage high: 500 L.', time: '2024-06-22 11:15:00' },
        { message: 'Power Meter 2 voltage low: 210V.', time: '2024-06-22 10:30:00' },
      ],
      quickLinks: [
        { label: '#0010 – Asset Missing [Clear]', status: 'clear' },
        { label: '#0012 – Toilet Leakage', status: 'leakage' },
        { label: '#0013 – Aircon Dusty [Clear]', status: 'clear' }
      ],
    };
  },
  computed: {
    displayedSubsystems() {
      // Display 4 subsystems per page
      const start = this.currentPage * 8;
      return this.subsystemData.slice(start, start + 8);
    },
    totalPages() {
      return Math.ceil(this.subsystemData.length / 8);
    }
  },
  methods: {
    goToPageBox(box) {
      switch (box) {
        case 'box1':
          this.$router.push('/smart-toilet-system');
          break;
        case 'box6':
          this.$router.push('/smart-landscape-system');
          break;
        default:
          console.log('No action for this box.');
          break;
      }
    },
    goToPage(link) {
      this.$router.push(link);
    },
    showModal(title) {
      this.selectedTitle = title;
      this.isModalVisible = true;
    },
    // Function to close the modal
    closeModal() {
      this.isModalVisible = false;
    },
    scrollLeft() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    scrollRight() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++;
      }
    },
    prevItem(subsystemName) {
      switch (subsystemName) {
        case 'Fire Alarm System Overview':
          if (this.currentFireAlarmIndex > 0) {
            this.currentFireAlarmIndex--;
          }
          break;
        case 'Smart Air Quality System Overview':
          if (this.currentIAQDeviceIndex > 0) {
            this.currentIAQDeviceIndex--;
          }
          break;
        case 'Smart Energy Management System Overview':
          if (this.currentPowerMeterIndex > 0) {
            this.currentPowerMeterIndex--;
          }
          break;
        case 'Asset Tagging System Overview':
          if (this.currentWaterMeterIndex > 0) {
            this.currentWaterMeterIndex--;
          }
          break;
        case 'Smart Landscape Overview':
          if (this.currentSmartLandscapeIndex > 0) {
            this.currentSmartLandscapeIndex--;
          }
          break;
        case 'Smart Washroom System Overview':
          if (this.currentSmartToiletIndex > 0) {
            this.currentSmartToiletIndex--;
          }
          break;
        case 'Building Management System (JCS) Overview':
          if (this.currentBMSIndex > 0) {
            this.currentBMSIndex--;
          }
          break;
        case 'Smart Pest Control System Overview':
          if (this.currentSmartPestControlIndex > 0) {
            this.currentSmartPestControlIndex--;
          }
          break;
        case 'Smart Security System Overview':
          if (this.currentSmartSecurityIndex > 0) {
            this.currentSmartSecurityIndex--;
          }
          break;
        case 'Smart Lighting System Overview':
          if (this.currentSmartLightingIndex > 0) {
            this.currentSmartLightingIndex--;
          }
          break;
        case 'Hybrid Air System Overview':
          if (this.currentHybridAirIndex > 0) {
            this.currentHybridAirIndex--;
          }
          break;
      }
    },
    nextItem(subsystemName) {
      switch (subsystemName) {
        case 'Fire Alarm System Overview':
          if (this.currentFireAlarmIndex < this.fireAlarms.length - 1) {
            this.currentFireAlarmIndex++;
          }
          break;
        case 'Smart Air Quality System Overview':
          if (this.currentIAQDeviceIndex < this.iaqDevices.length - 1) {
            this.currentIAQDeviceIndex++;
          }
          break;
        case 'Smart Energy Management System Overview':
          if (this.currentPowerMeterIndex < this.powerMeters.length - 1) {
            this.currentPowerMeterIndex++;
          }
          break;
        case 'Asset Tagging System Overview':
          if (this.currentWaterMeterIndex < this.waterMeters.length - 1) {
            this.currentWaterMeterIndex++;
          }
          break;
        case 'Smart Landscape Overview':
          if (this.currentSmartLandscapeIndex < this.smartLandscape.length - 1) {
            this.currentSmartLandscapeIndex++;
          }
          break;
        case 'Smart Washroom System Overview':
          if (this.currentSmartToiletIndex < this.smartToilet.length - 1) {
            this.currentSmartToiletIndex++;
          }
          break;
        case 'Building Management System (JCS) Overview':
          if (this.currentBMSIndex < this.bms.length - 1) {
            this.currentBMSIndex++;
          }
          break;
        case 'Smart Pest Control System Overview':
          if (this.currentSmartPestControlIndex < this.smartPestControl.length - 1) {
            this.currentSmartPestControlIndex++;
          }
          break;
        case 'Smart Security System Overview':
          if (this.currentSmartSecurityIndex < this.smartSecurity.length - 1) {
            this.currentSmartSecurityIndex++;
          }
          break;
        case 'Smart Lighting System Overview':
          if (this.currentSmartLightingIndex < this.smartLighting.length - 1) {
            this.currentSmartLightingIndex++;
          }
          break;
        case 'Hybrid Air System Overview':
          if (this.currentHybridAirIndex < this.hybridAir.length - 1) {
            this.currentHybridAirIndex++;
          }
          break;
      }
    },
    canPrevItem(subsystemName) {
      switch (subsystemName) {
        case 'Fire Alarm System Overview':
          return this.currentFireAlarmIndex > 0;
        case 'Smart Air Quality System Overview':
          return this.currentIAQDeviceIndex > 0;
        case 'Smart Energy Management System Overview':
          return this.currentPowerMeterIndex > 0;
        case 'Asset Tagging System Overview':
          return this.currentWaterMeterIndex > 0;
        case 'Smart Landscape Overview':
          return this.currentSmartLandscapeIndex > 0;
        case 'Smart Washroom System Overview':
          return this.currentSmartToiletIndex > 0;
        case 'Building Management System (JCS) Overview':
          return this.currentBMSIndex > 0;
        case 'Smart Pest Control System Overview':
          return this.currentSmartPestControlIndex > 0;
        case 'Smart Security System Overview':
          return this.currentSmartSecurityIndex > 0;
        case 'Smart Lighting System Overview':
          return this.currentSmartLightingIndex > 0;
        case 'Hybrid Air System Overview':
          return this.currentHybridAirIndex > 0;
        default:
          return false;
      }
    },
    canNextItem(subsystemName) {
      switch (subsystemName) {
        case 'Fire Alarm System Overview':
          return this.currentFireAlarmIndex < this.fireAlarms.length - 1;
        case 'Smart Air Quality System Overview':
          return this.currentIAQDeviceIndex < this.iaqDevices.length - 1;
        case 'Smart Energy Management System Overview':
          return this.currentPowerMeterIndex < this.powerMeters.length - 1;
        case 'Asset Tagging System Overview':
          return this.currentWaterMeterIndex < this.waterMeters.length - 1;
        case 'Smart Landscape Overview':
          return this.currentSmartLandscapeIndex < this.smartLandscape.length - 1;
        case 'Smart Washroom System Overview':
          return this.currentSmartToiletIndex < this.smartToilet.length - 1;
        case 'Building Management System (JCS) Overview':
          return this.currentBMSIndex < this.bms.length - 1;
        case 'Smart Pest Control System Overview':
          return this.currentSmartPestControlIndex < this.smartPestControl.length - 1;
        case 'Smart Security System Overview':
          return this.currentSmartSecurityIndex < this.smartSecurity.length - 1;
        case 'Smart Lighting System Overview':
          return this.currentSmartLightingIndex < this.smartLighting.length - 1;
        case 'Hybrid Air System Overview':
          return this.currentHybridAirIndex < this.hybridAir.length - 1;
        default:
          return false;
      }
    },
    getCurrentIndex(subsystemName) {
      switch (subsystemName) {
        case 'Fire Alarm System Overview':
          return this.currentFireAlarmIndex;
        case 'Smart Air Quality System Overview':
          return this.currentIAQDeviceIndex;
        case 'Smart Energy Management System Overview':
          return this.currentPowerMeterIndex;
        case 'Asset Tagging System Overview':
          return this.currentWaterMeterIndex;
        case 'Smart Landscape Overview':
          return this.currentSmartLandscapeIndex;
        case 'Smart Washroom System Overview':
          return this.currentSmartToiletIndex;
        case 'Building Management System (JCS) Overview':
          return this.currentBMSIndex;
        case 'Smart Pest Control System Overview':
          return this.currentSmartPestControlIndex;
        case 'Smart Security System Overview':
          return this.currentSmartSecurityIndex;
        case 'Smart Lighting System Overview':
          return this.currentSmartLightingIndex;
        case 'Hybrid Air System Overview':
          return this.currentHybridAirIndex;
        default:
          return 0;
      }
    },
    getTotalPages(subsystemName) {
      switch (subsystemName) {
        case 'Fire Alarm System Overview':
          return this.fireAlarms.length;
        case 'Smart Air Quality System Overview':
          return this.iaqDevices.length;
        case 'Smart Energy Management System Overview':
          return this.powerMeters.length;
        case 'Asset Tagging System Overview':
          return this.waterMeters.length;
        case 'Smart Landscape Overview':
          return this.smartLandscape.length;
        case 'Smart Washroom System Overview':
          return this.smartToilet.length;
        case 'Building Management System (JCS) Overview':
          return this.bms.length;
        case 'Smart Pest Control System Overview':
          return this.smartPestControl.length;
        case 'Smart Security System Overview':
          return this.smartSecurity.length;
        case 'Smart Lighting System Overview':
          return this.smartLighting.length;
        case 'Hybrid Air System Overview':
          return this.hybridAir.length;
        default:
          return 1;
      }
    },
    async fetchFaults() {
      try {
        const response = await fetch('https://octopus-app-afr3m.ondigitalocean.app/api/Faults');
        const data = await response.json();
        console.log('Fetched Faults Data:', data); // Check fetched data
        this.faults = data.slice(0, 5); // Only take the first 5 items
      } catch (error) {
        console.error('Error fetching faults:', error);
      }
    },
    getFaultClass(status) {
      console.log(status);
      if (status === 'work_completed') {
        return 'work_completed'; // Green background
      } else if (status === 'site_reached') {
        return 'site_reached'; // Yellow background
      } else {
        return 'pending'; // Red background
      }
    },
  },
  created() {
    this.fetchFaults(); // Fetch fault data when the component is created
  },
};
</script>

<style scoped>
/* CSS code remains the same */
.additional-card.quick-links {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #d3d3d3;
  /* Updated border color */
}

.links-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* Adjust the gap between buttons as needed */
  margin-top: 10px;
  /* Add margin to separate the title and content */
  width: 100%;
  /* Ensure it fills the available width */
}

.quick-link-item {
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
}

/* Completed status - green background */
.quick-link-item.completed {
  background-color: #90ee90;
  /* Light green */
  color: black;
}

/* Pending status - orange background */
.quick-link-item.pending {
  background-color: #ff9900;
  /* Orange */
  color: white;
}


.quick-link-item.clear {
  background-color: #90ee90;
  /* Green background for clear status */
  color: black;
}

.quick-link-item.leakage {
  background-color: #ff4c4c;
  /* Red background for leakage status */
  color: yellow;
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

.summary-be {
  grid-area: summary-be;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #d3d3d3;
  /* Updated border color */
}

.progress-bars {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.progress-bar-container {
  flex: 1;
  min-width: 100px;
}

.map-hierarchy {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border: 2px solid #d3d3d3;
  /* Make sure it takes up full width */
  width: 100%;
}

.additional-cards {
  display: flex;
  justify-content: space-between;
  padding-top: 1%;
  gap: 20px;
  /* Responsive behavior */
}


.additional-card {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #d3d3d3;
  /* Updated border color */
}

.additional-card.auto-scroll-feed {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Ensures content stays within the card */
  flex: 1;
  /* Takes up remaining space */
  width: 100%;
  /* Ensure it fills the available width */
}

.feed-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
  /* Ensures content stays within the card */
  margin-top: 10px;
  /* Add margin to separate the title and content */
  width: 100%;
  /* Ensure it fills the available width */
}

.feed-content {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  animation: scroll 20s linear infinite;
  width: 100%;
  /* Ensure it fills the available width */
}

.feed-item {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  /* Ensure it fills the available width */
  box-sizing: border-box;
  /* Include padding and border in the element's total width and height */
}

@keyframes scroll {
  0% {
    transform: translateY(0%);
  }

  100% {
    transform: translateY(calc(-100% - 10px));
    /* Adjust this value to ensure correct scrolling distance */
  }
}

.quick-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.quick-link-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.quick-link-button:last-child {
  margin-bottom: 0;
}

.summary-subsystems {
  grid-area: summary-subsystems;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #d3d3d3;
  /* Updated border color */
  position: relative;
  /* Make the parent div the positioning context */
}

.map-content img {
  width: 100%;
  /* Ensures the image scales responsively */
  height: auto;
}

.summary-content,
.map-content,
.subsystems-content {
  display: flex;
  flex-direction: column;
}

.subsystems-container {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #d3d3d3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-top: 3%;
  padding-bottom: 3%;
  white-space: nowrap;
}

.subsystems-content {
  display: grid;
  grid-template-columns: repeat(4, 2fr);
  gap: 1%;
  padding-left: 3%;
  padding-right: 3%;
  scroll-behavior: smooth;
  width:100%;
}

.subsystem-card {
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;  /* Align text to the left */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #d3d3d3;
  width: 100%;
  box-sizing: border-box;
}

.scroll-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 24px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.scroll-button.left {
  left: 0px;
}

.scroll-button.right {
  right: 0px;
}


.subsystem-card h4 {
  color: white;
  text-align: center;
  line-height: 1.3;
  /* Adjust line height for better spacing */
  height: 3em;
  /* Ensures the title takes up enough space for two lines */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: normal;
  word-break: break-word;
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-footer {
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.card-footer .card-pagination {
  display: flex;
  align-items: center;
}

.card-footer .card-pagination button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 18px;
}

.card-footer .card-pagination p {
  margin: 0 5px;
}

.semi-circle-progress {
  margin: 20px 0;
}

.status-dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 5px;
}

.status-online {
  background-color: green;
}

.status-offline {
  background-color: red;
}

.see-more {
  color: black;
  text-decoration: none;
}

.see-more:hover {
  text-decoration: underline;
}

/* Page Indicators Positioned at the Bottom */
.page-indicators {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
}

.page-indicators span {
  font-size: 24px;
  color: #ccc;
  margin: 0 5px;
}

.page-indicators span.active {
  color: #007bff;
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

/* Styles for the Title Bar */
.title-bar {
  padding: 20px 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin: 0;
  text-align: center;
}

@media (max-width: 1024px) {
  .subsystems-content {
    grid-template-columns: repeat(2, 1fr);
    /* 2 columns for tablets */
  }
}

@media (max-width: 768px) {
  .subsystems-content {
    grid-template-columns: repeat(1, 1fr);
    /* 1 column for mobile */
  }


  .additional-cards {
    flex-direction: column;
    align-items: center;
  }

  .subsystems-content {
    grid-template-columns: repeat(1, 1fr);
  }

  .title-bar .row {
    flex-direction: column;
    align-items: center;
  }

  .title,
  .announcement-bar {
    text-align: center;
    margin-bottom: 10px;
  }
}

.fault-item {
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  margin-bottom: 10px;
  color: black;
  /* Default color for text */
}

.site_reached {
  background-color: yellow;
  color: black;
  /* Adjust text color for better readability on yellow background */
}


.work-completed {
  background-color: lightgreen;
  color: black;
}

.pending {
  background-color: red;
}

.fault-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-radius: 5px;
}

.fault-column {
  flex: 1;
  padding: 0 10px;
  text-align: left;
  /* Adjust as needed */
}

.fault-header {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.announcement-bar {
  background-color: #ff6f6f;
  /* Match the red background color from your image */
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  width: 100%;
}

.image-container {
  position: relative;
  width: 100%;
  height: auto;
}

/* Absolute positioning for boxes on the image */
.box {
  position: absolute;
  /* Slightly transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  width: 100px;
  /* Adjust width */
  height: 100px;
  /* Adjust height */
  opacity: 0;
  cursor: pointer;
}

/* General layout styles */
.overview-container {
  padding: 20px;
}

.title-bar {
  padding: 20px 0;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.announcement-bar {
  background-color: #ff6f6f;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}

.map-hierarchy {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #d3d3d3;
}

/* Modal Overlay Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* Ensures it is above other content */
}

/* Modal Content Styling */
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 60vw;
  /* Sets the width to 60% of the viewport */
  max-width: 900px;
  /* Max width so it doesn't stretch too large */
  height: auto;
  max-height: 80vh;
  /* Max height to ensure it doesn't overflow */
  overflow: auto;
  /* Allows scrolling if the content is too large */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* Adds shadow for depth */
  position: relative;
}

/* Close Button Styling */
button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

/* Positioning for each box */
#box1 {
  top: 58%;
  left: 6%;
  width: 8%;
  height: 30%;
}

#box2 {
  top: 8%;
  left: 11%;
  width: 16%;
  height: 18%;
}

#box3 {
  top: 5%;
  left: 27%;
  width: 16%;
  height: 21%;
}

#box4 {
  top: 5%;
  left: 43%;
  width: 15%;
  height: 21%;
}

#box5 {
  top: 8%;
  left: 65%;
  width: 8%;
  height: 18%;
}

#box6 {
  top: 26%;
  left: 16%;
  width: 56%;
  height: 21%;
}

#box7 {
  top: 47%;
  left: 25%;
  width: 10%;
  height: 30%;
}

#box8 {
  top: 47%;
  left: 35%;
  width: 9%;
  height: 30%;
}

#box9 {
  top: 47%;
  left: 44%;
  width: 10%;
  height: 30%;
}

/* Close Button Styling */
.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}

.modal-close:hover {
  color: #ff0000;
  /* Red when hovered over */
}

.subsystem-header {
  display: flex;
  justify-content: space-between; /* Title on the left, Smiley on the right */
  align-items: center;
}

.subsystem-title {
  font-size: 1.5em;
  font-weight: bold;
}

.subsystem-info {
  color: limegreen; /* Ensure the smiley is green */
  font-size: 2em;
}

.go-button {
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 5px;
  border: none;
  width: 100%;
  cursor: pointer;
}

.go-button:hover {
  background-color: #0056b3;
}

</style>

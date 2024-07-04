<template>
  <div class="overview-container">
    <div class="summary-be">
      <h3>Summary of BE</h3>
      <div class="summary-content">
        <div class="progress-bars">
          <div v-for="(progress, index) in progressData" :key="index" class="progress-bar-container">
            <CircularProgressBar :percentage="progress.value" :label="progress.label" />
          </div>
        </div>
      </div>
    </div>
    <div class="map-hierarchy">
      <h3>Map of Area or Sub-System Hierarchy Selection</h3>
      <div class="map-content">
        <img src="@/assets/ITE_EAST_FLOORPLAN.jpg" alt="ITE East Floor Plan" class="img-fluid fixed-size">
      </div>
    </div>
    <div class="summary-subsystems">
      <h3>Summary of Different Sub-Systems</h3>
      <div class="subsystems-container">
        <button class="scroll-button left" @click="scrollLeft">&lt;</button>
        <div class="subsystems-content">
          <div class="subsystem-card" v-for="(subsystem, index) in displayedSubsystems" :key="index">
            <h4 v-if="subsystem.name === 'Fire Alarm System Overview'">
              {{ currentFireAlarmIndex === 0 ? subsystem.name : fireAlarms[currentFireAlarmIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Smart Air Quality System Overview'">
              {{ currentIAQDeviceIndex === 0 ? subsystem.name : iaqDevices[currentIAQDeviceIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Smart Energy Management System Overview'">
              {{ currentPowerMeterIndex === 0 ? subsystem.name : powerMeters[currentPowerMeterIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Asset Tagging System Overview'">
              {{ currentWaterMeterIndex === 0 ? subsystem.name : waterMeters[currentWaterMeterIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Smart Landscape Overview'">
              {{ currentSmartLandscapeIndex === 0 ? subsystem.name : smartLandscape[currentSmartLandscapeIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Smart Washroom System Overview'">
              {{ currentSmartToiletIndex === 0 ? subsystem.name : smartToilet[currentSmartToiletIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Building Management System (JCS) Overview'">
              {{ currentBMSIndex === 0 ? subsystem.name : bms[currentBMSIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Smart Pest Control System Overview'">
              {{ currentSmartPestControlIndex === 0 ? subsystem.name : smartPestControl[currentSmartPestControlIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Smart Security System Overview'">
              {{ currentSmartSecurityIndex === 0 ? subsystem.name : smartSecurity[currentSmartSecurityIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Smart Lighting System Overview'">
              {{ currentSmartLightingIndex === 0 ? subsystem.name : smartLighting[currentSmartLightingIndex].name }}
            </h4>
            <h4 v-else-if="subsystem.name === 'Hybrid Air System Overview'">
              {{ currentHybridAirIndex === 0 ? subsystem.name : hybridAir[currentHybridAirIndex].name }}
            </h4>
            <div v-if="subsystem.name === 'Fire Alarm System Overview'">
              <SemiCircleProgressBar v-if="currentFireAlarmIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Status: {{ fireAlarms[currentFireAlarmIndex].status }} 
                  <span :class="['status-dot', {'status-online': fireAlarms[currentFireAlarmIndex].status === 'Online', 'status-offline': fireAlarms[currentFireAlarmIndex].status === 'Offline'}]"></span>
                </p>
                <p>Last Updated: {{ fireAlarms[currentFireAlarmIndex].lastUpdated }}</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Smart Air Quality System Overview'">
              <SemiCircleProgressBar v-if="currentIAQDeviceIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Avg Temp: {{ iaqDevices[currentIAQDeviceIndex].avgTemp }}°C</p>
                <p>Avg Humidity: {{ iaqDevices[currentIAQDeviceIndex].avgHumidity }}%</p>
                <p>Avg Pressure: {{ iaqDevices[currentIAQDeviceIndex].avgPressure }} hPa</p>
                <p>Avg CO2: {{ iaqDevices[currentIAQDeviceIndex].avgCO2 }} ppm</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Smart Energy Management System Overview'">
              <SemiCircleProgressBar v-if="currentPowerMeterIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Avg kWh: {{ powerMeters[currentPowerMeterIndex].avgKwh }}</p>
                <p>Total kWh: {{ powerMeters[currentPowerMeterIndex].totalKwh }}</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Asset Tagging System Overview'">
              <SemiCircleProgressBar v-if="currentWaterMeterIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Avg Flow Rate: {{ waterMeters[currentWaterMeterIndex].avgFlowRate }} L/min</p>
                <p>Avg Usage: {{ waterMeters[currentWaterMeterIndex].avgUsage }} L</p>
                <p>Avg Pressure: {{ waterMeters[currentWaterMeterIndex].avgPressure }} kPa</p>
                <p>Avg Temperature: {{ waterMeters[currentWaterMeterIndex].avgTemperature }}°C</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Smart Landscape Overview'">
              <SemiCircleProgressBar v-if="currentSmartLandscapeIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Status: {{ smartLandscape[currentSmartLandscapeIndex].status }}
                  <span :class="['status-dot', {'status-online': smartLandscape[currentSmartLandscapeIndex].status === 'Online', 'status-offline': smartLandscape[currentSmartLandscapeIndex].status === 'Offline'}]"></span>
                </p>
                <p>Last Updated: {{ smartLandscape[currentSmartLandscapeIndex].lastUpdated }}</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Smart Washroom System Overview'">
              <SemiCircleProgressBar v-if="currentSmartToiletIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Status: {{ smartToilet[currentSmartToiletIndex].status }}
                  <span :class="['status-dot', {'status-online': smartToilet[currentSmartToiletIndex].status === 'Online', 'status-offline': smartToilet[currentSmartToiletIndex].status === 'Offline'}]"></span>
                </p>
                <p>Last Updated: {{ smartToilet[currentSmartToiletIndex].lastUpdated }}</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Building Management System (JCS) Overview'">
              <SemiCircleProgressBar v-if="currentBMSIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Connection: {{ bms[currentBMSIndex].connection }}</p>
                <p>Value: {{ bms[currentBMSIndex].value }}</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Smart Pest Control System Overview'">
              <SemiCircleProgressBar v-if="currentSmartPestControlIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Status: {{ smartPestControl[currentSmartPestControlIndex].status }}
                  <span :class="['status-dot', {'status-online': smartPestControl[currentSmartPestControlIndex].status === 'Online', 'status-offline': smartPestControl[currentSmartPestControlIndex].status === 'Offline'}]"></span>
                </p>
                <p>Last Updated: {{ smartPestControl[currentSmartPestControlIndex].lastUpdated }}</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Smart Security System Overview'">
              <SemiCircleProgressBar v-if="currentSmartSecurityIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Status: {{ smartSecurity[currentSmartSecurityIndex].status }}
                  <span :class="['status-dot', {'status-online': smartSecurity[currentSmartSecurityIndex].status === 'Online', 'status-offline': smartSecurity[currentSmartSecurityIndex].status === 'Offline'}]"></span>
                </p>
                <p>Last Updated: {{ smartSecurity[currentSmartSecurityIndex].lastUpdated }}</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Smart Lighting System Overview'">
              <SemiCircleProgressBar v-if="currentSmartLightingIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Status: {{ smartLighting[currentSmartLightingIndex].status }}
                  <span :class="['status-dot', {'status-online': smartLighting[currentSmartLightingIndex].status === 'Online', 'status-offline': smartLighting[currentSmartLightingIndex].status === 'Offline'}]"></span>
                </p>
                <p>Last Updated: {{ smartLighting[currentSmartLightingIndex].lastUpdated }}</p>
              </div>
            </div>
            <div v-if="subsystem.name === 'Hybrid Air System Overview'">
              <SemiCircleProgressBar v-if="currentHybridAirIndex === 0" :percentage="subsystem.operational" />
              <div v-else>
                <p>Status: {{ hybridAir[currentHybridAirIndex].status }}
                  <span :class="['status-dot', {'status-online': hybridAir[currentHybridAirIndex].status === 'Online', 'status-offline': hybridAir[currentHybridAirIndex].status === 'Offline'}]"></span>
                </p>
                <p>Last Updated: {{ hybridAir[currentHybridAirIndex].lastUpdated }}</p>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-pagination">
                <button @click="prevItem(subsystem.name)" :disabled="!canPrevItem(subsystem.name)">&lt;</button>
                <p>{{ getCurrentIndex(subsystem.name) + 1 }}/{{ getTotalPages(subsystem.name) }}</p>
                <button @click="nextItem(subsystem.name)" :disabled="!canNextItem(subsystem.name)">&gt;</button>
              </div>
              <router-link :to="subsystem.link" class="see-more">View Details</router-link>
            </div>
          </div>
        </div>
        <button class="scroll-button right" @click="scrollRight">&gt;</button>
      </div>
      <div class="page-indicators">
        <span v-for="page in totalPages" :key="page" :class="{ 'active': page === currentPage + 1 }">•</span>
      </div>
    </div>
    <div class="additional-cards">
      <div class="additional-card auto-scroll-feed">
        <h4>Alarm & Notification</h4>
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
        <h4>Quick Links</h4>
        <div class="links-content">
          <button v-for="(link, index) in quickLinks" :key="index" class="quick-link-button" @click="navigateToLink(link.url)">
            {{ link.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SemiCircleProgressBar from '@/components/SemiCircleProgressBar.vue';
import CircularProgressBar from '@/components/CircularProgressBar.vue';

export default {
  name: 'OverviewPage',
  components: {
    SemiCircleProgressBar,
    CircularProgressBar,
  },
  data() {
    return {
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
      progressData: [
        { label: 'Energy Efficiency', value: 100 },
        { label: 'Water Usage', value: 100 },
        { label: 'Temperature Control', value: 100 },
        { label: 'Air Quality', value: 100 },
        { label: 'System Performance', value: 100 },
      ],
      subsystemData: [
        { name: 'Fire Alarm System Overview', type: 'semi-circle', operational: 100, link: '/fire-alarm-system' },
        { name: 'Smart Landscape Overview', type: 'semi-circle', operational: 100, link: '/smart-landscape-system' },
        { name: 'Building Management System (JCS) Overview', type: 'semi-circle', operational: 100, link: '/bms-reading' },
        { name: 'Smart Washroom System Overview', type: 'semi-circle', operational: 100, link: '/smart-toilet-system' },
        { name: 'Smart Energy Management System Overview', type: 'semi-circle', operational: 100, link: '/power-meter-reading' },
        { name: 'Smart Pest Control System Overview', type: 'semi-circle', operational: 100, link: '/smart-pest-control-system' },
        { name: 'Smart Security System Overview', type: 'semi-circle', operational: 100, link: '/smart-security-system' },
        { name: 'Smart Air Quality System Overview', type: 'semi-circle', operational: 100, link: '/smart-air-quality-system' },
        { name: 'Asset Tagging System Overview', type: 'semi-circle', operational: 100, link: '/asset-tagging-system' },
        { name: 'Smart Lighting System Overview', type: 'semi-circle', operational: 100, link: '/smart-lighting-system' },
        { name: 'Hybrid Air System Overview', type: 'semi-circle', operational: 100, link: '/hybrid-aircon-system' },
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
        { label: '3D System Page', url: 'https://visualizer-lite-html.vercel.app/?site=23&buildings=19' }
      ],
    };
  },
  computed: {
    displayedSubsystems() {
      // Show 4 subsystems per page
      const start = this.currentPage * 4;
      return this.subsystemData.slice(start, start + 4);
    },
    totalPages() {
      return Math.ceil(this.subsystemData.length / 4);
    }
  },
  methods: {
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
    navigateToLink(url) {
      window.open(url, '_blank');
    }
  },
};
</script>
<style scoped>
/* CSS code remains the same */
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
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px; /* Adjust the gap between buttons as needed */
  margin-top: 10px; /* Add margin to separate the title and content */
}

.quick-link-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 150px; /* Ensures buttons have a consistent width */
  text-align: center;
}

.quick-link-button:hover {
  background: #0056b3;
}

.quick-link-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}

.quick-link-button:last-child {
  margin-bottom: 0;
}

.overview-container {  
  background-color: #d6ecfa;
  display: grid;
  grid-template-columns: 3fr 3fr;
  /* Makes the left column wider */
  grid-template-areas:
    "summary-be map-hierarchy"
    "summary-subsystems map-hierarchy"
    "summary-subsystems additional-cards";
  grid-gap: 20px;
  padding: 20px;
}

.summary-be {
  grid-area: summary-be;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #d3d3d3; /* Updated border color */
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
  grid-area: map-hierarchy;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #d3d3d3; /* Updated border color */
}

.additional-cards {
  grid-area: additional-cards;
  display: flex;
  justify-content: flex-end; /* Aligns items to the right */
  gap: 20px;
  height: 250px;
}

.additional-card {
  background: white;
  color: black;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #d3d3d3; /* Updated border color */
}

.additional-card.auto-scroll-feed {
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensures content stays within the card */
  flex: 1; /* Takes up remaining space */
  width: 100%; /* Ensure it fills the available width */
}

.feed-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden; /* Ensures content stays within the card */
  margin-top: 10px; /* Add margin to separate the title and content */
  width: 100%; /* Ensure it fills the available width */
}

.feed-content {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  animation: scroll 20s linear infinite;
  width: 100%; /* Ensure it fills the available width */
}

.feed-item {
  background: rgb(231, 231, 231);
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%; /* Ensure it fills the available width */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

@keyframes scroll {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(calc(-100% - 10px)); /* Adjust this value to ensure correct scrolling distance */
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
  border: 2px solid #d3d3d3; /* Updated border color */
  position: relative; /* Make the parent div the positioning context */
}

.summary-content,
.map-content,
.subsystems-content {
  display: flex;
  flex-direction: column;
}

.subsystems-container {
  display: flex;
  justify-content: center; /* Center align the cards */
  align-items: center;
  position: relative;
}

.subsystems-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-left: 5%;
}

.subsystem-card {
  color: black;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #d3d3d3; /* Updated border color */
  width: 93%; /* Fixed width */
  height: 96%; /* Fixed height */
  box-sizing: border-box; /* Ensures padding and border are included in the width and height */
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
  padding: 0 0px; /* Add padding to the left and right */
}

.scroll-button.left {
  left: 0px; /* Adjust as needed */
}

.scroll-button.right {
  right: 0px; /* Adjust as needed */
}

.subsystem-card h4 {
  color: black;
  text-align: center;
  line-height: 1.3; /* Adjust line height for better spacing */
  height: 3em; /* Ensures the title takes up enough space for two lines */
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

.page-indicators {
  position: absolute;
  bottom: -3px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.page-indicators span {
  display: inline-block;
  font-size: 24px;
  color: #ccc;
}

.page-indicators span.active {
  color: #007bff;
}
</style>

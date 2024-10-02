<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Indoor Air Quality System</h2>
    <div class="sensor-detection-diagram">
      <div class="image-container">
        <img src="@/assets/IAQ Pic.jpg" alt="Relation View" class="relation-image" style="width: 100%;">

        <div v-for="box in boxes" :key="box.id" class="clickable-box" @click="openDialog(box.id)"
          :style="{ top: box.top, left: box.left }">
          <button class="btn btn-secondary btn-plus">+</button>
        </div>
        <div v-for="sensor in sensors" :key="sensor.id" class="sensor-data"
          :style="{ top: sensor.top, left: sensor.left }">
          <div class="sensor-row">
            <p class="co2">
              <b>CO2</b>
            </p>
            <p class="pressure">
              <b>Pressure</b>
            </p>
          </div>
          <div class="sensor-row">
            <p class="co2">
              {{ sensor.co2 }} ppm
            </p>
            <p class="pressure">
              {{ sensor.pressure }}
            </p>
          </div>
          <div class="sensor-row">

          </div>
          <div class="sensor-row">

          </div>
          <div class="sensor-row">

          </div>
          <div class="sensor-row">
            <p class="temperature-humidity">
              <i class="fas fa-thermometer-half"></i>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <i class="fas fa-tint ml-3"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b style="font-size:0.5rem;">PM2.5</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b class="ml-3" style="font-size:0.5rem;">PM10</b>
            </p>
          </div>

          <div class="sensor-row" style="font-size:0.7rem;">
            <p class="temperature-humidity">
              {{ parseFloat(sensor.temperature).toFixed(1)
              }}°C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ parseFloat(sensor.humidity).toFixed(1) }}%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ sensor.pm2_5 }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ sensor.pm10 }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Modal -->
    <div v-if="showDialog" class="modal-overlay" @click="closeDialog">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeDialog">&times;</button>
        <!-- Updated Section: Selected Sensor Data in 2x3 Grid with Faces -->
        <div v-if="getSelectedSensorData(selectedBoxId)" class="sensor-details">
          <h5>Sensor Data for Floor: {{ getFloorName(selectedBoxId) }}</h5>
          <div class="sensor-grid">
            <!-- CO2 Sensor -->
            <div class="sensor-box">
              <p><b>CO2:</b></p>
              <p>{{ getSelectedSensorData(selectedBoxId).co2 }} ppm</p>
              <div class="face-indicator">
                <i :class="getFaceClass(getSelectedSensorData(selectedBoxId).co2, 'co2')" class="modal-face-icon"></i>
              </div>
            </div>
            <!-- Temperature Sensor -->
            <div class="sensor-box">
              <p><b>Temperature:</b></p>
              <p>{{ getSelectedSensorData(selectedBoxId).temperature }}°C</p>
              <div class="face-indicator">
                <i :class="getFaceClass(getSelectedSensorData(selectedBoxId).temperature, 'temperature')"
                  class="modal-face-icon"></i>
              </div>
            </div>
            <!-- Humidity Sensor -->
            <div class="sensor-box">
              <p><b>Humidity:</b></p>
              <p>{{ getSelectedSensorData(selectedBoxId).humidity }}%</p>
              <div class="face-indicator">
                <i :class="getFaceClass(getSelectedSensorData(selectedBoxId).humidity, 'humidity')"
                  class="modal-face-icon"></i>
              </div>
            </div>
            <!-- PM2.5 Sensor -->
            <div class="sensor-box">
              <p><b>PM2.5:</b></p>
              <p>{{ getSelectedSensorData(selectedBoxId).pm2_5 }} µg/m³</p>
              <div class="face-indicator">
                <i :class="getFaceClass(getSelectedSensorData(selectedBoxId).pm2_5, 'pm2_5')"
                  class="modal-face-icon"></i>
              </div>
            </div>
            <!-- PM10 Sensor -->
            <div class="sensor-box">
              <p><b>PM10:</b></p>
              <p>{{ getSelectedSensorData(selectedBoxId).pm10 }} µg/m³</p>
              <div class="face-indicator">
                <i :class="getFaceClass(getSelectedSensorData(selectedBoxId).pm10, 'pm10')" class="modal-face-icon"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Floorplan Image Container -->
        <div class="floorplan-container">
          <!-- Floorplan Image -->
          <img :src="getCurrentFloorplanImage(selectedBoxId)" alt="Selected Floorplan" class="floorplan-image">
          <!-- Wrapper for status dots to apply v-if -->
          <div v-if="selectedBoxId === 1 || selectedBoxId === 2">
            <div v-for="fan in fans" :key="fan.id" class="status-dot-floorplan"
              :style="{ top: fan.top, left: fan.left }">
              <span class="status-dot" :class="fan.isOn ? 'online' : 'offline'"></span>
            </div>
          </div>
          <div v-if="selectedBoxId === 1 || selectedBoxId === 2" class="fan-controls-top-right">
            <!-- Slider for each Fresh Air Fan -->
            <div v-for="fan in fans" :key="fan.id" class="fan-control">
              <p><b>{{ fan.name }}</b> - {{ fan.isOn ? 'On' : 'Off' }}</p>
              <label class="slider-container">
                <input type="checkbox" v-model="fan.isOn" @change="sendFanCommand(fan, fan.isOn)">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Custom Modal for Fan Control -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <button class="close-btn" @click="closeModal">&times;</button>
            <h4>{{ selectedFan.name }}</h4>
            <div class="button-group">
              <button class="btn btn-primary" @click="sendFanCommand(selectedFan, true)">ON</button>
              <button class="btn btn-danger" @click="sendFanCommand(selectedFan, false)">OFF</button>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'IndoorAirQuality',
  data() {
    return {
      sensors: [], // Your sensors data
      fans: [
        { id: 1, name: 'Fresh Air Fan 1 (B05-11)', deviceEUI: '24E124756E049153', isOn: false, top: '49%', left: '39%' },
        { id: 2, name: 'Fresh Air Fan 2 (B05-12)', deviceEUI: '24E124756E049153', isOn: false, top: '49%', left: '78%' }
      ],
      selectedFan: null,
      showModal: false,
      boxes: [
        { id: 1, top: '26%', left: '19%' },
        { id: 2, top: '26%', left: '40%' },
        { id: 3, top: '26%', left: '61%' },
        { id: 4, top: '26%', left: '81%' },
        { id: 5, top: '74%', left: '19%' },
        { id: 6, top: '74%', left: '40%' },
        { id: 7, top: '74%', left: '61%' },
        { id: 8, top: '74%', left: '81%' }
      ],
      floorplans: [
        { id: 1, name: 'B05-11', image: require('@/assets/Sub System and Icons/V2/B05-11-12_full_IAQ_FAF.png') },
        { id: 2, name: 'B05-12', image: require('@/assets/Sub System and Icons/V2/B05-11-12_full_IAQ_FAF.png') },
        { id: 3, name: 'B05-13/14', image: require('@/assets/Sub System and Icons/V2/B05 13-14_IAQ.png') },
        { id: 4, name: 'B05-15/16', image: require('@/assets/Sub System and Icons/V2/B05 15-16_full.png') },
        { id: 5, name: 'B05-18', image: require('@/assets/Sub System and Icons/V2/B05-18_full1_IAQ.png') },
        { id: 6, name: 'B05-07', image: require('@/assets/Sub System and Icons/V2/B05-07_full1_IAQ.png') },
        { id: 7, name: 'B05-08', image: require('@/assets/Sub System and Icons/V2/B05-08_IAQ.png') },
        { id: 8, name: 'B05-09', image: require('@/assets/Sub System and Icons/V2/B05-09_full1_IAQ.png') }
      ],
      showDialog: false,
      selectedBoxId: null
    };
  },
  mounted() {
    this.fetchSensorData();
  },
  methods: {
    openFanDialog(fan) {
      this.selectedFan = fan;
      this.showModal = true;
    },

    // Close modal
    closeModal() {
      this.showModal = false;
    },

    // Function to send command to control fan (turn it on or off)
    async sendFanCommand(fan, turnOn) {
      const payload = {
        deviceEui: fan.deviceEUI,
        switchStates: turnOn ? [1, 0, 0, 0, 0, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 0, 0] // Adjust based on fan control logic
      };

      try {
        const response = await axios.post('https://hammerhead-app-kva7n.ondigitalocean.app/command/ws558', payload);
        console.log(`${fan.name} turned ${turnOn ? 'ON' : 'OFF'}`, response.data);

        // Update the fan state
        fan.isOn = turnOn;
      } catch (error) {
        console.error(`Error turning ${turnOn ? 'ON' : 'OFF'} ${fan.name}:`, error);
      }
    },

    // Method to toggle both fans at once
    toggleAllFans() {
      this.fans.forEach(fan => {
        fan.isOn = !fan.isOn;  // Toggle the state of both fans
        this.sendFanCommand(fan, fan.isOn);  // Send the command for each fan
      });
    },

    getSelectedSensorData(boxId) {
      return this.sensors.find(sensor => sensor.id === boxId);
    },

    async fetchSensorData() {
      try {
        const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Lorawan/latest/sheet/IAQ');
        const data = response.data;

        this.sensors = [
          {
            id: 1,
            name: 'B05-11',
            co2: data['24e124710d480176'].co2,
            temperature: data['24e124710d480176'].temperature,
            humidity: data['24e124710d480176'].humidity,
            pm2_5: data['24e124710d480176'].pm2_5,
            pm10: data['24e124710d480176'].pm10,
            pressure: data['24e124710d480176'].pressure,
            top: '8%',
            left: '11.6%'
          },
          {
            id: 2,
            name: 'B05-12',
            co2: data['24e124710d480413'].co2,
            temperature: data['24e124710d480413'].temperature,
            humidity: data['24e124710d480413'].humidity,
            pm2_5: data['24e124710d480413'].pm2_5,
            pm10: data['24e124710d480413'].pm10,
            pressure: data['24e124710d480413'].pressure,
            top: '8%',
            left: '32.3%'
          },
          {
            id: 3,
            name: 'B05-13/14',
            co2: data['24e124710d480081'].co2,
            temperature: data['24e124710d480081'].temperature,
            humidity: data['24e124710d480081'].humidity,
            pm2_5: data['24e124710d480081'].pm2_5,
            pm10: data['24e124710d480081'].pm10,
            pressure: data['24e124710d480081'].pressure,
            top: '8%',
            left: '53%'
          },
          {
            id: 4,
            name: 'B05-15/16',
            co2: data['24e124710d481996'].co2,
            temperature: data['24e124710d481996'].temperature,
            humidity: data['24e124710d481996'].humidity,
            pm2_5: data['24e124710d481996'].pm2_5,
            pm10: data['24e124710d481996'].pm10,
            pressure: data['24e124710d481996'].pressure,
            top: '8%',
            left: '73.7%'
          },
          {
            id: 5,
            name: 'B05-18',
            co2: data['24e124710d480413'].co2,
            temperature: data['24e124710d480413'].temperature,
            humidity: data['24e124710d480413'].humidity,
            pm2_5: data['24e124710d480413'].pm2_5,
            pm10: data['24e124710d480413'].pm10,
            pressure: data['24e124710d480413'].pressure,
            top: '55%',
            left: '11.6%'
          },
          {
            id: 6,
            name: 'B05-07',
            co2: data['24e124710d482090'].co2,
            temperature: data['24e124710d482090'].temperature,
            humidity: data['24e124710d482090'].humidity,
            pm2_5: data['24e124710d482090'].pm2_5,
            pm10: data['24e124710d482090'].pm10,
            pressure: data['24e124710d482090'].pressure,
            top: '55%',
            left: '32.3%'
          },
          {
            id: 7,
            name: 'B05-08',
            co2: data['24e124710d482388'].co2,
            temperature: data['24e124710d482388'].temperature,
            humidity: data['24e124710d482388'].humidity,
            pm2_5: data['24e124710d482388'].pm2_5,
            pm10: data['24e124710d482388'].pm10,
            pressure: data['24e124710d482388'].pressure,
            top: '55%',
            left: '53%'
          },
          {
            id: 8,
            name: 'B05-09',
            co2: data['24e124710d482648'].co2,
            temperature: data['24e124710d482648'].temperature,
            humidity: data['24e124710d482648'].humidity,
            pm2_5: data['24e124710d482648'].pm2_5,
            pm10: data['24e124710d482648'].pm10,
            pressure: data['24e124710d482648'].pressure,
            top: '55%',
            left: '73.7%'
          }
        ];
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    },

    openDialog(boxId) {
      this.selectedBoxId = boxId;
      this.showDialog = true;
    },

    closeDialog() {
      this.showDialog = false;
    },

    getCurrentFloorplanImage(boxId) {
      const floorplan = this.floorplans.find(fp => fp.id === boxId);
      if (floorplan) {
        return floorplan.image;
      } else {
        return ''; // Fallback in case no image is found
      }
    },

    getFloorName(boxId) {
      const floorplan = this.floorplans.find(fp => fp.id === boxId);
      return floorplan ? floorplan.name : '';
    },

    getFaceClass(value, type) {
      let goodLimit, badLimit;

      switch (type) {
        case 'co2':
          goodLimit = 1000;
          badLimit = 1500;
          break;
        case 'temperature':
          goodLimit = 25.5; // Acceptable range is 22.5°C to 25.5°C
          badLimit = 27.5;
          break;
        case 'humidity':
          goodLimit = 70; // Acceptable range is < 70%
          badLimit = 71;
          break;
        case 'pm2_5':
          goodLimit = 35; // Acceptable range < 35 µg/m³
          badLimit = 75;
          break;
        case 'pm10':
          goodLimit = 100; // Acceptable range < 100 µg/m³
          badLimit = 150;
          break;
        default:
          goodLimit = 0;
          badLimit = 0;
      }

      if (value < goodLimit) {
        return 'fas fa-smile text-success modal-face-icon'; // Green smiley face for good values
      } else if (value >= goodLimit && value < badLimit) {
        return 'fas fa-meh text-warning modal-face-icon'; // Orange neutral face for moderate values
      } else {
        return 'fas fa-frown text-danger modal-face-icon'; // Red frown face for bad values
      }
    }
  }
};

</script>

<style scoped>
.container-fluid {
  width: 100%;
  padding: 2rem;
}

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
}

.sensor-box {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.sensor-box p {
  margin: 5px 0;
  font-size: 0.9rem;
}


.sensor-detection-diagram {
  position: relative;
  width: 100%;
}

.image-container {
  position: relative;
  width: 88%;
}

.clickable-box {
  width: 19%;
  /* Smaller width */
  height: 45%;
  /* Smaller height */
  cursor: pointer;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
  /* Add a high z-index to bring the boxes to the front */
}


.btn-plus {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 2;
}

.sensor-data {
  width: 15%;
  /* Adjust to fit smaller cards */
  height: 20%;
  position: absolute;
  padding: 8px;
  color: black;
  border-radius: 5px;
  text-align: left;
  font-size: 0.9rem;
  white-space: nowrap;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 40%;
  text-align: center;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.floorplan-image {
  width: 100%;
}

.sensor-row {
  display: flex;
  justify-content: space-between;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.text-warning {
  color: #ffc107;
}

.sensor-details {
  background-color: #f7f7f7;
  padding: 15px;
  margin-top: 20px;
  border-radius: 5px;
}

.sensor-details h5 {
  margin-bottom: 15px;
  font-weight: bold;
}

.sensor-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.sensor-row p {
  margin: 0;
}

.modal-content {
  max-width: 90%;
  padding: 20px;
}

.floorplan-image {
  margin-top: 10px;
  border-radius: 5px;
  width: 100%;
}

.face-indicator {
  display: flex;
  justify-content: center;
  padding-top: 5px;
}

.modal-face-icon {
  font-size: 1.5rem;
  /* Adjust icon size specifically for the modal */
}

.fresh-air-fan-icon {
  position: absolute;
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 5;
  /* To make sure it stays on top */
}

.icon-image {
  width: 100%;
  height: 100%;
}

.status-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.online {
  background-color: green;
}

.offline {
  background-color: red;
}

.modal-content {
  color: black;
}

/* Make the container of the floorplan image relative, so the sliders are positioned absolutely relative to this container */
.floorplan-container {
  position: relative;
}

/* Style the floorplan image */
.floorplan-image {
  width: 100%;
  border-radius: 5px;
}

/* Position the fan controls on the top-right corner of the floorplan */
.fan-controls-top-right {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 5;
}

/* Style each fan control section to display items in a single row */
.fan-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 300px;
  /* Adjust width as needed */
}

/* Style the slider container */
.slider-container {
  position: relative;
  width: 34px;
  height: 20px;
  margin-left: 10px;
  /* Adds spacing between text and slider */
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 14px;
  width: 14px;
  left: 4px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: green;
}

input:checked+.slider:before {
  transform: translateX(14px);
}

/* Style for floorplan status dots */
.status-dot-floorplan {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  z-index: 10;
  /* Ensure it appears above the floorplan */
}

.online {
  background-color: green;
}

.offline {
  background-color: red;
}

.floorplan-image {
  width: 100%;
  position: relative;
  display: block;
}
</style>

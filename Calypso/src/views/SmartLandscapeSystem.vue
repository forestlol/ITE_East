<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Landscape System</h2>

    <!-- Tab Navigation -->
    <ul class="nav nav-tabs justify-content-center" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab" aria-controls="overview" aria-selected="true">Overview</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="sensors-tab" data-bs-toggle="tab" data-bs-target="#sensors" type="button" role="tab" aria-controls="sensors" aria-selected="false">Sensors</button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content" id="myTabContent">
      <!-- Overview Tab -->
      <div class="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="overview-tab">
        <div class="row">
          <div class="col-md-6">
            <div class="relation-section">
              <h4>Relation View</h4>
              <div class="relation-view-container">
                <div class="relation-view position-relative">
                  <img src="@/assets/Smart Landscape Algo 2 empty.png" alt="Relation View" class="relation-image">
                  <div v-for="(point, index) in relationPoints" :key="index"
                    :style="{ top: point.y + '%', left: point.x + '%', position: 'absolute', transform: 'translate(-50%, -50%)' }"
                    @mouseenter="showValue(index, $event)" @mouseleave="hideValue"
                    :class="{ 'relation-point': true, 'point-label-break': point.type === 'break' }">
                    <template v-if="point.type === 'sensor'">
                      <span class="point-number">{{ point.number }}</span>
                    </template>
                    <template v-else>
                      <span class="point-label">{{ formatLabel(point.label) }}</span>
                    </template>
                    <span v-if="hoveredIndex === index" class="value-tooltip">
                      <h5>{{ point.type === 'sensor' ? `Sensor ${point.number}` : point.label }}</h5>
                      <template v-if="point.type === 'sensor'">
                        <p>Temperature: {{ point.data.temperature }}°C</p>
                        <p>Humidity: {{ point.data.humidity }}%</p>
                        <p>Pressure: {{ point.data.pressure }} hPa</p>
                        <p>CO2: {{ point.data.co2 }} ppm</p>
                      </template>
                      <template v-else-if="point.type === 'status'">
                        <p>{{ point.label }}: {{ point.status }}</p>
                      </template>
                      <template v-else-if="point.type === 'reading'">
                        <p>{{ point.label }}: {{ point.reading }}</p>
                      </template>
                    </span>
                  </div>
                </div>
                <div class="adjust-button-container">
                  <button @click="openModal" class="btn btn-primary">Adjust Condition</button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="map-section position-relative">
              <h4>Floorplan View</h4>
              <div class="map-container position-relative">
                <img src="@/assets/Sub System and Icons/V2/smart Landscape systemV2.png" alt="Map View" class="map-image">

                <!-- Buttons for Outdoor 1 (Top Left) -->
                <div class="outdoor-buttons position-absolute top-left">
                  <button @click="setAllSwitches(true, '24e124756e049564')" class="btn btn-primary btn-sm">ON ALL (Outdoor 1st)</button>
                  <button @click="setAllSwitches(false, '24e124756e049564')" class="btn btn-danger btn-sm mt-1">OFF ALL (Outdoor 1st)</button>
                </div>

                <!-- Buttons for Outdoor 2 (Top Right) -->
                <div class="outdoor-buttons position-absolute top-right">
                  <button @click="setAllSwitches(true, '24e124756e049516')" class="btn btn-primary btn-sm">ON ALL (Outdoor 2nd)</button>
                  <button @click="setAllSwitches(false, '24e124756e049516')" class="btn btn-danger btn-sm mt-1">OFF ALL (Outdoor 2nd)</button>
                </div>

                <!-- Buttons for Outdoor 3 (Bottom Left) -->
                <div class="outdoor-buttons position-absolute bottom-left">
                  <button @click="setAllSwitches(true, '24E124756E049454')" class="btn btn-primary btn-sm">ON ALL (Outdoor 3rd)</button>
                  <button @click="setAllSwitches(false, '24E124756E049454')" class="btn btn-danger btn-sm mt-1">OFF ALL (Outdoor 3rd)</button>
                </div>

                <!-- Icons for devices -->
                <div v-for="(icon, index) in icons" :key="index" class="icon-container"
                  :style="{ top: icon.y + '%', left: icon.x + '%', position: 'absolute', transform: 'translate(-50%, -50%)' }"
                  @click="handleIconClick(icon)">
                  <img :src="icon.src" alt="Icon" class="icon-image">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-3" v-for="device in devices" :key="device.id">
            <div class="device-status-card position-relative">
              <h5>{{ device.name }}</h5>
              <button v-if="device.name === '7 in 1 Sensor' || device.name === 'Solenoid Valve'"
                class="btn btn-sm position-absolute top-0 end-0 mt-2 mr-2 rounded-circle">
                <i class="fas fa-plus"></i>
              </button>
              <p class="status" :class="{ 'text-success': device.isOnline, 'text-danger': !device.isOnline }">{{
                device.isOnline ? 'Online' : 'Offline' }}</p>
            </div>
          </div>
        </div>
        <div class="condition mt-4 text-center">
          <p>If 7 in 1 Sensor, Rainfall Sensor, Lux Sensor, Water Level Sensor Threshold met, Main pump turn on, Dosing pump
            turn on when Threshold met and turn on Solenoid Valve.</p>
        </div>
      </div>

      <!-- Sensors Tab -->
      <div class="tab-pane fade" id="sensors" role="tabpanel" aria-labelledby="sensors-tab">
        <div class="row mt-4">
          <div class="col-md-4" v-for="(sensor, index) in sensors" :key="index">
            <div class="card mb-4">
              <div class="card-header">
                Sensor {{ sensor.number }}
              </div>
              <div class="card-body">
                <p><strong>Temperature:</strong> {{ sensor.data.temperature }}°C</p>
                <p><strong>Humidity:</strong> {{ sensor.data.humidity }}%</p>
                <p><strong>Pressure:</strong> {{ sensor.data.pressure }} hPa</p>
                <p><strong>CO2:</strong> {{ sensor.data.co2 }} ppm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals and Buttons -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>
    <div v-if="showModal" class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h5 class="modal-title">{{ activeIcon?.name }}</h5>
            <button type="button" class="btn-close position-absolute top-0 end-0" @click="closeModal">&times;</button>
          </div>
          <div class="modal-body text-center">
            <button @click="toggleSwitch(true, activeIcon.switchNumber)" class="btn btn-primary mx-2">ON</button>
            <button @click="toggleSwitch(false, activeIcon.switchNumber)" class="btn btn-danger mx-2">OFF</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Valve Simulation Modal -->
    <div v-if="showScheduleModal" class="modal-overlay" @click="closeScheduleModal"></div>
    <div v-if="showScheduleModal" class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header justify-content-center">
            <h5 class="modal-title">Scheduled Valve Simulation</h5>
            <button type="button" class="btn-close position-absolute top-0 end-0" @click="closeScheduleModal">&times;</button>
          </div>
          <div class="modal-body">
            <p>Scheduled Times:</p>
            <ul>
              <li v-for="(schedule, index) in scheduleTimes" :key="index">
                {{ schedule.time }} - {{ schedule.duration }} minutes
              </li>
            </ul>
            <button @click="testValveOperation" class="btn btn-primary">Test Valve Operation Now</button>
          </div>
        </div>
      </div>
    </div>

    <div class="link-button mt-4">
      <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
      <button @click="openScheduleModal" class="btn btn-secondary ml-2">Schedule Valve Simulation</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import mainPumpIcon from '@/assets/main-pump-icon.png';
import dosagePumpIcon from '@/assets/dosage-pump-icon.png';
import planterPotIcon from '@/assets/planter-pot-icon.png';

export default {
  name: 'SmartLandscapeSystem',
  data() {
    return {
      devices: [
        { id: 1, name: '7 in 1 Sensor', isOnline: true },
        { id: 2, name: 'Rainfall Sensor', isOnline: false },
        { id: 3, name: 'Lux Sensor', isOnline: true },
        { id: 4, name: 'Water Level Sensor', isOnline: true },
        { id: 5, name: 'Main Pump', isOnline: true },
        { id: 6, name: 'Dosing Pump', isOnline: true },
        { id: 7, name: 'Solenoid Valve', isOnline: true },
      ],
      relationPoints: [
        { number: 1, type: 'sensor', x: 15, y: 20, data: { temperature: 25, humidity: 60, pressure: 1012, co2: 400 } },
        { number: 2, type: 'sensor', x: 21, y: 20, data: { temperature: 26, humidity: 65, pressure: 1013, co2: 410 } },
        { number: 3, type: 'sensor', x: 27.6, y: 20, data: { temperature: 27, humidity: 70, pressure: 1014, co2: 420 } },
        { number: 4, type: 'sensor', x: 34, y: 20, data: { temperature: 28, humidity: 75, pressure: 1015, co2: 430 } },
        { number: 5, type: 'sensor', x: 15, y: 31, data: { temperature: 29, humidity: 80, pressure: 1016, co2: 440 } },
        { number: 6, type: 'sensor', x: 21, y: 31, data: { temperature: 30, humidity: 85, pressure: 1017, co2: 450 } },
        { number: 7, type: 'sensor', x: 27.6, y: 31, data: { temperature: 31, humidity: 90, pressure: 1018, co2: 460 } },
        { number: 8, type: 'sensor', x: 34, y: 31, data: { temperature: 32, humidity: 95, pressure: 1019, co2: 470 } },
        { number: 9, type: 'sensor', x: 15, y: 42, data: { temperature: 33, humidity: 60, pressure: 1020, co2: 480 } },
        { number: 10, type: 'sensor', x: 21, y: 42, data: { temperature: 34, humidity: 65, pressure: 1021, co2: 490 } },
        { number: 11, type: 'sensor', x: 27.6, y: 42, data: { temperature: 35, humidity: 70, pressure: 1022, co2: 500 } },
        { number: 12, type: 'sensor', x: 34, y: 42, data: { temperature: 36, humidity: 75, pressure: 1023, co2: 510 } },
        { number: 13, type: 'sensor', x: 14.7, y: 53, data: { temperature: 37, humidity: 80, pressure: 1024, co2: 520 } },
        { number: 14, type: 'sensor', x: 21, y: 53, data: { temperature: 38, humidity: 85, pressure: 1025, co2: 530 } },
        { number: 15, type: 'sensor', x: 27.6, y: 53, data: { temperature: 39, humidity: 90, pressure: 1026, co2: 540 } },
        { number: 16, type: 'sensor', x: 34, y: 53, data: { temperature: 40, humidity: 95, pressure: 1027, co2: 550 } },
        { number: 17, type: 'sensor', x: 14.7, y: 63.5, data: { temperature: 41, humidity: 60, pressure: 1028, co2: 560 } },
        { number: 1, type: 'sensor', x: 68, y: 47, data: { temperature: 42, humidity: 65, pressure: 1029, co2: 570 } },
        { number: 2, type: 'sensor', x: 72.5, y: 47, data: { temperature: 43, humidity: 70, pressure: 1030, co2: 580 } },
        { number: 3, type: 'sensor', x: 77, y: 47, data: { temperature: 44, humidity: 75, pressure: 1031, co2: 590 } },
        { number: 4, type: 'sensor', x: 81.7, y: 47, data: { temperature: 45, humidity: 80, pressure: 1032, co2: 600 } },
        { number: 5, type: 'sensor', x: 86.5, y: 47, data: { temperature: 46, humidity: 85, pressure: 1033, co2: 610 } },
        { number: 6, type: 'sensor', x: 68, y: 55, data: { temperature: 47, humidity: 90, pressure: 1034, co2: 620 } },
        { number: 7, type: 'sensor', x: 72.5, y: 55, data: { temperature: 48, humidity: 95, pressure: 1035, co2: 630 } },
        { number: 8, type: 'sensor', x: 77, y: 55, data: { temperature: 49, humidity: 60, pressure: 1036, co2: 640 } },
        { number: 9, type: 'sensor', x: 81.7, y: 55, data: { temperature: 50, humidity: 65, pressure: 1037, co2: 650 } },
        { number: 10, type: 'sensor', x: 86.5, y: 55, data: { temperature: 51, humidity: 70, pressure: 1038, co2: 660 } },
        { number: 11, type: 'sensor', x: 68, y: 62.5, data: { temperature: 52, humidity: 75, pressure: 1039, co2: 670 } },
        { number: 12, type: 'sensor', x: 72.6, y: 62.5, data: { temperature: 53, humidity: 80, pressure: 1040, co2: 680 } },
        { number: 13, type: 'sensor', x: 77.3, y: 62.5, data: { temperature: 54, humidity: 85, pressure: 1041, co2: 690 } },
        { number: 14, type: 'sensor', x: 81.9, y: 62.5, data: { temperature: 55, humidity: 90, pressure: 1042, co2: 700 } },
        { number: 15, type: 'sensor', x: 86.7, y: 62.5, data: { temperature: 56, humidity: 95, pressure: 1043, co2: 710 } },
        { number: 16, type: 'sensor', x: 68, y: 70, data: { temperature: 57, humidity: 60, pressure: 1044, co2: 720 } },
        { number: 17, type: 'sensor', x: 72.7, y: 70, data: { temperature: 58, humidity: 65, pressure: 1045, co2: 730 } },
        { number: 18, type: 'sensor', x: 77.3, y: 70, data: { temperature: 59, humidity: 70, pressure: 1046, co2: 740 } },
        { number: 19, type: 'sensor', x: 81.9, y: 70, data: { temperature: 60, humidity: 75, pressure: 1047, co2: 750 } },
        { label: 'Main Pump', type: 'status', x: 48.4, y: 57, status: 'On' },
        { label: 'Rainfall Sensor', type: 'reading', x: 15.4, y: 77, reading: '10 mm' },
        { label: 'Lux Sensor', type: 'reading', x: 24.5, y: 77, reading: '1500 lux' },
        { label: 'Water Level Sensor', type: 'reading', x: 34, y: 77, reading: '75%' },
        { label: 'Dosing Pump', type: 'status', x: 61.3, y: 21, status: 'Off' },
        { label: '7-in-1 Sensor (Readings/Threshold)', type: 'title', x: 18.5, y: 10 },
        { label: '(Readings/ Threshold)', x: 15.5, y: 85, type: 'break' },
        { label: '(Readings/ Threshold)', x: 24.5, y: 85, type: 'break' },
        { label: '(Readings/ Threshold)', x: 34, y: 85, type: 'break' },
        { label: 'ON/OFF', type: 'title', x: 48.5, y: 48 },
        { label: 'ON/OFF, (Readings/Threshold)', type: 'title', x: 61.5, y: 11 },
        { label: 'Solenoid Valve ON/OFF', type: 'title', x: 68, y: 37 },
      ],
      hoveredIndex: null,
      tooltipX: 0,
      tooltipY: 0,
      showModal: false,
      activeIcon: null,
      showScheduleModal: false,
      scheduleTimes: [
        { time: '7:00 AM', duration: 20 },
        { time: '1:00 PM', duration: 20 }
      ],
      mainPumpStatus: 'Off',
      dosingPumpStatus: 'Off',
      solenoidValveStatus: 'Off',
      switchStatesOutdoor1: Array(8).fill(false), // Initialize all switches to OFF for Outdoor 1st
      switchStatesOutdoor2: Array(8).fill(false), // Initialize all switches to OFF for Outdoor 2nd
      switchStatesOutdoor3: Array(3).fill(false), // Initialize all switches to OFF for Outdoor 3rd
      icons: [
        { x: 11, y: 62, src: mainPumpIcon, name: 'Main Pump', switchNumber: 1 },
        { x: 8, y: 62, src: dosagePumpIcon, name: 'Dosage Pump', switchNumber: 19 },
        { x: 5, y: 63, src: planterPotIcon, name: 'Planter Pot 1', switchNumber: 2 },
        { x: 7, y: 56, src: planterPotIcon, name: 'Planter Pot 2', switchNumber: 3 },
        { x: 13, y: 46, src: planterPotIcon, name: 'Planter Pot 3', switchNumber: 4 },
        { x: 15, y: 57, src: planterPotIcon, name: 'Planter Pot 4', switchNumber: 5 },
        { x: 22, y: 53, src: planterPotIcon, name: 'Planter Pot 5', switchNumber: 6 },
        { x: 24, y: 46, src: planterPotIcon, name: 'Planter Pot 6', switchNumber: 7 },
        { x: 29, y: 44, src: planterPotIcon, name: 'Planter Pot 7', switchNumber: 8 },
        { x: 67, y: 49, src: planterPotIcon, name: 'Planter Pot 8', switchNumber: 9 },
        { x: 78, y: 45, src: planterPotIcon, name: 'Planter Pot 9', switchNumber: 10 },
        { x: 79, y: 59, src: planterPotIcon, name: 'Planter Pot 10', switchNumber: 11 },
        { x: 87, y: 44, src: planterPotIcon, name: 'Planter Pot 11', switchNumber: 12 },
        { x: 92, y: 61, src: planterPotIcon, name: 'Planter Pot 12', switchNumber: 13 },
        { x: 87, y: 57, src: planterPotIcon, name: 'Planter Pot 13', switchNumber: 14 },
        { x: 75, y: 67, src: planterPotIcon, name: 'Planter Pot 14', switchNumber: 15 },
        { x: 60, y: 66, src: planterPotIcon, name: 'Planter Pot 15', switchNumber: 16 },
        { x: 41, y: 67, src: planterPotIcon, name: 'Planter Pot 16', switchNumber: 17 },
        { x: 23, y: 68, src: planterPotIcon, name: 'Planter Pot 17', switchNumber: 18 },
      ],
      sensors: [
        { number: 1, data: { temperature: 25, humidity: 60, pressure: 1012, co2: 400 } },
        { number: 2, data: { temperature: 26, humidity: 65, pressure: 1013, co2: 410 } },
        { number: 3, data: { temperature: 27, humidity: 70, pressure: 1014, co2: 420 } },
        { number: 4, data: { temperature: 28, humidity: 75, pressure: 1015, co2: 430 } },
        { number: 5, data: { temperature: 29, humidity: 80, pressure: 1016, co2: 440 } },
        { number: 6, data: { temperature: 30, humidity: 85, pressure: 1017, co2: 450 } },
        { number: 7, data: { temperature: 31, humidity: 90, pressure: 1018, co2: 460 } },
        { number: 8, data: { temperature: 32, humidity: 95, pressure: 1019, co2: 470 } },
        { number: 9, data: { temperature: 33, humidity: 60, pressure: 1020, co2: 480 } },
        { number: 10, data: { temperature: 34, humidity: 65, pressure: 1021, co2: 490 } },
        { number: 11, data: { temperature: 35, humidity: 70, pressure: 1022, co2: 500 } },
        { number: 12, data: { temperature: 36, humidity: 75, pressure: 1023, co2: 510 } },
        { number: 13, data: { temperature: 37, humidity: 80, pressure: 1024, co2: 520 } },
        { number: 14, data: { temperature: 38, humidity: 85, pressure: 1025, co2: 530 } },
        { number: 15, data: { temperature: 39, humidity: 90, pressure: 1026, co2: 540 } },
        { number: 16, data: { temperature: 40, humidity: 95, pressure: 1027, co2: 550 } },
        { number: 17, data: { temperature: 41, humidity: 60, pressure: 1028, co2: 560 } },
        { number: 18, data: { temperature: 42, humidity: 65, pressure: 1029, co2: 570 } },
        { number: 19, data: { temperature: 43, humidity: 70, pressure: 1030, co2: 580 } },
        { number: 20, data: { temperature: 44, humidity: 75, pressure: 1031, co2: 590 } },
        { number: 21, data: { temperature: 45, humidity: 80, pressure: 1032, co2: 600 } },
        { number: 22, data: { temperature: 46, humidity: 85, pressure: 1033, co2: 610 } },
        { number: 23, data: { temperature: 47, humidity: 90, pressure: 1034, co2: 620 } },
        { number: 24, data: { temperature: 48, humidity: 95, pressure: 1035, co2: 630 } },
        { number: 25, data: { temperature: 49, humidity: 60, pressure: 1036, co2: 640 } },
        { number: 26, data: { temperature: 50, humidity: 65, pressure: 1037, co2: 650 } },
        { number: 27, data: { temperature: 51, humidity: 70, pressure: 1038, co2: 660 } },
        { number: 28, data: { temperature: 52, humidity: 75, pressure: 1039, co2: 670 } },
        { number: 29, data: { temperature: 53, humidity: 80, pressure: 1040, co2: 680 } },
        { number: 30, data: { temperature: 54, humidity: 85, pressure: 1041, co2: 690 } },
        { number: 31, data: { temperature: 55, humidity: 90, pressure: 1042, co2: 700 } },
        { number: 32, data: { temperature: 56, humidity: 95, pressure: 1043, co2: 710 } },
        { number: 33, data: { temperature: 57, humidity: 60, pressure: 1044, co2: 720 } },
        { number: 34, data: { temperature: 58, humidity: 65, pressure: 1045, co2: 730 } },
        { number: 35, data: { temperature: 59, humidity: 70, pressure: 1046, co2: 740 } },
        { number: 36, data: { temperature: 60, humidity: 75, pressure: 1047, co2: 750 } },
      ]
    };
  },
  methods: {
    showValue(index, event) {
      const containerRect = event.currentTarget.getBoundingClientRect();
      const pointRect = event.target.getBoundingClientRect();
      this.tooltipX = pointRect.x + pointRect.width / 2 - containerRect.x;
      this.tooltipY = pointRect.y - containerRect.y - 10; // Adjust for positioning above the point
      this.hoveredIndex = index;
    },
    handleIconClick(icon) {
      this.activeIcon = icon;
      this.showModal = true;
    },
    hideValue() {
      this.hoveredIndex = null;
    },
    navigateTo3DLandscape() {
      window.location.href = 'https://visualizer-lite-html.vercel.app/?site=23&levels=91';
    },
    formatLabel(label) {
      if (label === 'Main Pump') {
        return label;
      }
      return label.replace(' ', '\n');
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    openScheduleModal() {
      this.showScheduleModal = true;
    },
    closeScheduleModal() {
      this.showScheduleModal = false;
    },
    async sendSwitchCommand(deviceEUI, switchStates) {
      const url = `https://hammerhead-app-kva7n.ondigitalocean.app/command/ws558`;
      const payload = {
        deviceEui: deviceEUI,
        switchStates: switchStates.map(state => state ? 1 : 0)
      };

      console.log('Preparing to send payload:', payload);

      try {
        const response = await axios.post(url, payload);
        console.log('Switch command sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending switch command:', error);

        // Detailed error logging
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request data:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
      }
    },
    setAllSwitches(state, deviceEUI) {
      let switchStates = [];
      if (deviceEUI === '24e124756e049564') {
        this.switchStatesOutdoor1 = this.switchStatesOutdoor1.map(() => state);
        switchStates = this.switchStatesOutdoor1;
      } else if (deviceEUI === '24e124756e049516') {
        this.switchStatesOutdoor2 = this.switchStatesOutdoor2.map(() => state);
        switchStates = this.switchStatesOutdoor2;
      } else if (deviceEUI === '24E124756E049454') {
        this.switchStatesOutdoor3 = this.switchStatesOutdoor3.map(() => state);
        switchStates = this.switchStatesOutdoor3;
      }
      this.sendSwitchCommand(deviceEUI, switchStates);
      console.log('All switches:', switchStates);
    },
    toggleSwitch(state, switchNumber) {
      console.log(`Toggling switch ${switchNumber} to ${state ? 'ON' : 'OFF'}`);

      let switchStates;
      let deviceEUI;

      if (switchNumber <= 8) {
        deviceEUI = '24e124756e049564';
        this.switchStatesOutdoor1[switchNumber - 1] = state;
        switchStates = this.switchStatesOutdoor1;
      } else if (switchNumber <= 16) {
        deviceEUI = '24e124756e049516';
        this.switchStatesOutdoor2[switchNumber - 9] = state;
        switchStates = this.switchStatesOutdoor2;
      } else if (switchNumber <= 19) {
        deviceEUI = '24E124756E049454';
        this.switchStatesOutdoor3[switchNumber - 17] = state;
        switchStates = this.switchStatesOutdoor3;
      }

      this.sendSwitchCommand(deviceEUI, switchStates);
      console.log(`Switch ${switchNumber} toggled to ${state ? 'ON' : 'OFF'}`);
    },
    testValveOperation() {
      // This method simulates turning on all valves for 20 minutes
      console.log('Starting test valve operation...');
      
      this.setAllSwitches(true, '24e124756e049564');
      this.setAllSwitches(true, '24e124756e049516');
      this.setAllSwitches(true, '24E124756E049454');

      setTimeout(() => {
        console.log('Turning off all valves after 20 minutes...');
        this.setAllSwitches(false, '24e124756e049564');
        this.setAllSwitches(false, '24e124756e049516');
        this.setAllSwitches(false, '24E124756E049454');
      }, 20 * 60 * 1000); // 20 minutes in milliseconds
    }
  },
  mounted() {
    // Schedule automatic valve operation at 7AM and 1PM
    const scheduleTimes = [
      { hour: 7, minute: 0 },
      { hour: 13, minute: 0 }
    ];

    scheduleTimes.forEach(schedule => {
      const now = new Date();
      const targetTime = new Date();
      targetTime.setHours(schedule.hour, schedule.minute, 0, 0);

      if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1); // Set to next day if the time has passed
      }

      const timeUntilOperation = targetTime.getTime() - now.getTime();
      setTimeout(() => {
        this.testValveOperation();
      }, timeUntilOperation);
    });
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.link-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.link-button .btn {
  padding: 10px 20px;
  font-size: 1.25rem;
}

.container-fluid {
  width: 100%;
  min-height: 100vh;
  padding: 0 2rem;
  box-sizing: border-box;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 0;
}

.row {
  display: flex;
  justify-content: space-between;
}

.relation-section,
.map-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 100%;
}

.relation-view-container {
  position: relative;
}

.relation-image,
.map-image {
  width: 100%;
  height: auto;
  transition: transform 0.1s ease-out;
}

.relation-point {
  padding: 5px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  position: relative;
}

.point-number {
  font-size: 0.75rem;
  /* Normal font size */
  text-align: center;
}

.point-label {
  font-size: 0.5rem;
  /* Smaller font size */
  white-space: pre-line;
  /* Allows line breaks */
  text-align: center;
}

.point-label-break {
  font-size: 0.5rem;
  text-align: center;
  white-space: pre-wrap;
}

.value-tooltip {
  position: absolute;
  transform: translate(-50%, -50%);
  /* Center and position above */
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 12px;
}

.adjust-button-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.map-container {
  overflow: hidden;
  height: 100%;
  position: relative;
}

.icon-container {
  position: relative;
  cursor: pointer;
}

.icon-image {
  width: 24px;
  height: 24px;
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

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

/* Centering Tabs */
.nav-tabs {
  justify-content: center;
}

/* Modal and Buttons */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal.d-block {
  display: block;
}

.modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  width: 500px;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.modal-header .btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body .btn {
  margin: 10px;
}

/* Positioning Buttons on Floorplan */
.outdoor-buttons.top-left {
  top: 10px;
  left: 10px;
}

.outdoor-buttons.top-right {
  top: 10px;
  right: 10px;
}

.outdoor-buttons.bottom-left {
  bottom: 45px;
  left: 10px;
}

.outdoor-buttons {
  display: flex;
  flex-direction: column;
}
</style>

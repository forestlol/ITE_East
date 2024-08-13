<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Energy Management System</h2>
    <div class="row">
      <div class="col-md-8">
        <div class="view-container">
          <h4 class="text-center mb-4">Overview</h4>
          <div class="image-container">
            <button v-if="currentImageIndex !== 0" @click="goToMainImage" class="back-button btn btn-secondary">Back to Main</button>
            <img :src="currentImage" alt="Smart Energy Overview" class="img-fluid" @click="handleImageClick">
            <div class="boxes-overlay">
              <div v-for="(box, index) in currentBoxes" :key="index" class="box"
                :class="{ 'disable-hover': box.label === 'B05-11/12' }" :style="{ top: box.top, left: box.left }"
                @mouseover="box.label !== 'B05-11/12' && showPopup(box, $event)"
                @mouseleave="box.label !== 'B05-11/12' && hidePopup()"
                @click="handleBoxClick(index)">
                <p>{{ box.label !== 'B05-11/12' ? box.label : '' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="chart-wrapper">
          <h4 class="text-center mb-4">Chart</h4>
          <ChartComponent :data="chartData"></ChartComponent>
        </div>
      </div>
    </div>
    <div class="link-button mt-4">
      <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
    </div>
    <div v-if="popupVisible" class="popup" :style="{ top: popupY + 'px', left: popupX + 'px' }">
      <p><strong>MeterSN:</strong> {{ popupData.meterSN || 'N/A' }}</p>
      <p><strong>Meter: </strong>{{ popupData.meterName || 'N/A' }}</p>
      <p><strong>Status: </strong>{{ popupData.meterStatus || 'N/A' }}</p>
      <p><strong>Channel: </strong>{{ popupData.ch || 'N/A' }}</p>
      <p><strong>Voltage: </strong>{{ popupData.ua || 'N/A' }} V</p>
      <p><strong>Current: </strong>{{ popupData.ia || 'N/A' }} A</p>
      <p><strong>Active Power: </strong>{{ popupData.p || 'N/A' }} kW</p>
      <p><strong>Reactive Power: </strong>{{ popupData.q || 'N/A' }} kVAR</p>
      <p><strong>Power Factor: </strong>{{ popupData.pf || 'N/A' }}</p>
      <p><strong>Import Energy: </strong>{{ popupData.epi || 'N/A' }} kWh</p>
      <p><strong>Export Energy: </strong>{{ popupData.epe || 'N/A' }} kWh</p>
      <p><strong>Energy Quality Level: </strong>{{ popupData.eql || 'N/A' }}</p>
      <p><strong>Energy Quality Count: </strong>{{ popupData.eqc || 'N/A' }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ChartComponent from '@/components/ChartComponent.vue';
import OverviewImage from '@/assets/SmartEnergyMain.jpg';
import B0511_12 from '@/assets/Smart energy.jpeg';

export default {
  name: 'PowerMeterReadingPage',
  components: {
    ChartComponent
  },
  data() {
    return {
      currentImageIndex: 0,
      images: [
        OverviewImage,
        B0511_12
      ],
      boxes: [],
      popupVisible: false,
      popupData: {
        meterSN: '',
        meterName: '',
        meterStatus: '',
        ch: '',
        ua: '',
        ia: '',
        p: '',
        q: '',
        pf: '',
        epi: '',
        epe: '',
        eql: '',
        eqc: ''
      },
      popupX: 0,
      popupY: 0,
      chartData: [],
      floorSelectionBoxes: [
        { label: 'B05-11/12', top: '168px', left: '50px' }
      ]
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentImageIndex];
    },
    currentBoxes() {
      return this.currentImageIndex === 0 ? this.floorSelectionBoxes : this.boxes;
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Mqtt/data/latest');
        this.boxes = [
          { label: ' ', data: response.data[0] || {}, top: '168px', left: '50px' },
          { label: ' ', data: response.data[1] || {}, top: '168px', left: '114px' },
          { label: ' ', data: response.data[2] || {}, top: '168px', left: '178px' },
          { label: ' ', data: response.data[3] || {}, top: '168px', left: '239px' },
          { label: ' ', data: response.data[4] || {}, top: '168px', left: '300px' },
          { label: ' ', data: response.data[5] || {}, top: '168px', left: '364px' },
          { label: ' ', data: response.data[6] || {}, top: '168px', left: '427px' },
          { label: ' ', data: response.data[7] || {}, top: '168px', left: '488px' },
          { label: ' ', data: response.data[8] || {}, top: '168px', left: '549px' },
          { label: ' ', data: response.data[9] || {}, top: '168px', left: '610px' },
          { label: ' ', data: response.data[10] || {}, top: '238px', left: '50px' },
          { label: ' ', data: response.data[11] || {}, top: '238px', left: '114px' },
          { label: ' ', data: response.data[12] || {}, top: '238px', left: '178px' },
          { label: ' ', data: response.data[13] || {}, top: '238px', left: '239px' },
          { label: ' ', data: response.data[14] || {}, top: '238px', left: '300px' },
          { label: ' ', data: response.data[15] || {}, top: '238px', left: '364px' },
          { label: ' ', data: response.data[16] || {}, top: '238px', left: '427px' },
          { label: ' ', data: response.data[17] || {}, top: '238px', left: '488px' },
          { label: ' ', data: response.data[18] || {}, top: '238px', left: '549px' },
          { label: ' ', data: response.data[19] || {}, top: '238px', left: '610px' },
          { label: ' ', data: response.data[20] || {}, top: '311px', left: '50px' },
          { label: ' ', data: response.data[21] || {}, top: '311px', left: '114px' },
          { label: ' ', data: response.data[22] || {}, top: '311px', left: '178px' },
          { label: ' ', data: response.data[23] || {}, top: '311px', left: '239px' },
          { label: ' ', data: response.data[24] || {}, top: '311px', left: '300px' },
          { label: ' ', data: response.data[25] || {}, top: '311px', left: '364px' },
          { label: ' ', data: response.data[26] || {}, top: '311px', left: '427px' },
          { label: ' ', data: response.data[27] || {}, top: '311px', left: '488px' },
        ];
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    showPopup(box, event) {
      if (box.label !== 'B05-11/12') {
        this.popupData = box.data || {};
        this.popupX = event.clientX + 15;  // Slight offset to the right of the mouse pointer
        this.popupY = event.clientY + 15;  // Slight offset below the mouse pointer
        this.popupVisible = true;
      }
    },
    hidePopup() {
      this.popupVisible = false;
    },
    updateChart(box) {
      this.chartData = [
        { label: 'Voltage', value: box.data.ua },
        { label: 'Current', value: box.data.ia },
        { label: 'Power', value: box.data.p },
        // Add more data points as needed
      ];
    },
    navigateTo3DLandscape() {
      window.location.href = "https://visualizer-lite-html.vercel.app/?site=23&levels=94";
    },
    goToMainImage() {
      this.currentImageIndex = 0;
    },
    handleBoxClick(index) {
      // Handle navigation for B05-11/12 box
      if (this.currentImageIndex === 0 && this.floorSelectionBoxes[index].label === 'B05-11/12') {
        this.currentImageIndex = 1;
        this.fetchData(); // Fetch data for the next image
      }
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.container-fluid {
  max-width: 1200px;
  min-height: 100vh;
}

.view-container {
  display: flex;
  flex-direction: column;
  /* Ensures the content stacks vertically */
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.image-container {
  position: relative;
  width: 100%;
}

.image-container img {
  max-width: 100%;
  /* Adjust as needed */
  height: auto;
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.link-button {
  display: flex;
  justify-content: left;
  width: 100%;
  margin-top: 20px;
}

.back-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.box.disable-hover {
  cursor: pointer; /* Ensure cursor changes on hover */
  pointer-events: auto; /* Enable click on the box */
}

.boxes-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Allows clicks to pass through */
}

.box {
  position: absolute;
  width: 55px;
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  /* Allows clicks on the boxes */
}

.popup {
  position: fixed;
  background-color: #333;
  color: #fff;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 250px;
  /* Adjust as needed */
}

.popup p {
  margin: 5px 0;
}
</style>

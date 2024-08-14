<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Energy Management System</h2>
    <div class="row">
      <div class="col-md-8">
        <div class="view-container">
          <h4 class="text-center mb-4">Overview</h4>
          <div class="grid-container">
            <img :src="currentImage" alt="Smart Energy Overview" class="grid-image">
            <div class="total-active-power" :style="{ top: '39%', left: '17%' }">
              <p style="font-size: 0.7rem;">Total Active Power: <br> {{ totalActivePower }} kW</p>
            </div>
            <div class="boxes-overlay">
              <div v-for="(box, index) in currentBoxes" :key="index" 
                   :class="['box', currentImageIndex === 0 ? 'first-page-box' : 'second-page-box']"
                   :style="{ top: box.top, left: box.left }"
                   @mouseover="box.label !== 'B05-11/12' && showPopup(box, $event)"
                   @mouseleave="hidePopup()"
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
      totalActivePower: null, // New data property for total active power
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
        { label: 'B05-11/12', top: '6%', left: '17%', totalVoltage: 'N/A', totalConsumption: 'N/A', month: 'N/A' }
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
        
        let totalVoltage = 0;
        let totalConsumption = 0;
        let totalActivePower = 0; // Variable to calculate total active power

        this.boxes = response.data.map((item, index) => {
          const position = this.getBoxPosition(index);

          if (!position) {
            console.error(`No position found for index ${index}`);
            return null; // Skip this box if no position is found
          }

          totalVoltage += item.ua || 0;  // Assuming 'ua' is the voltage key
          totalConsumption += item.epi || 0;  // Assuming 'epi' is the consumption key
          totalActivePower += Math.abs(item.p || 0); // Using Math.abs to ensure positive active power

          return {
            label: ' ',
            data: item,
            top: position.top,
            left: position.left,
            totalVoltage: item.totalVoltage || 'N/A',
            month: item.month || 'N/A',
            totalConsumption: item.totalConsumption || 'N/A'
          };
        }).filter(box => box !== null);

        const month = response.data.length > 0 ? response.data[0].month : 'N/A';

        this.floorSelectionBoxes[0].totalVoltage = totalVoltage.toFixed(2);
        this.floorSelectionBoxes[0].totalConsumption = totalConsumption.toFixed(2);
        this.floorSelectionBoxes[0].month = month;

        // Save the calculated total active power as an absolute value
        this.totalActivePower = totalActivePower.toFixed(2);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    getBoxPosition(index) {
      const positions = [
        { top: '168px', left: '50px' },
        { top: '168px', left: '114px' },
        { top: '168px', left: '178px' },
        { top: '168px', left: '239px' },
        { top: '168px', left: '300px' },
        { top: '168px', left: '364px' },
        { top: '168px', left: '427px' },
        { top: '168px', left: '488px' },
        { top: '168px', left: '549px' },
        { top: '168px', left: '610px' },
        { top: '238px', left: '50px' },
        { top: '238px', left: '114px' },
        { top: '238px', left: '178px' },
        { top: '238px', left: '239px' },
        { top: '238px', left: '300px' },
        { top: '238px', left: '364px' },
        { top: '238px', left: '427px' },
        { top: '238px', left: '488px' },
        { top: '238px', left: '549px' },
        { top: '238px', left: '610px' },
        { top: '311px', left: '50px' },
        { top: '311px', left: '114px' },
        { top: '311px', left: '178px' },
        { top: '311px', left: '239px' },
        { top: '311px', left: '300px' },
        { top: '311px', left: '364px' },
        { top: '311px', left: '427px' },
        { top: '311px', left: '488px' },
      ];

      if (index >= positions.length) {
        console.warn(`Index ${index} exceeds positions array length`);
        return null;
      }

      return positions[index];
    },

    showPopup(box, event) {
      if (box.label !== 'B05-11/12') {
        this.popupData = box.data || {};
        this.popupX = event.clientX + 15;
        this.popupY = event.clientY + 15;
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
      ];
    },

    navigateTo3DLandscape() {
      window.location.href = "https://visualizer-lite-html.vercel.app/?site=23&levels=94";
    },

    goToMainImage() {
      this.currentImageIndex = 0;
    },

    handleBoxClick(index) {
      if (this.currentImageIndex === 0 && this.floorSelectionBoxes[index].label === 'B05-11/12') {
        this.currentImageIndex = 1;
        this.fetchData();
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
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.grid-container {
  position: relative;
  width: 100%;
}

.grid-image {
  max-width: 100%;
  height: auto;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.grid-line.horizontal {
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
}

.grid-line.vertical {
  height: 100%;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  position: absolute;
}

.total-active-power {
  position: absolute;
  padding: 5px;
  border-radius: 3px;
  text-align: center;
  font-weight: bold;
  color: black;
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
  cursor: pointer;
  pointer-events: auto;
}

.boxes-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.box {
  position: absolute;
  width: 8%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
}

.first-page-box {
  width: 15%;  /* Adjust this size for the first page */
  height: 43%;
}

.second-page-box {
  width: 8%;  /* Original size for the second page */
  height: 15%;
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
}

.popup p {
  margin: 5px 0;
}

.box img {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.box p {
  margin: 0;
  font-size: 12px;
  text-align: center;
}
</style>

<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Smart Energy Management System</h2>
    <div class="view-container">
      <h4 class="text-center mb-4">Overview</h4>
      <div class="grid-container">
        <img :src="currentImage" alt="Smart Energy Overview" class="grid-image">
        <button v-if="currentImageIndex !== 0" @click="goToMainImage" class="back-button btn btn-secondary">Back to
          Main</button>

        <!-- Total Active Power hover -->
        <div v-if="currentImageIndex === 0" class="total-active-power" :style="{ top: '39%', left: '25.6%' }">
          <div class="grid-container-active-power">
            <div class="power-item">
              <p>Total Power:</p>
              <p>{{ totalValues.p }} kW</p>
            </div>
            <div class="power-item">
              <p>Total Current:</p>
              <p>{{ totalValues.ia }} A</p>
            </div>
            <div class="power-item">
              <p>Total Power Factor:</p>
              <p>{{ totalValues.pf }}</p>
            </div>
            <div class="power-item">
              <p>Total Voltage:</p>
              <p>{{ totalValues.ua }} V</p>
            </div>
          </div>
        </div>



        <!-- Boxes overlay for the first page -->
        <div class="boxes-overlay" v-if="currentImageIndex === 0">
          <div v-for="(box, index) in floorSelectionBoxes" :key="index" :class="['box', 'first-page-box']"
            :style="{ top: box.top, left: box.left }" @click="handleBoxClick(index)" @mouseover="showTotalPopup($event)"
            @mouseleave="hidePopup()">
          </div>
        </div>

        <!-- Boxes overlay for the second page -->
        <div class="boxes-overlay" v-if="currentImageIndex !== 0">
          <div v-for="(box, index) in currentBoxes" :key="index" :class="['box', 'second-page-box']"
            :style="{ top: box.top, left: box.left }" @mouseover="showPopup(box, $event)" @mouseleave="hidePopup()"
            @click="handleBoxClick(index)">
          </div>
        </div>
      </div>
    </div>

    <div class="link-button mt-4">
      <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Energy Management</button>
    </div>

    <!-- Dedicated Popup for Totals -->
    <div v-if="totalPopupVisible" class="popup" :style="{ top: popupY + 'px', left: popupX + 'px' }">
      <p><strong>Import Energy:</strong> {{ totalValues.epi }} kWh</p>
      <p><strong>Export Energy:</strong> {{ totalValues.epe }} kWh</p>
      <p><strong>Energy Quality Count:</strong> {{ totalValues.eqc }}</p>
      <p><strong>Energy Quality Level:</strong> {{ totalValues.eql }}</p>
      <p><strong>Current:</strong> {{ totalValues.ia }} A</p>
      <p><strong>Active Power:</strong> {{ totalValues.p }} kW</p>
      <p><strong>Power Factor:</strong> {{ totalValues.pf }}</p>
      <p><strong>Reactive Power:</strong> {{ totalValues.q }} kVAR</p>
      <p><strong>Voltage:</strong> {{ totalValues.ua }} V</p>
    </div>

    <!-- Original Popup for Page 2 -->
    <div v-if="popupVisible" class="popup" :style="{ top: popupY + 'px', left: popupX + 'px' }">
      <p><strong>Import Energy:</strong> {{ popupData.epi || 0 }} kWh</p>
      <p><strong>Export Energy:</strong> {{ popupData.epe || 0 }} kWh</p>
      <p><strong>Energy Quality Count:</strong> {{ popupData.eqc || 0 }}</p>
      <p><strong>Energy Quality Level:</strong> {{ popupData.eql || 0 }}</p>
      <p><strong>Current:</strong> {{ popupData.ia || 0 }} A</p>
      <p><strong>Active Power:</strong> {{ popupData.p || 0 }} kW</p>
      <p><strong>Power Factor:</strong> {{ popupData.pf || 0 }}</p>
      <p><strong>Reactive Power:</strong> {{ popupData.q || 0 }} kVAR</p>
      <p><strong>Voltage:</strong> {{ popupData.ua || 0 }} V</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PowerMeterReadingPage',
  data() {
    return {
      currentImageIndex: 0,
      images: [
        require('@/assets/SmartEnergyMain.jpg'),
        require('@/assets/Smart energy.jpeg')
      ],
      boxes: [],
      totalValues: {
        ch: 0,
        epe: 0,
        epi: 0,
        eqc: 0,
        eql: 0,
        ia: 0,
        p: 0,
        pf: 0,
        q: 0,
        ua: 0
      },
      popupVisible: false,
      totalPopupVisible: false, // Separate visibility flag for totals popup
      popupData: {
        ch: 0,
        epe: 0,
        epi: 0,
        eqc: 0,
        eql: 0,
        ia: 0,
        p: 0,
        pf: 0,
        q: 0,
        ua: 0
      },
      popupX: 0,
      popupY: 0,
      floorSelectionBoxes: [
        { label: 'B05-11/12', top: '6%', left: '17%' }
      ]
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentImageIndex];
    },
    currentBoxes() {
      if (this.currentImageIndex === 0) {
        return this.floorSelectionBoxes;
      } else {
        return this.boxes.map((box) => ({
          ...box,
          width: '7.5%',  // Add dynamic width for second-page-box
          height: '15%'   // Add dynamic height for second-page-box
        }));
      }
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Mqtt/data/latest');

        this.totalValues = {
          ch: 0,
          epe: 0,
          epi: 0,
          eqc: 0,
          eql: 0,
          ia: 0,
          p: 0,
          pf: 0,
          q: 0,
          ua: 0
        };

        this.boxes = response.data.map((item, index) => {
          const position = this.getBoxPosition(index);

          if (!position) {
            return null;
          }

          this.totalValues.ch += parseFloat(item.ch) || 0;
          this.totalValues.epe += parseFloat(item.epe) || 0;
          this.totalValues.epi += parseFloat(item.epi) || 0;
          this.totalValues.eqc += parseFloat(item.eqc) || 0;
          this.totalValues.eql += parseFloat(item.eql) || 0;
          this.totalValues.ia += parseFloat(item.ia) || 0;
          this.totalValues.p += parseFloat(item.p) || 0;
          this.totalValues.pf += parseFloat(item.pf) || 0;
          this.totalValues.q += parseFloat(item.q) || 0;
          this.totalValues.ua += parseFloat(item.ua) || 0;

          return {
            label: item.meterSN || 'N/A',
            data: {
              ch: parseFloat(item.ch) || 0,
              epe: parseFloat(item.epe) || 0,
              epi: parseFloat(item.epi) || 0,
              eqc: parseFloat(item.eqc) || 0,
              eql: parseFloat(item.eql) || 0,
              ia: parseFloat(item.ia) || 0,
              p: parseFloat(item.p) || 0,
              pf: parseFloat(item.pf) || 0,
              q: parseFloat(item.q) || 0,
              ua: parseFloat(item.ua) || 0
            },
            top: position.top,
            left: position.left
          };
        }).filter(box => box !== null);

        Object.keys(this.totalValues).forEach(key => {
          this.totalValues[key] = parseFloat(this.totalValues[key]).toFixed(2);
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    getBoxPosition(index) {
      const positions = [
        { top: '41%', left: '7%' },
        { top: '41%', left: '16%' },
        { top: '41%', left: '24.5%' },
        { top: '41%', left: '33%' },
        { top: '41%', left: '41.5%' },
        { top: '41%', left: '50%' },
        { top: '41%', left: '59%' },
        { top: '41%', left: '67.5%' },
        { top: '41%', left: '76%' },
        { top: '41%', left: '84%' },
        { top: '58.4%', left: '7%' },
        { top: '58.4%', left: '16%' },
        { top: '58.4%', left: '24.5%' },
        { top: '58.4%', left: '33%' },
        { top: '58.4%', left: '41.5%' },
        { top: '58.4%', left: '50%' },
        { top: '58.4%', left: '59%' },
        { top: '58.4%', left: '67.5%' },
        { top: '58.4%', left: '76%' },
        { top: '58.4%', left: '84%' },
        { top: '76%', left: '7%' },
        { top: '76%', left: '16%' },
        { top: '76%', left: '24.5%' },
        { top: '76%', left: '33%' },
        { top: '76%', left: '41.5%' },
        { top: '76%', left: '50%' },
        { top: '76%', left: '59%' },
        { top: '76%', left: '67.5%' },
      ];

      if (index >= positions.length) {
        console.warn(`Index ${index} exceeds positions array length`);
        return null;
      }

      return positions[index];
    },

    showPopup(box, event) {
      this.popupData = box.data || {};
      this.popupX = event.clientX + 15;
      this.popupY = event.clientY + 15;
      this.popupVisible = true;
    },

    showTotalPopup(event) {
      this.totalPopupVisible = true;
      this.popupX = event.clientX + 15;
      this.popupY = event.clientY + 15;
    },

    hidePopup() {
      this.popupVisible = false;
      this.totalPopupVisible = false;
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
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
}

.grid-container {
  position: relative;
  width: 100%;
}

.grid-image {
  max-width: 100%;
  height: auto;
}

.total-active-power {
  position: absolute;
  border-radius: 3px;
  text-align: center;
  font-weight: bold;
  color: black;
  width: 16%;
  height: 10%;
  transform: translateX(-50%);
}

.grid-container-active-power {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  /* Space between items */
}

.power-item {
  text-align: left;
  font-size: 0.6rem;
  /* Smaller font size to fit the content */
}

.power-item p {
  margin: 0;
  /* Remove margin to save space */
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

/* First-page box styling */
.first-page-box {
  position: absolute;
  width: 15%;
  height: 43%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 20;
}

/* Second-page box styling */
.second-page-box {
  position: absolute;
  width: 7.5%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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

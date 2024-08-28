<template>
  <div class="container-fluid mt-5">
    <h2 class="text-center mb-4">Asset Tagging System</h2>
    <div class="row">
      <div class="col-md-6">
        <div class="relation-section">
          <h4 class="text-center mb-4">Sensor Detection</h4>
          <div class="sensor-detection-diagram position-relative">
            <img src="@/assets/Asset Tagging Algo.png" alt="Relation View" class="relation-image">
            <button class="btn btn-primary position-absolute bottom-0 end-0 m-3" @click="openModal">Adjust Condition</button>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="out-of-range-section">
          <h4 class="text-center mb-4">Out of Range</h4>
          <ul class="out-of-range-list">
            <li v-for="tag in outOfRangeTags" :key="tag.mac" class="out-of-range-item">
              <span class="tag-name">{{ tag.mac }}</span> - 
              <span class="tag-updated">{{ formatDate(tag.lastUpdated) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="condition mt-4 text-center">
      <select v-model="selectedCondition" class="form-control mt-3">
        <option disabled>Conditions</option>
        <option v-for="(condition, index) in conditions" :key="index" :value="condition">
          {{ condition }}
        </option>
      </select>
    </div>
    <!-- Modal for adjusting BLE Beacon settings -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal"></div>
    <div v-if="showModal" class="modal d-block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Adjust Conditions</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="condition-input">
              <label>BLE Beacon 1</label>
              <select v-model="bleBeacon1Status" class="form-control">
                <option value="On">On</option>
                <option value="Off">Off</option>
              </select>
            </div>
            <div class="condition-input">
              <label>BLE Beacon 2</label>
              <select v-model="bleBeacon2Status" class="form-control">
                <option value="On">On</option>
                <option value="Off">Off</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            <button type="button" class="btn btn-primary" @click="saveConditions">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AssetTaggingSystem',
  data() {
    return {
      devices: [
        { mac: 'fce8c0426458', type: 'BLE Beacon', isOnline: true, lastUpdated: new Date() }
      ],
      outOfRangeTags: [],
      showModal: false,
      bleBeacon1Status: 'On',
      bleBeacon2Status: 'On',
      conditions: [
        "If BLE Beacon 1 and Beacon 2 are on, BLE Tags are able to detect within range.",
        "If BLE Beacon 1 is off, BLE Tags cannot be detected.",
        "If BLE Beacon 2 is off, BLE Tags cannot be detected.",
        "If both BLE Beacons are off, BLE Tags cannot be detected."
      ],
      selectedCondition: "If BLE Beacon 1 and Beacon 2 are on, BLE Tags are able to detect within range."
    };
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveConditions() {
      alert(`BLE Beacon 1: ${this.bleBeacon1Status}, BLE Beacon 2: ${this.bleBeacon2Status}`);
      this.closeModal();
    },
    fetchData() {
      // Your existing fetch logic
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
  mounted() {
    this.fetchData();
    this.interval = setInterval(this.fetchData, 10000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
};
</script>
<style scoped>
.container-fluid {
  width: 100%;
  padding: 2rem;
}

h2 {
  font-size: 2rem;
  font-weight: bold;
}

.relation-section,
.out-of-range-section {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 100%;
}

.sensor-detection-diagram {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  overflow: hidden;
}

.relation-image {
  max-width: 100%;
  max-height: 100%;
}

.out-of-range-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.out-of-range-item {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.tag-name {
  font-weight: bold;
}

.condition p {
  font-size: 1.2rem;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  display: none;
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

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px 20px;
}

.modal-footer {
  padding-top: 10px;
}

.btn-close {
  border: none;
  background: none;
}

.condition-input {
  margin-bottom: 10px;
}
</style>

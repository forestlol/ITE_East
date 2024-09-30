<template>
    <div class="container">
        <h2 class="text-center mb-4">SMART LANDSCAPE [B05]</h2>

        <!-- First Row: Sensor Data and Chart -->
        <div class="row">
            <!-- Sensor Data Section -->
            <div class="col-lg-6 section-container">
                <h3 class="section-title">Sensor Data</h3>
                <div class="sensor-grid">
                    <div class="sensor-box" v-for="(sensor, key) in sensorData" :key="key">
                        <p><b>{{ key.toUpperCase() }}:</b></p>
                        <p>{{ sensor }} {{ getUnit(key) }}</p>
                        <div class="face-indicator">
                            <i :class="getFaceClass(sensor, key)" class="face-icon"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="col-lg-6 section-container chart-container">
                <div class="chart-box">
                    <h3 class="section-title">KWH Daily Consumption</h3>
                    <canvas id="kwhChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Second Row: Floorplan and Console Control -->
        <div class="row mt-4">
            <!-- Floorplan Section - 80% width -->
            <div class="col-lg-8 section-container">
                <h3 class="section-title">Room Layout</h3>
                <div class="floorplan-container position-relative">
                    <div class="floorplan-image-container">
                        <img :src="floorplanImage" alt="Floorplan for B05-13/14" class="floorplan-image" />

                        <!-- Icons for devices (Main Pump, Dosage Pump, Planter Pots) -->
                        <div v-for="(icon, index) in icons" :key="index" class="icon-container"
                            :style="{ top: icon.y + '%', left: icon.x + '%', position: 'absolute', transform: 'translate(-50%, -50%)' }"
                            @click="openIconModal(icon)">
                            <img :src="icon.src" alt="Icon" class="icon-image" />
                            <div :class="['status-dot', icon.isOn ? 'online' : 'offline']"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Console Control Section - 20% width -->
            <div class="col-lg-4 section-container">
                <h3 class="section-title">Console Control</h3>
                <div class="console-box">
                    <!-- ALL ON/OFF Toggle -->
                    <div class="toggle-switch">
                        <input type="checkbox" id="allValvesToggle" v-model="areAllValvesOn" @change="toggleAllValves">
                        <label for="allValvesToggle">{{ areAllValvesOn ? 'ALL VALVES OFF' : 'ALL VALVES ON' }}</label>
                    </div>

                    <!-- Individual Valves Sliders: Main Pump, Dosage Pump -->
                    <div class="toggle-switch">
                        <input type="checkbox" id="mainPumpToggle" v-model="isMainPumpOn" @change="toggleMainPump">
                        <label for="mainPumpToggle">Main Pump (Valve 1)</label>
                    </div>
                    <div class="toggle-switch">
                        <input type="checkbox" id="dosagePumpToggle" v-model="isDosagePumpOn" @change="toggleDosagePump">
                        <label for="dosagePumpToggle">Dosage Pump (Valve 19)</label>
                    </div>

                    <!-- Planter Pots Valves (Moved to the right side) -->
                    <div class="valves-section">
                        <h3 class="section-title">Planter Pots Valves</h3>
                        <div class="toggle-switch" v-for="(icon, index) in icons.slice(2)" :key="index">
                            <input type="checkbox" :id="'valveToggle' + (icon.switchNumber - 1)" v-model="icon.isOn"
                                @change="toggleIndividualValve(icon.switchNumber)">
                            <label :for="'valveToggle' + (icon.switchNumber - 1)">{{ icon.name }} (Valve {{ icon.switchNumber }})</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showIconModal" class="modal-overlay" @click="closeIconModal"></div>
        <div v-if="showIconModal" class="modal d-block" style="z-index: 1050;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header justify-content-center">
                        <!-- Display the active icon's name -->
                        <h5 class="modal-title">{{ activeIcon ? activeIcon.name : 'Sensor' }}</h5>
                        <button type="button" class="btn-close position-absolute top-0 end-0"
                            @click="closeIconModal">&times;</button>
                    </div>
                    <div class="modal-body text-center">
                        <!-- Slider toggle to turn the sensor on/off -->
                        <label class="switch">
                            <input type="checkbox" v-model="activeIcon.isOn"
                                @change="toggleSwitchInModal(activeIcon.isOn, activeIcon)">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import mainPumpIcon from '@/assets/main-pump-icon.png';
import dosagePumpIcon from '@/assets/dosage-pump-icon.png';
import planterPotIcon from '@/assets/planter-pot-icon.png';

export default {
    data() {
        return {
            sensorData: {
                co2: null,
                temperature: null,
                humidity: null,
                pm2_5: null,
                pm10: null
            },
            isMainPumpOn: false,
            areAllValvesOn: false,
            isDosagePumpOn: false,
            areAllPumpsOn: false,
            switchStatesOutdoor1: Array(8).fill(false), // Initialize the array with 8 switches set to false
            switchStatesOutdoor2: Array(8).fill(false), // Initialize the array for the second device
            switchStatesOutdoor3: Array(3).fill(false), // Initialize the array for the third device
            floorplanImage: require('@/assets/Sub System and Icons/V2/smart Landscape system_full.png'),
            icons: [
                { x: 84.5, y: 32.6, src: mainPumpIcon, name: 'Main Pump', switchNumber: 1, isOn: false },
                { x: 88, y: 32, src: dosagePumpIcon, name: 'Dosage Pump', switchNumber: 19, isOn: false },
                { x: 91, y: 34.5, src: planterPotIcon, name: 'Planter Pot 1', switchNumber: 2, isOn: false },
                { x: 88, y: 38.5, src: planterPotIcon, name: 'Planter Pot 2', switchNumber: 3, isOn: false },
                { x: 83, y: 45, src: planterPotIcon, name: 'Planter Pot 3', switchNumber: 4, isOn: false },
                { x: 82.5, y: 35, src: planterPotIcon, name: 'Planter Pot 4', switchNumber: 5, isOn: false },
                { x: 72, y: 42, src: planterPotIcon, name: 'Planter Pot 5', switchNumber: 6, isOn: false },
                { x: 72, y: 50, src: planterPotIcon, name: 'Planter Pot 6', switchNumber: 7, isOn: false },
                { x: 65.3, y: 51, src: planterPotIcon, name: 'Planter Pot 7', switchNumber: 8, isOn: false },
                { x: 28.5, y: 46, src: planterPotIcon, name: 'Planter Pot 8', switchNumber: 9, isOn: false },
                { x: 18.5, y: 50, src: planterPotIcon, name: 'Planter Pot 9', switchNumber: 10, isOn: false },
                { x: 18, y: 36, src: planterPotIcon, name: 'Planter Pot 10', switchNumber: 11, isOn: false },
                { x: 8.6, y: 50, src: planterPotIcon, name: 'Planter Pot 11', switchNumber: 12, isOn: false },
                { x: 9.4, y: 37.3, src: planterPotIcon, name: 'Planter Pot 12', switchNumber: 13, isOn: false },
                { x: 4.5, y: 33, src: planterPotIcon, name: 'Planter Pot 13', switchNumber: 14, isOn: false },
                { x: 19.5, y: 28.5, src: planterPotIcon, name: 'Planter Pot 14', switchNumber: 15, isOn: false },
                { x: 34, y: 29.3, src: planterPotIcon, name: 'Planter Pot 15', switchNumber: 16, isOn: false },
                { x: 53, y: 29, src: planterPotIcon, name: 'Planter Pot 16', switchNumber: 17, isOn: false },
                { x: 71.5, y: 29, src: planterPotIcon, name: 'Planter Pot 17', switchNumber: 18, isOn: false },
            ],
            showIconModal: false,
            activeIcon: null
        };
    },
    methods: {
        getUnit(key) {
            const units = {
                co2: 'ppm',
                temperature: '°C',
                humidity: '%',
                pm2_5: 'µg/m³',
                pm10: 'µg/m³'
            };
            return units[key] || '';
        },
        toggleIndividualValve(switchNumber) {
            const deviceEUI = this.getDeviceEUI(switchNumber);
            let switchStates = this.getSwitchStates(deviceEUI);

            // Update the correct switch index
            const index = switchNumber - 1;
            switchStates[index] = this.icons[index].isOn;

            this.sendSwitchCommand(deviceEUI, switchStates);
        },
        getDeviceEUI(switchNumber) {
            if (switchNumber <= 8) return '24e124756e049564';
            else if (switchNumber <= 16) return '24e124756e049516';
            else return '24E124756E049454';
        },
        getSwitchStates(deviceEUI) {
            if (deviceEUI === '24e124756e049564') return this.switchStatesOutdoor1;
            else if (deviceEUI === '24e124756e049516') return this.switchStatesOutdoor2;
            else return this.switchStatesOutdoor3;
        },
        async fetchSensorData() {
            try {
                const response = await axios.get("https://hammerhead-app-kva7n.ondigitalocean.app/api/Lorawan/latest/sheet/IAQ");
                const data = response.data["24e124710d481996"];
                this.sensorData.co2 = data.co2;
                this.sensorData.temperature = data.temperature;
                this.sensorData.humidity = data.humidity;
                this.sensorData.pm2_5 = data.pm2_5;
                this.sensorData.pm10 = data.pm10;
            } catch (error) {
                console.error("Error fetching sensor data:", error);
            }
        },
        getFaceClass(value, type) {
            let thresholds = {
                co2: 1000,
                temperature: 25,
                humidity: 70,
                pm2_5: 35,
                pm10: 50
            };
            return value > thresholds[type] ? "fas fa-frown text-danger" : "fas fa-smile text-success";
        },
        generateChart() {
            Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);
            const ctx = document.getElementById("kwhChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                    datasets: [
                        {
                            label: "KWH Consumption",
                            data: [30, 35, 32, 40, 42, 39, 52, 55, 52, 52, 62, 44, 55, 52, 64, 63, 65, 54, 52, 54, 55, 52, 50, 48],
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, title: { text: "KWH", color: "white" }, ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.1)" } },
                        x: { title: { text: "Hour (0-24)", color: "white" }, ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.1)" } }
                    }
                }
            });
        },
        async sendSwitchCommand(deviceEUI, switchStates) {
            const url = `https://hammerhead-app-kva7n.ondigitalocean.app/command/ws558`;
            const payload = {
                deviceEui: deviceEUI,
                switchStates: switchStates.map((state) => (state ? 1 : 0)),
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
        toggleMainPump() {
            // Toggle Main Pump (Switch 1 on device 24e124756e049564)
            this.setAllSwitches(this.isMainPumpOn, '24e124756e049564', 1, 1);
        },
        toggleAllValves() {
            // Toggle All Valves (Switches 2-18 across three devices)
            this.setAllSwitches(this.areAllValvesOn, '24e124756e049564', 2, 8);
            this.setAllSwitches(this.areAllValvesOn, '24e124756e049516', 9, 16);
            this.setAllSwitches(this.areAllValvesOn, '24E124756E049454', 17, 18);
        },
        toggleDosagePump() {
            // Set the entire array to 1 for ON or 0 for OFF
            const switchStates = Array(8).fill(this.isDosagePumpOn ? 1 : 0);

            // Send switch command with the full array of 8 elements for the Dosage Pump
            this.sendSwitchCommand('24E124756E049454', switchStates);

            // Update the icon state for Dosage Pump (assuming it's at position 19 in your array of icons)
            this.icons.forEach(icon => {
                if (icon.switchNumber === 19) {
                    icon.isOn = this.isDosagePumpOn;
                }
            });
        },

        toggleAllPumps() {
            this.areAllPumpsOn = !this.areAllPumpsOn;
            this.toggleMainPump();
            this.toggleDosagePump();
        },

        setAllSwitches(state, deviceEUI, startSwitch, endSwitch) {
            let switchStates = [];

            if (deviceEUI === '24e124756e049564') {
                this.switchStatesOutdoor1 = this.switchStatesOutdoor1.map((_, index) =>
                    index + 1 >= startSwitch && index + 1 <= endSwitch ? state : this.switchStatesOutdoor1[index]
                );
                switchStates = this.switchStatesOutdoor1;
            } else if (deviceEUI === '24e124756e049516') {
                this.switchStatesOutdoor2 = this.switchStatesOutdoor2.map((_, index) =>
                    index + 9 >= startSwitch && index + 9 <= endSwitch ? state : this.switchStatesOutdoor2[index]
                );
                switchStates = this.switchStatesOutdoor2;
            } else if (deviceEUI === '24E124756E049454') {
                this.switchStatesOutdoor3 = this.switchStatesOutdoor3.map((_, index) =>
                    index + 17 >= startSwitch && index + 17 <= endSwitch ? state : this.switchStatesOutdoor3[index]
                );
                switchStates = this.switchStatesOutdoor3;
            }

            // Send the switch command based on the updated states
            this.sendSwitchCommand(deviceEUI, switchStates);

            // Update the icon statuses based on the range of switches
            this.icons.forEach(icon => {
                if (icon.switchNumber >= startSwitch && icon.switchNumber <= endSwitch) {
                    icon.isOn = state;
                }
            });

            // Update the status of Solenoid Valves in relationPoints (if applicable)
            if (this.relationPoints) {
                this.relationPoints.forEach(point => {
                    if (point.type === 'Valve' && point.label >= startSwitch && point.label <= endSwitch) {
                        point.status = state ? 'On' : 'Off';
                    }
                });
            }
        },

        toggleSwitchInModal(state, icon) {
            icon.isOn = state;
            let switchStates, deviceEUI;
            if (icon.switchNumber <= 8) {
                deviceEUI = "24e124756e049564";
                switchStates = new Array(8).fill(icon.isOn);
            } else if (icon.switchNumber <= 16) {
                deviceEUI = "24e124756e049516";
                switchStates = new Array(8).fill(icon.isOn);
            } else if (icon.switchNumber <= 19) {
                deviceEUI = "24E124756E049454";
                switchStates = new Array(8).fill(icon.isOn);
            }
            this.sendSwitchCommand(deviceEUI, switchStates);
            this.closeIconModal();
        },
        openIconModal(icon) {
            this.activeIcon = icon;
            this.showIconModal = true;
        },
        closeIconModal() {
            this.showIconModal = false;
        }
    },
    mounted() {
        this.fetchSensorData();
        this.generateChart();
    }
};
</script>

<style scoped>
/* Add your styles here */
.container {
    width: 100%;
    padding: 20px;
}

.text-center {
    text-align: center;
}

.section-container {
    margin-bottom: 30px;
}

.section-title {
    text-align: center;
    margin-bottom: 20px;
    color: white;
    font-weight: bold;
}

.sensor-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.sensor-box {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 15px;
    text-align: center;
}

.face-indicator {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.face-icon {
    font-size: 1.5rem;
}

.floorplan-container {
    text-align: center;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
}

.floorplan-image-container {
    width: 100%;
    height: auto;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 10px;
    display: flex;
    justify-content: center;
}

.floorplan-image {
    width: 100%;
    border-radius: 5px;
}

.chart-box,
.console-box {
    border-radius: 5px;
    padding: 15px;
    text-align: center;
}

.chart-box {
    height: 300px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}

.text-success {
    color: green;
}

.text-danger {
    color: red;
}

.row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.section-container {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 30px;
    flex: 1;
}

.toggle-switch {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.toggle-switch input[type="checkbox"] {
    width: 40px;
    height: 20px;
    appearance: none;
    background: #ddd;
    border-radius: 20px;
    position: relative;
    outline: none;
    cursor: pointer;
    transition: background 0.3s ease;
}

.toggle-switch input[type="checkbox"]:checked {
    background: green;
}

.toggle-switch input[type="checkbox"]:before {
    content: "";
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 1px;
    left: 1px;
    transition: transform 0.3s ease;
}

.toggle-switch input[type="checkbox"]:checked:before {
    transform: translateX(20px);
}

.toggle-switch label {
    margin-left: 10px;
    font-size: 1rem;
    cursor: pointer;
}

.icon-container {
    position: relative;
}

.icon-image {
    width: 24px;
    height: 24px;
    visibility: hidden;
}

.status-dot {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.online {
    background-color: green;
}

.offline {
    background-color: red;
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

.modal.d-block {
    display: block;
}

.modal-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    color: black;
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

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
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
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: green;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

.valves-section {
    margin-top: 20px;
}

@media (min-width: 1400px) {

.container,
.container-lg,
.container-md,
.container-sm,
.container-xl,
.container-xxl {
    max-width: 99%;
}
}
</style>

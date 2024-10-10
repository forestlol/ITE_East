<template>
    <div class="container">
        <h2 class="text-center mb-4">INTEGRATED OPERATION CENTRE [B05-11]</h2>

        <!-- First Row: Sensor Data and Chart -->
        <div class="row">
            <!-- Sensor Data Section -->
            <div class="col-lg-6 section-container">
                <h3 class="section-title">Sensor Data</h3>
                <div class="sensor-grid">
                    <div class="sensor-box">
                        <p><b>CO2:</b></p>
                        <p>{{ sensorData.co2 }} ppm</p>
                        <div class="face-indicator">
                            <i :class="getFaceClass(sensorData.co2, 'co2')" class="face-icon"></i>
                        </div>
                    </div>
                    <div class="sensor-box">
                        <p><b>Temperature:</b></p>
                        <p>{{ sensorData.temperature }}°C</p>
                        <div class="face-indicator">
                            <i :class="getFaceClass(sensorData.temperature, 'temperature')" class="face-icon"></i>
                        </div>
                    </div>
                    <div class="sensor-box">
                        <p><b>Humidity:</b></p>
                        <p>{{ sensorData.humidity }}%</p>
                        <div class="face-indicator">
                            <i :class="getFaceClass(sensorData.humidity, 'humidity')" class="face-icon"></i>
                        </div>
                    </div>
                    <div class="sensor-box">
                        <p><b>PM2.5:</b></p>
                        <p>{{ sensorData.pm2_5 }} µg/m³</p>
                        <div class="face-indicator">
                            <i :class="getFaceClass(sensorData.pm2_5, 'pm2_5')" class="face-icon"></i>
                        </div>
                    </div>
                    <div class="sensor-box">
                        <p><b>PM10:</b></p>
                        <p>{{ sensorData.pm10 }} µg/m³</p>
                        <div class="face-indicator">
                            <i :class="getFaceClass(sensorData.pm10, 'pm10')" class="face-icon"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="col-lg-6 section-container chart-container" style="width: 48%;">
                <div class="chart-box">
                    <h3 class="section-title">KWH Daily Consumption</h3>
                    <canvas id="kwhChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Second Row: Floorplan and Console Control -->
        <div class="row mt-4">
            <!-- Floorplan Section - 80% width -->
            <div class="col-lg-8 section-container" style="width: 64%;">
                <h3 class="section-title">Room Layout</h3>
                <div class="floorplan-container position-relative">
                    <div class="floorplan-image-container">
                        <img :src="floorplanImage" alt="Floorplan for B05-11" class="floorplan-image" />
                    </div>

                    <!-- Status dots for zone sensors -->
                    <div v-for="(sensor, index) in zoneSensors" :key="index"
                        :style="{ top: sensor.top, left: sensor.left, position: 'absolute', transform: 'translate(-50%, -50%)' }">
                        <span class="status-dot" :class="sensor.isOnline ? 'online' : 'offline'"></span>
                    </div>

                    <!-- Status dots for toggle devices (MDU1, MDU2, FCU1-1, FCU1-2) -->
                    <div v-for="(device, index) in toggleDevices" :key="index"
                        :style="{ top: device.top, left: device.left, position: 'absolute', transform: 'translate(-50%, -50%)' }">
                        <span class="status-dot" :class="device.isOnline ? 'online' : 'offline'"></span>
                    </div>

                    <div v-for="fan in fans" :key="fan.id" class="status-dot-floorplan"
                        :style="{ top: fan.top, left: fan.left }">
                        <span class="status-dot" :class="fan.isOn ? 'online' : 'offline'"></span>
                    </div>

                </div>
            </div>

            <!-- Console Control Section - 20% width -->
            <div class="col-lg-4 section-container">
                <h3 class="section-title">Console Control</h3>
                <div class="console-box">
                    <!-- ALL ON/OFF Toggle for Zones -->
                    <div class="toggle-switch all-on-control mb-4">
                        <label class="switch">
                            <input type="checkbox" v-model="allOnZones" @change="toggleAllDevices" />
                            <span class="slider round"></span>
                        </label>
                        <span>{{ allOnZones ? 'ALL Lights OFF' : 'ALL Lights ON' }}</span>
                    </div>

                    <!-- Zone 5 to Zone 8 Controls -->
                    <div v-for="(sensor, index) in zoneSensors" :key="index"
                        class="sensor-control mb-3 d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <span :style="{ color: sensor.isOnline ? 'lightgreen' : 'white' }">
                                {{ sensor.name }} ({{ sensor.isOnline ? 'Lights On' : 'Lights Off' }})
                            </span>
                        </div>
                        <button class="btn btn-primary" @click="toggleModal(sensor)">
                            Control
                        </button>
                    </div>

                    <!-- ALL ON/OFF Toggle for FCUs -->
                    <div class="toggle-switch all-on-control mb-4">
                        <label class="switch">
                            <input type="checkbox" v-model="allOnFCU" @change="toggleAllFCU" />
                            <span class="slider round"></span>
                        </label>
                        <span>{{ allOnFCU ? 'Turn All FCUs Close' : 'Turn All FCUs Open' }}</span>
                    </div>

                    <!-- ALL ON/OFF Toggle for MDUs -->
                    <div class="toggle-switch all-on-control mb-4">
                        <label class="switch">
                            <input type="checkbox" v-model="allOnMDU" @change="toggleAllMDU"
                                :disabled="isTogglingMDU" />
                            <span class="slider round"></span>
                        </label>
                        <span>{{ allOnMDU ? 'Turn All MDUs Close' : 'Turn All MDUs Open' }}</span>
                    </div>



                    <div v-for="device in toggleDevices" :key="device.name" class="toggle-switch mb-3">
                        <div class="d-flex align-items-center justify-content-between">
                            <span>{{ device.name }}</span>
                            <!-- Disable switch while API request is pending -->
                            <label class="switch">
                                <input type="checkbox" :checked="device.isOnline" @change="toggleDeviceState(device)"
                                    :disabled="device.name.startsWith('FCU') ? isTogglingFCU : isTogglingMDU" />
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <!-- Display ON when device isOnline, else OFF -->
                        <span>{{ device.isOnline ? 'Open' : 'Close' }}</span>
                    </div>


                    <!-- FAF1 Control -->
                    <div class="toggle-switch mb-4">
                        <span><b>Fresh Air Fan 4 (FAF4)</b></span>
                        <label class="switch">
                            <input type="checkbox" v-model="fans[0].isOn" @change="controlFAF1(fans[0].isOn)">
                            <span class="slider round"></span>
                        </label>
                        <span>{{ fans[0].isOn ? 'Open' : 'Close' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { Chart, BarController, LineController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

export default {
    data() {
        return {
            isTogglingMDU: false,  // Disable flag for MDU toggle switch during API call
            isTogglingFCU: false,  // Disable flag for MDU toggle switch during API call
            sensorData: {
                co2: null,
                temperature: null,
                humidity: null,
                pm2_5: null,
                pm10: null,
            },
            floorplanImage: require('@/assets/Sub System and Icons/V2/B05-11_full2.png'),
            allOnFCU: false,  // Controls all FCU units (initially set to true)
            allOnMDU: false,  // Controls all MDU units (initially set to true)
            allOnZones: false,
            fans: [
                { id: 1, name: 'Fresh Air Fan 1 (FAF1)', deviceEUI: '24E124756E049153', isOn: false, top: '49%', left: '56%' },
            ],
            zoneSensors: [
                { top: '23%', left: '41.5%', name: 'Zone 5', isOnline: false, deviceEUI: '0004ED0100001716' }, // Initially ON
                { top: '23%', left: '49.5%', name: 'Zone 6', isOnline: false, deviceEUI: '0004ED0100001711' }, // Initially ON
                { top: '23%', left: '57.5%', name: 'Zone 7', isOnline: false, deviceEUI: '0004ED010000170F' }, // Initially ON
                { top: '23%', left: '65.5%', name: 'Zone 8', isOnline: false, deviceEUI: '0004ED010000173B' }  // Initially ON
            ],
            toggleDevices: [
                { name: 'MCD 3', isOnline: false, deviceEUI: '24E124756E049153', top: '41%', left: '65%' },  // Initially ON
                { name: 'FCU 1-1', isOnline: false, airconIndex: 1, top: '69%', left: '57%' },               // Initially ON
                { name: 'FCU 1-2', isOnline: false, airconIndex: 2, top: '69%', left: '65%' }                // Initially ON
            ],
            showModal: false,
            modalTitle: '',
            currentSensor: null,
        };
    },
    methods: {
        // Function to control FAF1
        async controlFAF1(turnOn) {
            const payload = {
                deviceEui: '24E124756E049153', // Replace with actual device EUI for FAF1
                switchStates: turnOn ? [1, 0, 0, 0, 0, 0, 0, 0] : [0, 0, 0, 0, 0, 0, 0, 0] // Example for turning on/off
            };

            try {
                const response = await axios.post('https://hammerhead-app-kva7n.ondigitalocean.app/command/ws558', payload);
                console.log(`FAF1 turned ${turnOn ? 'ON' : 'OFF'}`, response.data);

                // Update the FAF1 state
                this.fans[0].isOn = turnOn; // Assuming FAF1 is the first fan in the `fans` array
            } catch (error) {
                console.error(`Error turning FAF1 ${turnOn ? 'ON' : 'OFF'}:`, error);
            }
        },
        getToggleState(device) {
            return device.name.startsWith('FCU') ? this.allOnFCU : this.allOnMDU;
        },
        setToggleState(device, value) {
            if (device.name.startsWith('FCU')) {
                this.allOnFCU = value;
            } else {
                this.allOnMDU = value;
            }
        },
        getFaceClass(value, type) {
            const thresholds = {
                co2: 1000,
                temperature: 25,
                humidity: 70,
                pm2_5: 35,
                pm10: 50,
            };
            return value > thresholds[type]
                ? 'fas fa-frown text-danger'
                : 'fas fa-smile text-success';
        },
        async fetchSensorData() {
            try {
                const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Lorawan/latest/sheet/IAQ');
                const data = response.data['24e124710d480176'];
                this.sensorData.co2 = data.co2;
                this.sensorData.temperature = data.temperature;
                this.sensorData.humidity = data.humidity;
                this.sensorData.pm2_5 = data.pm2_5;
                this.sensorData.pm10 = data.pm10;
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        },
        async toggleAllDevices() {
            const apiUrl = this.allOnZones ? `https://lumani.rshare.io/device/off` : `https://lumani.rshare.io/device/on`;
            const deviceIds = this.zoneSensors.reduce((acc, sensor, index) => {
                acc[`deviceId${index + 1}`] = sensor.deviceEUI;
                return acc;
            }, {});

            try {
                await axios.post(apiUrl, deviceIds);
                this.zoneSensors.forEach(sensor => sensor.isOnline = !this.allOnZones);
                this.allOnZones = !this.allOnZones;
            } catch (error) {
                console.error('Error setting all devices state:', error);
            }
        },
        async toggleAllFCU() {
            console.log('Toggling all FCUs');
            this.isTogglingFCU = true;  // Disable the UI toggle switch for FCUs

            const apiUrl = `https://aircon.rshare.io/aircon/control/master`;
            const state = this.allOnFCU ? 'on' : 'off';

            try {
                console.log(`Sending request to ${apiUrl} with state: ${state}`);
                const response = await axios.post(apiUrl, { state });
                console.log('Response from FCU API:', response.data);

                // Update only FCU states
                this.toggleDevices.forEach(device => {
                    if (device.name.startsWith('FCU')) {
                        device.isOnline = this.allOnFCU;  // Update FCU's online status
                        console.log(`FCU ${device.name} is now ${this.allOnFCU ? 'ON' : 'OFF'}`);
                    }
                });
            } catch (error) {
                console.error('Error toggling all FCUs:', error);
            } finally {
                this.isTogglingFCU = false;  // Re-enable the UI toggle switch
            }
        },
        async toggleAllMDU() {
            console.log('Toggling all MDUs');
            this.isTogglingMDU = true;  // Disable the toggle switch for MDUs

            const devices = this.toggleDevices.filter(device => device.name.startsWith('MCD'));
            const newState = this.allOnMDU;  // Determine new state (should only affect MDUs)

            try {
                // Loop through each MDU and make the API call to toggle its state
                for (const device of devices) {
                    console.log(`Toggling MDU ${device.name} to ${newState ? 'ON' : 'OFF'}`);

                    // Toggle each MDU individually and wait for the result
                    await this.toggleSensor(device, newState);

                    // After the API call is successful, update the MDU's online status
                    device.isOnline = newState;
                    console.log(`MDU ${device.name} is now ${newState ? 'ON' : 'OFF'}`);
                }

                // If all toggles are successful, update the allOnMDU state
                this.allOnMDU = newState;

            } catch (error) {
                // Log the error and potentially show a message to the user
                console.error('Error toggling all MDUs:', error);
            } finally {
                // Re-enable the toggle switch after the API call completes
                this.isTogglingMDU = false;
            }
        },
        async toggleDeviceState(device) {
            // Log the name and state of the device
            console.log(`${device.name} is being turned ${device.isOnline ? 'OFF' : 'ON'}`);

            if (device.name.startsWith('FCU')) {
                // Toggle aircon state for FCU
                await this.sendAirconState(!device.isOnline, device.airconIndex);
            } else if (device.name.startsWith('MCD')) {
                // Toggle MDU sensor state
                await this.toggleSensor(device, !device.isOnline);
            }

            // Update the device's online state after the toggle action
            device.isOnline = !device.isOnline;

            // Log the new status
            console.log(`${device.name} is now ${device.isOnline ? 'ON' : 'OFF'}`);
        },
        async sendAirconState(state, airconIndex) {
            const apiUrl = `https://aircon.rshare.io/aircon/${airconIndex}`;
            const payload = { state: state ? 'on' : 'off' };

            try {
                await axios.post(apiUrl, payload);
                console.log(`FCU ${airconIndex} turned ${state ? 'ON' : 'OFF'}`);
            } catch (error) {
                console.error(`Error turning aircon ${airconIndex} ${state ? 'on' : 'off'}:`, error);
            }
        },
        async toggleSensor(sensor, state) {
            const switchStates = state ? [1, 1, 1, 1, 1, 1, 1, 1] : [0, 0, 0, 0, 0, 0, 0, 0];  // Toggle on or off

            try {
                // Make the API call to toggle the MDU sensor state
                await axios.post('https://hammerhead-app-kva7n.ondigitalocean.app/command/ws558', {
                    deviceEui: sensor.deviceEUI,
                    switchStates
                });

                console.log(`MDU ${sensor.name} turned ${state ? 'ON' : 'OFF'}`);
            } catch (error) {
                console.error(`Error toggling sensor ${sensor.name}:`, error);
            }
        },
        generateChart() {
            // Register the required components for Bar and Line charts
            Chart.register(BarController, LineController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

            const ctx = document.getElementById('kwhChart').getContext('2d');

            // Data for the last 7 days
            const last7DaysData = [32, 35, 38, 31, 34, 31, 39]; // Example KWH consumption for the last 7 days
            const differences = last7DaysData.map((value, index, array) => {
                if (index === 0) return 0; // No difference for the first day
                return value - array[index - 1];
            });

            new Chart(ctx, {
                type: 'bar', // Bar chart for KWH Consumption
                data: {
                    labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
                    datasets: [
                        {
                            label: 'KWH Consumption',
                            data: last7DaysData,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            type: 'bar',
                        },
                        {
                            label: 'Difference Between Days',
                            data: differences,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 2,
                            fill: false,
                            type: 'line',
                            yAxisID: 'differenceAxis',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'KWH',
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        differenceAxis: {
                            position: 'right',
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Difference (KWH)',
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'
                            },
                            grid: {
                                drawOnChartArea: false // Prevent grid lines from overlapping
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Days',
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: 'white',
                            bodyColor: 'white'
                        }
                    }
                }
            });
        },
        toggleModal(sensor) {
            this.modalTitle = sensor.name;
            this.currentSensor = sensor;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        }
    },
    mounted() {
        this.fetchSensorData();
        this.generateChart();
    }
};
</script>

<style scoped>
/* Common styles */
.container {
    width: 100%;
    padding: 20px;
}

.text-center {
    text-align: center;
}

.section-container {
    margin-bottom: 30px;
    margin-right: 1%;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
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
    padding-bottom: 10%;
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
    position: relative;
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

.chart-box {
    height: 300px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}

/* Console Control Styles */
.console-box {
    border-radius: 5px;
    padding: 15px;
    text-align: center;
}

.toggle-switch {
    display: flex;
    align-items: center;
    gap: 10px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
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
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 14px;
    width: 14px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: green;
}

input:checked+.slider:before {
    transform: translateX(14px);
}

/* Status dot styles for the floorplan */
.status-dot {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    position: absolute;
    z-index: 10;
}

.online {
    background-color: green;
}

.offline {
    background-color: red;
}

.console-box .sensor-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.all-on-control {
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-content {
    color: black;
}

/* Status dot styles */
.status-dot-floorplan {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    z-index: 10;
}

.online {
    background-color: green;
}

.offline {
    background-color: red;
}

/* Slider styles */
.switch {
    position: relative;
    display: inline-block;
    width: 34px;
    height: 20px;
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

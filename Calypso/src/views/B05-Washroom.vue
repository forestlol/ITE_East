<template>
    <div class="container">
        <h2 class="text-center mb-4">Smart Washroom [B05]</h2>

        <!-- First Row: Sensor Data and Chart -->
        <div class="row">
            <!-- Sensor Data Section -->
            <div class="col-lg-6 section-container">
                <h3 class="section-title">Sensor Data</h3>
                <div class="row justify-content-center">
                    <div class="col-lg-4 sensor-box">
                        <h4 class="text-center"><u>Male Toilet</u></h4>
                        <p><b>Occupancy:</b> {{ maleToiletData.occupancy }} pax</p>
                        <p><b>Ammonium:</b> {{ maleToiletData.nh3 }} ppm</p>
                        <p><b>Hydrogen Sulfide:</b> {{ maleToiletData.h2s }} ppm</p>
                        <p><b>Temperature:</b> {{ maleToiletData.temperature }}°C</p>
                        <p><b>Humidity:</b> {{ maleToiletData.humidity }}%</p>
                    </div>
                    <div class="col-lg-4 sensor-box">
                        <h4 class="text-center"><u>Female Toilet</u></h4>
                        <p><b>Occupancy:</b> {{ femaleToiletData.occupancy }} pax</p>
                        <p><b>Ammonium:</b> {{ femaleToiletData.nh3 }} ppm</p>
                        <p><b>Hydrogen Sulfide:</b> {{ femaleToiletData.h2s }} ppm</p>
                        <p><b>Temperature:</b> {{ femaleToiletData.temperature }}°C</p>
                        <p><b>Humidity:</b> {{ femaleToiletData.humidity }}%</p>
                    </div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="col-lg-6 section-container chart-container" style="width: 48%;">
                <div class="chart-box">
                    <h3 class="section-title">Daily Water Consumption</h3>
                    <canvas id="kwhChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Second Row: Floorplan and Sensor Icons -->
        <div class="row mt-4">
            <!-- Floorplan Section with Icons -->
            <div class="col-lg-12 section-container">
                <h3 class="section-title">Room Layout</h3>
                <div class="floorplan-container position-relative">
                    <img :src="floorplanImage" alt="Floorplan for B05-13/14" class="floorplan-image" />

                    <!-- Icons and Tooltip Logic -->
                    <div v-for="(icon, index) in icons" :key="index" class="icon-container"
                        :style="{ top: icon.top, left: icon.left }" @mouseenter="showValue(index, $event)"
                        @mouseleave="hideValue">
                        <img :src="icon.src" alt="Sensor Icon" class="icon-image" />

                        <!-- Tooltip to Show on Hover -->
                        <div v-if="hoveredIndex === index" class="value-tooltip"
                            :style="{ top: `${tooltipY}px`, left: `${tooltipX}px` }">
                            <h5>{{ icon.label }}</h5>
                            <template v-if="icon.type === 'People Counter'">
                                <p>Period In: {{ icon.periodIn }}</p>
                                <p>Period Out: {{ icon.periodOut }}</p>
                            </template>
                            <template v-else-if="icon.type === 'Odor Sensor'">
                                <p>Battery: {{ icon.battery }}%</p>
                                <p>Ammonia Level: {{ icon.nh3 }} ppm</p>
                                <p>Hydrogen Sulfide Level: {{ icon.h2s }} ppm</p>
                                <p>Temperature: {{ icon.temperature }}°C</p>
                                <p>Humidity: {{ icon.humidity }}%</p>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import peopleCounterIcon from '@/assets/peopleCounter.png';
import odorIcon from '@/assets/Odor.png';
import {
    Chart,
    BarController,
    LineController,
    BarElement,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

export default {
    data() {
        return {
            maleToiletData: {
                occupancy: 0,
                nh3: 0,
                h2s: 0,
                temperature: 0,
                humidity: 0
            },
            femaleToiletData: {
                occupancy: 0,
                nh3: 0,
                h2s: 0,
                temperature: 0,
                humidity: 0
            },
            sensorData: {
                temperature: null,
                humidity: null,
                co2: null, // Assuming you'll add CO2 data later
            },
            hoveredIndex: null,
            tooltipX: 0,
            tooltipY: 0,
            floorplanImage: require('@/assets/Sub System and Icons/V2/smart washroom_full1.png'), // Floorplan image
            icons: [
                { top: '51%', left: '66%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', devEUI: '24e124716d496395', periodIn: 0, periodOut: 0 },
                { top: '40.6%', left: '44%', src: peopleCounterIcon, label: 'People Counter', type: 'People Counter', devEUI: '24e124716d496118', periodIn: 0, periodOut: 0 },
                { top: '37.6%', left: '64.7%', src: odorIcon, label: 'Bathroom Odor Detector', type: 'Odor Sensor', devEUI: '24e124798d482591', battery: 0, nh3: 0, h2s: 0, temperature: 0, humidity: 0 },
                { top: '36%', left: '18%', src: odorIcon, label: 'Bathroom Odor Detector', type: 'Odor Sensor', devEUI: '24e124798d482365', battery: 0, nh3: 0, h2s: 0, temperature: 0, humidity: 0 },
            ]
        };
    },
    methods: {
        async fetchSensorData() {
            try {
                const response = await axios.get(
                    'https://015d-119-56-103-190.ngrok-free.app/data/latest/Odor',
                    { headers: { 'ngrok-skip-browser-warning': 'true' } }
                );
                // The API returns an array of odor sensor objects.
                const odorDataArray = response.data;
                console.log("Odor Sensor Data:", odorDataArray);

                // Find the female toilet odor sensor (devEUI "24e124798d482365")
                const femaleToiletOdorSensor = odorDataArray.find(
                    sensor => sensor.devEUI === "24e124798d482365"
                );
                // Find the male toilet odor sensor (devEUI "24e124798d482591")
                const maleToiletOdorSensor = odorDataArray.find(
                    sensor => sensor.devEUI === "24e124798d482591"
                );

                // Update the data for the female toilet.
                // If the sensor exists, use its decoded data; otherwise, default to 0.
                this.femaleToiletData = {
                    occupancy: 0, // Occupancy is not provided by the Odor API
                    nh3: femaleToiletOdorSensor && femaleToiletOdorSensor.data
                        ? femaleToiletOdorSensor.data.nh3 || 0
                        : 0,
                    h2s: femaleToiletOdorSensor && femaleToiletOdorSensor.data
                        ? femaleToiletOdorSensor.data.h2s || 0
                        : 0,
                    temperature: femaleToiletOdorSensor && femaleToiletOdorSensor.data
                        ? femaleToiletOdorSensor.data.temperature || 0
                        : 0,
                    humidity: femaleToiletOdorSensor && femaleToiletOdorSensor.data
                        ? femaleToiletOdorSensor.data.humidity || 0
                        : 0,
                };

                // For the male toilet, since data is not available, default all values to 0.
                this.maleToiletData = {
                    occupancy: 0,
                    nh3: maleToiletOdorSensor && maleToiletOdorSensor.data
                        ? maleToiletOdorSensor.data.nh3 || 0
                        : 0,
                    h2s: maleToiletOdorSensor && maleToiletOdorSensor.data
                        ? maleToiletOdorSensor.data.h2s || 0
                        : 0,
                    temperature: maleToiletOdorSensor && maleToiletOdorSensor.data
                        ? maleToiletOdorSensor.data.temperature || 0
                        : 0,
                    humidity: maleToiletOdorSensor && maleToiletOdorSensor.data
                        ? maleToiletOdorSensor.data.humidity || 0
                        : 0,
                };

                console.log("Female Toilet Data:", this.femaleToiletData);
                console.log("Male Toilet Data:", this.maleToiletData);
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        },
        async fetchPeopleData() {
            try {
                const response = await axios.get(
                    'https://015d-119-56-103-190.ngrok-free.app/data/latest/People',
                    { headers: { 'ngrok-skip-browser-warning': 'true' } }
                );
                const peopleDataArray = response.data; // Expected to be an array
                console.log("People API Data:", peopleDataArray);

                // Find the female toilet occupancy sensor (devEUI: "24e124716d496118")
                const femaleSensor = peopleDataArray.find(
                    sensor => sensor.devEUI === "24e124716d496395"
                );
                // Find the male toilet occupancy sensor (devEUI: "24e124716d496395")
                const maleSensor = peopleDataArray.find(
                    sensor => sensor.devEUI === "24e124716d496118"
                );

                // Update female toilet occupancy: occupancy = period_in - period_out
                if (femaleSensor && femaleSensor.data) {
                    const periodIn = parseInt(femaleSensor.data.period_in, 10) || 0;
                    const periodOut = parseInt(femaleSensor.data.period_out, 10) || 0;
                    this.femaleToiletData.occupancy = periodIn - periodOut;
                } else {
                    this.femaleToiletData.occupancy = 0;
                }

                // Update male toilet occupancy: occupancy = period_in - period_out
                if (maleSensor && maleSensor.data) {
                    const periodIn = parseInt(maleSensor.data.period_in, 10) || 0;
                    const periodOut = parseInt(maleSensor.data.period_out, 10) || 0;
                    this.maleToiletData.occupancy = periodIn - periodOut;
                } else {
                    this.maleToiletData.occupancy = 0;
                }

                console.log("Updated female toilet occupancy:", this.femaleToiletData.occupancy);
                console.log("Updated male toilet occupancy:", this.maleToiletData.occupancy);
            } catch (error) {
                console.error("Error fetching people data:", error);
            }
        },
        updateIcons(data) {
            // Loop through the icons and update them based on their devEUI (if applicable)
            this.icons.forEach(icon => {
                if (icon.label === 'Bathroom Odor Detector') {
                    if (icon.devEUI === '24e124798d482591') {
                        // Update for Bathroom Odor Detector 02
                        const deviceData = data['24e124798d482591'];
                        if (deviceData) {
                            icon.battery = deviceData.battery;
                            icon.nh3 = deviceData.nh3;
                            icon.h2s = deviceData.h2s;
                            icon.temperature = deviceData.temperature;
                            icon.humidity = deviceData.humidity;
                        }
                    } else if (icon.devEUI === '24e124798d482365') {
                        // Update for Bathroom Odor Detector 01
                        const deviceData = data['24e124798d482365'];
                        if (deviceData) {
                            icon.battery = deviceData.battery;
                            icon.nh3 = deviceData.nh3;
                            icon.h2s = deviceData.h2s;
                            icon.temperature = deviceData.temperature;
                            icon.humidity = deviceData.humidity;
                        }
                    }
                } else if (icon.label === 'People Counter') {
                    // Example for updating people counters with their respective devEUI
                    if (icon.devEUI === '24e124716d496395') {
                        const deviceData = data['24e124716d496395'];
                        if (deviceData) {
                            icon.periodIn = deviceData.period_in;
                            icon.periodOut = deviceData.period_out;
                        }
                    } else if (icon.devEUI === '24e124716d496118') {
                        const deviceData = data['24e124716d496118'];
                        if (deviceData) {
                            icon.periodIn = deviceData.period_in;
                            icon.periodOut = deviceData.period_out;
                        }
                    }
                }
            });
        },
        updateSensorData(data) {
            // Assuming you're using Bathroom Odor Detector 02's data for the main sensor display
            const odorSensor = data['24e124798d482591']; // Example device ID
            if (odorSensor) {
                this.sensorData.temperature = odorSensor.temperature;
                this.sensorData.humidity = odorSensor.humidity;
            }
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
                return 'fas fa-smile modal-face-icon'; // Green smiley face for good values
            } else if (value >= goodLimit && value < badLimit) {
                return 'fas fa-meh text-warning modal-face-icon'; // Orange neutral face for moderate values
            } else {
                return 'fas fa-frown text-danger modal-face-icon'; // Red frown face for bad values
            }
        },
        showValue(index, event) {
            const containerRect = event.currentTarget.getBoundingClientRect();
            const pointRect = event.target.getBoundingClientRect();
            this.tooltipX = pointRect.x + pointRect.width / 2 - containerRect.x;
            this.tooltipY = pointRect.y - containerRect.y - 10;
            this.hoveredIndex = index;
        },
        hideValue() {
            this.hoveredIndex = null;
        },
        generateChart() {
            // Chart generation logic
            Chart.register(BarController, LineController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

            const ctx = document.getElementById('kwhChart').getContext('2d');
            const last7DaysData = [250, 300, 280, 320, 290, 270, 310]; // Example data
            const differences = last7DaysData.map((value, index, array) => (index === 0 ? 0 : value - array[index - 1]));

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
                    datasets: [
                        { label: 'Water Consumption (liters)', data: last7DaysData, backgroundColor: 'rgba(75, 192, 192, 0.6)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1, type: 'bar' },
                        { label: 'Difference Between Days', data: differences, borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', borderWidth: 2, fill: false, type: 'line', yAxisID: 'differenceAxis' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Liters', color: 'white' },
                            ticks: { color: 'white' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        },
                        differenceAxis: {
                            position: 'right',
                            beginAtZero: true,
                            title: { display: true, text: 'Difference (Liters)', color: 'white' },
                            ticks: { color: 'white' },
                            grid: { drawOnChartArea: false }
                        },
                        x: {
                            title: { display: true, text: 'Days', color: 'white' },
                            ticks: { color: 'white' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    },
                    plugins: {
                        legend: { labels: { color: 'white' } },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: 'white',
                            bodyColor: 'white'
                        }
                    }
                }
            });
        }
    },
    mounted() {
        // Call each function once, in the proper order
        this.fetchSensorData();    // This fetches Odor data and sets default occupancy to 0.
        this.generateChart();      // Generate your chart, if applicable.
        this.fetchPeopleData();    // Then update occupancy based on People API data.
    }
};
</script>


<style scoped>
.container {
    width: 100%;
    padding: 20px;
}

.text-center {
    text-align: center;
}

.section-container {
    margin-bottom: 30px;
    background-color: rgba(255, 255, 255, 0.1);
    margin-right: 1%;
}

.section-title {
    text-align: center;
    margin-bottom: 20px;
    color: white;
    font-weight: bold;
}

/* Floorplan and Icons */
.floorplan-container {
    position: relative;
}

.floorplan-image {
    width: 100%;
    height: auto;
    border-radius: 5px;
}

.icon-container {
    position: absolute;
    width: 24px;
    height: 24px;
    transform: translate(-50%, -50%);
    cursor: pointer;
}

.icon-image {
    width: 100%;
    height: 100%;
    visibility: hidden;
}

.value-tooltip {
    position: absolute;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px;
    border-radius: 5px;
    white-space: nowrap;
    font-size: 0.9rem;
    text-align: center;
}

.chart-box {
    height: 300px;
    width: 100%;
}

.sensor-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 10%;
}

.sensor-box {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 15px;
    text-align: center;
    margin-left: 2%;
    margin-bottom: 5%;
}

.face-indicator {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.face-icon {
    font-size: 1.5rem;
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

.fas.fa-smile {
    color: #90ee90;
    /* Light green */
}
</style>

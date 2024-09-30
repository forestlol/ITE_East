<template>
    <div class="container">
        <h2 class="text-center mb-4">SMART VERTICAL TRANSPORT ROOM [B05-13 & 14]</h2>

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
                <div class="floorplan-container">
                    <div class="floorplan-image-container">
                        <img :src="floorplanImage" alt="Floorplan for B05-13/14" class="floorplan-image" />
                    </div>
                </div>
            </div>

            <!-- Console Control Section - 20% width -->
            <div class="col-lg-4 section-container">
                <h3 class="section-title">Console Control</h3>
                <div class="console-box">
                    <h4>No Controls</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import {
    Chart,
    LineController,
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
            sensorData: {
                co2: null,
                temperature: null,
                humidity: null,
                pm2_5: null,
                pm10: null
            },
            floorplanImage: require('@/assets/Sub System and Icons/V2/B05 13-14_IAQ.png') // Replace with your correct image path
        };
    },
    methods: {
        async fetchSensorData() {
            try {
                const response = await axios.get('https://hammerhead-app-kva7n.ondigitalocean.app/api/Lorawan/latest/sheet/IAQ');
                const data = response.data['24e124710d480081']; // Fetch data by device ID

                this.sensorData.co2 = data.co2;
                this.sensorData.temperature = data.temperature;
                this.sensorData.humidity = data.humidity;
                this.sensorData.pm2_5 = data.pm2_5;
                this.sensorData.pm10 = data.pm10;
            } catch (error) {
                console.error('Error fetching sensor data:', error);
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
            return value > thresholds[type]
                ? 'fas fa-frown text-danger'
                : 'fas fa-smile text-success';
        },
        generateChart() {
            // Registering the required components
            Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

            const ctx = document.getElementById('kwhChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 0:00 to 23:00 for 24-hour data
                    datasets: [
                        {
                            label: 'KWH Consumption',
                            data: [30, 35, 32, 40, 42, 39, 50, 55, 52, 60, 62, 65, 66, 67, 64, 63, 70, 75, 72, 80, 82, 85, 87, 90], // Example 24-hour data
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: true,
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
                                color: 'white' // Set Y-axis title color to white
                            },
                            ticks: {
                                color: 'white' // Set Y-axis ticks (numbers) color to white
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)' // Make grid lines visible
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Hour (0-24)',
                                color: 'white' // Set X-axis title color to white
                            },
                            ticks: {
                                color: 'white' // Set X-axis ticks (numbers) color to white
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)' // Make grid lines visible
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white' // Set legend text color to white
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background
                            titleColor: 'white', // Set tooltip title color to white
                            bodyColor: 'white',  // Set tooltip body text color to white
                        }
                    }
                }
            });
        }
    },
    mounted() {
        this.fetchSensorData(); // Fetch sensor data when the component is mounted
        this.generateChart(); // Generate the KWH consumption chart
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
    /* Adjust to two columns */
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
    /* Optional background for container */
    padding: 10px;
    display: flex;
    justify-content: center;
}

.floorplan-image {
    width: 100%;
    /* Keep the image responsive */
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
    /* Ensure it spans the entire width */
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
    /* Add this to introduce a gap between the divs */
}

.section-container {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 20px;
    margin-bottom: 30px;
    flex: 1;
    /* Allows each section to take up equal space */
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

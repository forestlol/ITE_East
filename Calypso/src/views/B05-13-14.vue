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

        <!-- Second Row: Floorplan Section -->
        <div class="row mt-4">
            <!-- Floorplan Section -->
            <div class="col-lg-12 section-container">
                <h3 class="section-title">Room Layout</h3>
                <div class="floorplan-container">
                    <div class="floorplan-image-container">
                        <img :src="floorplanImage" alt="Floorplan for B05-13/14" class="floorplan-image" />
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

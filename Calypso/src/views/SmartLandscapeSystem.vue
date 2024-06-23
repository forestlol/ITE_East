<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Smart Landscape System</h2>
        <div class="row">
            <div class="col-md-3">
                <h4 class="section-title">Landscape Devices</h4>
                <div class="device-list">
                    <div v-for="device in devices" :key="device.id"
                        :ref="'device-' + device.id"
                        :class="['device-item', { 'highlight': hoveredDevice === device.id }]"
                        @mouseenter="handleMouseEnter(device.id)" 
                        @mouseleave="handleMouseLeave">
                        <h5>{{ device.name }}</h5>
                        <p>Status:
                            <span :class="{ 'text-success': device.isOnline, 'text-danger': !device.isOnline }">
                                {{ device.isOnline ? 'Online' : 'Offline' }}
                            </span>
                        </p>
                        <p>Type: {{ device.type }}</p>
                        <p>Last Updated: {{ device.lastUpdated }}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <div class="view-switcher">
                    <button @click="toggleView('relation')"
                        :class="{ 'active': currentView === 'relation' }">Relation</button>
                    <button @click="toggleView('floorplan')"
                        :class="{ 'active': currentView === 'floorplan' }">Floorplan</button>                    
                </div>
                <div class="view-container" v-if="currentView === 'floorplan'">
                    <div class="map-container">
                        <img src="@/assets/Landscape Device Reference.png" alt="Floorplan View" class="map-image">
                        <div v-for="(device, index) in devices" :key="index"
                            :class="['device-status', device.typeClass, { 'highlight': hoveredDevice === device.id }]"
                            :style="device.position" 
                            @mouseenter="handleMouseEnter(device.id)"
                            @mouseleave="handleMouseLeave"></div>
                    </div>
                    <div class="link-button">
                        <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
                    </div>
                </div>
                <div class="view-container" v-if="currentView === 'relation'">
                    <div class="map-container">
                        <img src="@/assets/Smart Landscape relation.jpg" alt="relation View" class="map-image">
                    </div>
                    <div class="link-button">
                        <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SmartLandscapeSystem',
    data() {
        return {
            currentView: 'relation',
            hoveredDevice: null,
            devices: [
                { id: 1, name: 'Soil Sensor 1', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '28.6%', left: '15.1%' } },
                { id: 2, name: 'Soil Sensor 2', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: false, lastUpdated: '2024-05-29 14:20:00', position: { top: '35%', left: '15.4%' } },
                { id: 3, name: 'Soil Sensor 3', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:25:00', position: { top: '42%', left: '17.6%' } },
                { id: 4, name: 'Soil Sensor 4', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:15:00', position: { top: '28%', left: '22.1%' } },
                { id: 5, name: 'Soil Sensor 5', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:35:00', position: { top: '34%', left: '22%' } },
                { id: 6, name: 'Soil Sensor 6', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:10:00', position: { top: '38%', left: '25.6%' } },
                { id: 7, name: 'Soil Sensor 7', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:00:00', position: { top: '42.3%', left: '23.3%' } },
                { id: 8, name: 'Soil Sensor 8', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '28%', left: '32.32%' } },
                { id: 9, name: 'Soil Sensor 9', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: false, lastUpdated: '2024-05-29 14:20:00', position: { top: '28%', left: '45.4%' } },
                { id: 10, name: 'Soil Sensor 10', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:25:00', position: { top: '28%', left: '57.4%' } },
                { id: 11, name: 'Soil Sensor 11', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:15:00', position: { top: '40.5%', left: '55.5%' } },
                { id: 12, name: 'Soil Sensor 12', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:35:00', position: { top: '40.5%', left: '57.7%' } },
                { id: 13, name: 'Soil Sensor 13', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:10:00', position: { top: '41.4%', left: '59.8%' } },
                { id: 14, name: 'Soil Sensor 14', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:00:00', position: { top: '34%', left: '65.8%' } },
                { id: 15, name: 'Soil Sensor 15', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '43%', left: '65.2%' } },
                { id: 16, name: 'Soil Sensor 16', type: '7 in 1 Soil Nutrient Sensor', typeClass: 'soil-sensor', isOnline: false, lastUpdated: '2024-05-29 14:20:00', position: { top: '34.8%', left: '69.5%' } },
                { id: 19, name: 'Valve 1', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:15:00', position: { top: '28.2%', left: '14.2%' } },
                { id: 20, name: 'Valve 2', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:35:00', position: { top: '33%', left: '15%' } },
                { id: 21, name: 'Valve 3', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:10:00', position: { top: '41%', left: '16.8%' } },
                { id: 22, name: 'Valve 4', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:00:00', position: { top: '26.4%', left: '22.3%' } },
                { id: 23, name: 'Valve 5', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '33.4%', left: '22.8%' } },
                { id: 24, name: 'Valve 6', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: false, lastUpdated: '2024-05-29 14:20:00', position: { top: '42.2%', left: '22.1%' } },
                { id: 25, name: 'Valve 7', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:25:00', position: { top: '38.8%', left: '26.8%' } },
                { id: 26, name: 'Valve 8', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:15:00', position: { top: '26.2%', left: '32.5%' } },
                { id: 27, name: 'Valve 9', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:35:00', position: { top: '26.2%', left: '45%' } },
                { id: 28, name: 'Valve 10', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:10:00', position: { top: '27.5%', left: '56.5%' } },
                { id: 29, name: 'Valve 11', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:00:00', position: { top: '40.2%', left: '54.3%' } },
                { id: 30, name: 'Valve 12', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '40.6%', left: '56.9%' } },
                { id: 31, name: 'Valve 13', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: false, lastUpdated: '2024-05-29 14:20:00', position: { top: '29.5%', left: '57.6%' } },
                { id: 32, name: 'Valve 14', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:25:00', position: { top: '43.3%', left: '60.3%' } },
                { id: 33, name: 'Valve 15', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:15:00', position: { top: '35.4%', left: '65%' } },
                { id: 34, name: 'Valve 16', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:35:00', position: { top: '42.5%', left: '64.2%' } },
                { id: 35, name: 'Valve 17', type: 'Actuator Valve', typeClass: 'actuator-valve', isOnline: true, lastUpdated: '2024-05-29 14:10:00', position: { top: '33%', left: '70.4%' } },
                { id: 37, name: 'Relay 1', type: 'LoRaWAN Smart Relay', typeClass: 'smart-relay', isOnline: true, lastUpdated: '2024-05-29 14:25:00', position: { top: '21%', left: '65.6%' } },
                { id: 39, name: 'Water Meter 1', type: 'Water Meter', typeClass: 'water-meter', isOnline: true, lastUpdated: '2024-05-29 14:15:00', position: { top: '24.8%', left: '68.4%' } },
                { id: 41, name: 'Liquid Level Sensor 1', type: 'Liquid Level Sensor', typeClass: 'liquid-level', isOnline: true, lastUpdated: '2024-05-29 14:35:00', position: { top: '27%', left: '69.7%' } },
                { id: 43, name: 'Pump System 1', type: 'Peristaltic Pump System', typeClass: 'pump-system', isOnline: true, lastUpdated: '2024-05-29 14:10:00', position: { top: '29.2%', left: '65.2%' } },
                { id: 46, name: 'Gateway 1', type: 'LoRaWAN Outdoor Gateway', typeClass: 'gateway', isOnline: true, lastUpdated: '2024-05-29 14:00:00', position: { top: '25.4%', left: '65.2%' } },
            ],
        };
    },
    methods: {
        toggleView(view) {
            this.currentView = view;
        },
        navigateTo3DLandscape() {
            window.location.href = "https://your-3d-landscape-url.com";
        },
        handleMouseEnter(deviceId) {
            this.hoveredDevice = deviceId;
            const deviceElement = this.$refs[`device-${deviceId}`][0];
            if (deviceElement) {
                deviceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        },
        handleMouseLeave() {
            this.hoveredDevice = null;
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 1200px;
}

.section-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
}

.device-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 80vh;
    overflow-y: auto;
}

.device-list::-webkit-scrollbar {
    width: 8px;
}

.device-list::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 5px;
}

.device-list::-webkit-scrollbar-thumb {
    background-color: lightgrey;
    border-radius: 5px;
    border: 2px solid #f8f9fa;
}

.device-item {
    border: 1px solid lightgrey;
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.device-item:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.device-item h5 {
    margin-bottom: 10px;
    font-size: 1.25rem;
    font-weight: bold;
    color: #007bff;
}

.view-switcher {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.view-switcher button {
    background-color: #f8f9fa;
    border: none;
    padding: 10px 20px;
    margin: 0 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.view-switcher button.active {
    background-color: #007bff;
    color: white;
}

.view-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.map-container {
    position: relative;
    width: 100%;
    height: 500px;
    border: 1px solid lightgrey;
}

.map-image {
    width: 100%;
    height: auto;
}

.device-status {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    
}

.soil-sensor {
    background-color: red;
}

.actuator-valve {
    background-color: #92d050;
}

.smart-relay {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 18px solid #ffc000;
    border-radius: 0;
    border-left-color: transparent;
    border-right-color: transparent;
}




.water-meter {
    width: 20px;
    height: 20px;
    background-color: #00b0f0;
    border: 1px solid black; /* Adding black border */
}

.liquid-level {
    width: 20px;
    height: 20px;
    background-color: #0070c0;
    border: 1px solid black; /* Adding black border */
}

.pump-system {
    background-color: #ffd966;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    border: 1px solid black; /* Adding black border */
}

.gateway {
    background-color: #4472c4;
    width: 28px;
    height: 18px;
    border-radius: 0;
    border: 1px solid black; /* Adding black border */
}

.text-danger {
    color: #dc3545 !important;
}

.text-success {
    color: #28a745 !important;
}

.highlight {
    border: 2px solid #00BCD4;
    border-radius: 2px;
}

.link-button {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 10px;
}
</style>

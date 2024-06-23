<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">Smart Washroom System</h2>
        <div class="row">
            <div class="col-md-3">
                <h4 class="section-title">Washroom Devices</h4>
                <div class="device-list">
                    <div
                        v-for="device in devices"
                        :key="device.id"
                        :ref="'device-' + device.id"
                        :class="['device-item', { 'highlight': hoveredDevice === device.id }]"
                        @mouseenter="handleMouseEnter(device.id)" 
                        @mouseleave="handleMouseLeave"
                    >
                        <h5>{{ device.name }}</h5>
                        <p>Status: 
                            <span :class="{'text-success': device.isOnline, 'text-danger': !device.isOnline}">
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
                    <button @click="toggleView('relation')" :class="{'active': currentView === 'relation'}">Relation</button>
                    <button @click="toggleView('floorplan')" :class="{'active': currentView === 'floorplan'}">Floorplan</button>
                </div>
                <div class="view-container" v-if="currentView === 'relation'">
                    <div class="map-container">
                        <img src="@/assets/Toilet Device Reference.png" alt="Relation View" class="map-image">
                        <div
                            v-for="(device, index) in devices"
                            :key="index"
                            :class="['device-status', device.typeClass, { 'highlight': hoveredDevice === device.id }]"
                            :style="device.position"
                            @mouseenter="handleMouseEnter(device.id)"
                            @mouseleave="handleMouseLeave"
                        ></div>
                    </div>
                    <div class="link-button">
                        <button @click="navigateTo3DLandscape" class="btn btn-primary">Go to 3D Landscape</button>
                    </div>
                </div>
                <div class="view-container" v-if="currentView === 'floorplan'">
                    <div class="map-container">
                        <img src="@/assets/Toilet Floorplan.png" alt="Floorplan View" class="map-image">
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
    name: 'SmartWashroomSystem',
    data() {
        return {
            currentView: 'relation',
            hoveredDevice: null,
            devices: [
                { id: 1, name: 'People Counting Sensor 1', type: 'People Counting Sensor', typeClass: 'people-counting', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '35.2%', left: '30.7%' } },
                { id: 2, name: 'People Counting Sensor 2', type: 'People Counting Sensor', typeClass: 'people-counting', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '38.4%', left: '60.8%' } },
                { id: 3, name: 'Occupancy Sensor 1', type: 'Occupancy Sensor', typeClass: 'occupancy', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '41.7%', left: '26%' } },
                { id: 4, name: 'Occupancy Sensor 2', type: 'Occupancy Sensor', typeClass: 'occupancy', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '50.6%', left: '26.1%' } },
                { id: 5, name: 'Occupancy Sensor 3', type: 'Occupancy Sensor', typeClass: 'occupancy', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '62%', left: '26%' } },
                { id: 6, name: 'Occupancy Sensor 4', type: 'Occupancy Sensor', typeClass: 'occupancy', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '55.8%', left: '40.9%' } },
                { id: 7, name: 'Occupancy Sensor 5', type: 'Occupancy Sensor', typeClass: 'occupancy', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '57.6%', left: '53.4%' } },
                { id: 8, name: 'Occupancy Sensor 6', type: 'Occupancy Sensor', typeClass: 'occupancy', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '58.8%', left: '61.6%' } },
                { id: 13, name: 'Odor Sensor 1', type: 'Odor Sensor', typeClass: 'odor', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '45.7%', left: '29.2%' } },
                { id: 14, name: 'Odor Sensor 2', type: 'Odor Sensor', typeClass: 'odor', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '56%', left: '57.2%' } },
                { id: 15, name: 'Gateway 1', type: 'LoRaWAN Gateway', typeClass: 'gateway', isOnline: true, lastUpdated: '2024-05-29 14:30:00', position: { top: '32.5%', left: '34.9%' } },
                // Add remaining sensors with positions according to the image
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
    border: 1px solid lightgrey;
    position: relative;
    width: 100%;
    height: 500px; /* Adjust the height as needed */
}

.map-image {
    width: 100%;
    height: auto;
}

.device-status {
    position: absolute;
    width: 15px;
    height: 15px; 
    border-radius: 50%;
    border: 1px solid black; /* Adding black border */
}

.people-counting {
    background-color: red;
    border: 1px solid black; /* Adding black border */
}

.occupancy {
    background-color: #92d050;
    border: 1px solid black; /* Adding black border */
}

.odor {
    background-color: #ffd966;
    width: 15px;
    height: 15px;
    border: 1px solid black; /* Adding black border */
}

.gateway {
    background-color: #4472c4;
    width: 21px;
    height: 15px;
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

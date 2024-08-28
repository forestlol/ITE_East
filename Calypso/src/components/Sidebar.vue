<template>
  <div class="app-container">
    <div class="sidebar" :class="{ 'expanded': isExpanded }">
      <div class="sidebar-header">
        <router-link class="navbar-brand" to="/">IOC</router-link>
      </div>
      <ul class="sidebar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/" exact>
            <i :class="['fas', 'fa-home', { 'active-icon': $route.path === '/' }]"></i>
            <span class="nav-text">Overview</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/bms-reading">
            <i :class="['fas', 'fa-building', { 'active-icon': $route.path === '/bms-reading' }]"></i>
            <span class="nav-text">Building Management System (JCS)</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/fire-alarm-system">
            <img :src="FASIcon" alt="Fire Alarm System" class="icon-image" :class="{ 'active-icon': $route.path === '/fire-alarm-system' }">
            <span class="nav-text">Fire Alarm System</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/smart-landscape-system">
            <i :class="['fas', 'fa-seedling', { 'active-icon': $route.path === '/smart-landscape-system' }]"></i>
            <span class="nav-text">Smart Landscape System</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/smart-toilet-system">
            <i :class="['fas', 'fa-toilet', { 'active-icon': $route.path === '/smart-toilet-system' }]"></i>
            <span class="nav-text">Smart Toilet System</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/smart-pest-control-system">
            <i :class="['fas', 'fa-bug', { 'active-icon': $route.path === '/smart-pest-control-system' }]"></i>
            <span class="nav-text">Smart Pest Control System</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/power-meter-reading">
            <i :class="['fas', 'fa-bolt', { 'active-icon': $route.path === '/power-meter-reading' }]"></i>
            <span class="nav-text">Smart Energy Management System</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/asset-tagging-system">
            <i :class="['fas', 'fa-tags', { 'active-icon': $route.path === '/asset-tagging-system' }]"></i>
            <span class="nav-text">Asset Tagging System</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/smart-lighting-system">
            <i :class="['fas', 'fa-lightbulb', { 'active-icon': $route.path === '/smart-lighting-system' }]"></i>
            <span class="nav-text">Smart Lighting System</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/indoor-air-quality">
            <img :src="airFlowIcon" alt="Indoor Air Quality System" class="icon-image" :class="{ 'active-icon': $route.path === '/indoor-air-quality' }">
            <span class="nav-text">Indoor Air Quality System</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/hybrid-aircon">
            <img :src="airconIcon" alt="Hybrid Aircon System" class="icon-image" :class="{ 'active-icon': $route.path === '/hybrid-aircon' }">
            <span class="nav-text">Hybrid Aircon System</span>
          </router-link>
        </li>
      </ul>
      <button class="toggle-button" @click="toggleSidebar">
        <i :class="isExpanded ? 'fas fa-angle-left' : 'fas fa-angle-right'"></i>
      </button>
    </div>
    <div class="main-content" :class="{ 'shifted': isExpanded }">
      <div class="navbar">
        <div class="navbar-left">
          <span>{{ currentDate }}</span>
          <span>ITE College East</span>
          <span>{{ weather }} <img v-if="weatherIcon" :src="weatherIcon" alt="Weather Icon" class="weather-icon" /></span>
        </div>
        <div class="navbar-right">
          <a href="http://52.237.90.38:82/" target="_blank" class="topbar-button">
            Control Tower
          </a>
          <a href="https://visualizer-lite-html.vercel.app/?site=23&buildings=19" target="_blank" class="topbar-button">
            Digital Twin
          </a>
          <span>{{ userName }}</span>
          <i class="fas fa-user"></i>
        </div>
      </div>
      <!-- Main content goes here -->
      <div class="content">
        <!-- Example content area -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import FASIcon from '@/assets/FAS-icon.png'; // Assuming this is the correct path
import airFlowIcon from '@/assets/air-flow.png';
import airconIcon from '@/assets/aircon.png';

export default {
  name: 'AppSidebar',
  data() {
    return {
      isExpanded: true, // Sidebar is expanded by default
      currentDate: '',
      weather: 'Fetching weather...',
      weatherIcon: null,
      userName: 'User',
      FASIcon, // Assigning the imported icon to be used in the template
      airFlowIcon,
      airconIcon,
    };
  },
  mounted() {
    this.updateDateTime();
    this.fetchWeather();
    setInterval(this.updateDateTime, 1000); // Update every second
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
    },
    updateDateTime() {
      const date = new Date();
      this.currentDate = date.toLocaleString();
    },
    async fetchWeather() {
      try {
        const apiKey = 'b17e981c1815d9059a2c15e3bea2b02b';
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Singapore&appid=${apiKey}&units=metric`);
        const temp = response.data.main.temp;
        const description = response.data.weather[0].description;
        const icon = response.data.weather[0].icon;
        this.weather = `Singapore: ${temp}°C, ${description}`;
        this.weatherIcon = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
}

.sidebar {
  width: 200px; /* Sidebar is expanded by default */
  transition: width 0.3s;
  height: 100vh;
  background-color: #f8f9fa;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 2px solid #ccc;
  z-index: 1000;
}

.sidebar:not(.expanded) {
  width: 60px; /* Width of collapsed sidebar */
}

.sidebar-header {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.nav-item {
  width: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  color: #555;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
  justify-content: flex-start;
  padding-left: 20px;
}

.sidebar:not(.expanded) .nav-link {
  justify-content: center;
  padding-left: 0;
}

.nav-link:hover {
  background-color: lightgrey;
  color: black;
}

.nav-link i, .nav-link .icon-image {
  margin-right: 10px;
}

.icon-image {
  width: 20px;  /* Adjust this to the desired width */
  height: 20px; /* Adjust this to the desired height */
  margin-right: 10px;
  object-fit: contain; /* Ensures the icon fits within the specified dimensions */
}


.sidebar:not(.expanded) .nav-link i, .sidebar:not(.expanded) .nav-link .icon-image {
  margin-right: 0;
}

.nav-text {
  display: inline;
}

.sidebar:not(.expanded) .nav-text {
  display: none;
}

.active-icon {
  color: #007bff; /* Blue color for FontAwesome icons */
  filter: brightness(0) saturate(100%) invert(29%) sepia(87%) saturate(2979%) hue-rotate(191deg) brightness(92%) contrast(102%); /* Blue filter for images */
}

.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: 20px;
  padding: 10px;
}

.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s;
  margin-left: 200px; /* Adjusted for expanded sidebar width */
}

.sidebar:not(.expanded) ~ .main-content {
  margin-left: 60px; /* Adjusted for collapsed sidebar width */
}

.navbar {
  height: 60px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #ccc;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 200px); /* Adjusted for expanded sidebar width */
  transition: width 0.3s;
  position: fixed;
  top: 0;
  left: 200px; /* Adjusted for expanded sidebar width */
  z-index: 999; /* Ensure the navbar is above other content */
}

.sidebar:not(.expanded) ~ .main-content .navbar {
  width: calc(100% - 60px); /* Adjusted for collapsed sidebar width */
  left: 60px; /* Adjusted for collapsed sidebar width */
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.weather-icon {
  width: 40px;
  height: 40px;
}

.content {
  padding: 80px 20px 20px 20px; /* Added padding-top to account for the fixed navbar */
  margin-top: 60px; /* Add margin-top to avoid overlapping with the navbar */
  transition: margin-left 0.3s;
}

.sidebar:not(.expanded) ~ .main-content .content {
  margin-left: 60px; /* Adjusted for collapsed sidebar width */
}

.topbar-button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  text-decoration: none;
  transition: background-color 0.3s;
  font-size: 14px;
}

.topbar-button:hover {
  background-color: #0056b3;
}
</style>

<template>
  <div>
    <div class="sidebar" :class="{ 'expanded': isHovered }" @mouseenter="expandSidebar" @mouseleave="collapseSidebar">
      <div class="sidebar-header">
        <router-link class="navbar-brand" to="/">Calypso</router-link>
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
            <i :class="['fas', 'fa-bell', { 'active-icon': $route.path === '/fire-alarm-system' }]"></i>
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
        <!-- <li class="nav-item">
          <router-link class="nav-link" to="/smart-security-system">
            <i :class="['fas', 'fa-shield-alt', { 'active-icon': $route.path === '/smart-security-system' }]"></i>
            <span class="nav-text">Smart Security System</span>
          </router-link>
        </li> -->
        <li class="nav-item">
          <router-link class="nav-link" to="/power-meter-reading">
            <i :class="['fas', 'fa-lightbulb', { 'active-icon': $route.path === '/power-meter-reading' }]"></i>
            <span class="nav-text">Smart Energy Management System</span>
          </router-link>
        </li>
        <!-- <li class="nav-item">
          <router-link class="nav-link" to="/smart-air-quality-system">
            <i :class="['fas', 'fa-cloud', { 'active-icon': $route.path === '/smart-air-quality-system' }]"></i>
            <span class="nav-text">Smart Air Quality System</span>
          </router-link>
        </li> -->
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
          <router-link class="nav-link" to="/hybrid-aircon-system">
            <i :class="['fas', 'fa-fan', { 'active-icon': $route.path === '/hybrid-aircon-system' }]"></i>
            <span class="nav-text">Hybrid Aircon System</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="navbar">
      <div class="navbar-left">
        <span>{{ currentDate }}</span>
        <span>ITE College East</span>
        <span>{{ weather }} <img v-if="weatherIcon" :src="weatherIcon" alt="Weather Icon" class="weather-icon" /></span>
      </div>
      <div class="navbar-right">
        <span>{{ userName }}</span>
        <i class="fas fa-user"></i>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AppSidebar',
  data() {
    return {
      isHovered: false,
      currentDate: '',
      weather: 'Fetching weather...',
      weatherIcon: null,
      userName: 'User',
    };
  },
  mounted() {
    this.updateDateTime();
    this.fetchWeather();
    setInterval(this.updateDateTime, 1000); // Update every second
  },
  methods: {
    expandSidebar() {
      this.isHovered = true;
      this.$emit('update:expanded', true);
    },
    collapseSidebar() {
      this.isHovered = false;
      this.$emit('update:expanded', false);
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
.sidebar {
  width: 60px;
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

.sidebar.expanded {
  width: 200px;
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
  justify-content: center;
}

.sidebar.expanded .nav-link {
  justify-content: flex-start;
  padding-left: 20px;
}

.nav-link:hover {
  background-color: lightgrey;
  color: black;
}

.nav-link i {
  margin-right: 10px;
}

.nav-text {
  display: none;
}

.sidebar.expanded .nav-text {
  display: inline;
}

.active-icon {
  color: #007bff;
}

.navbar {
  width: calc(100% - 60px);
  height: 60px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #ccc;
  position: fixed;
  top: 0;
  right: 0;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: width 0.3s;
  z-index: 999;
  /* Ensure the navbar is above other content */
}

.sidebar.expanded+.navbar {
  width: calc(100% - 200px);
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
  /* Adjust this to ensure content does not overlap with the navbar */
  padding: 20px;
  transition: margin-left 0.3s;
}

.sidebar.expanded + .content {
  margin-left: 200px;
}
</style>

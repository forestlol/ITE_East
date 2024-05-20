<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light custom-navbar">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">ITE EAST</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Overview</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/power-meter-reading">Power Meter</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/water-meter-reading">Water Meter</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/iaq-devices-reading">IAQ Devices</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/bms-reading">BMS</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
  };
  </script>
  
  <style scoped>
  .custom-navbar {
    border-bottom: 2px solid #ccc; /* Adjust the color and thickness as needed */
  }
  </style>
  
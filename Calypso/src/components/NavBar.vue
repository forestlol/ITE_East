<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Calypso</router-link>
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
            <router-link class="nav-link" to="/" exact>Overview</router-link>
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
          <li class="nav-item">
            <router-link class="nav-link" to="/fire-alarm-system">Fire Alarm System</router-link>
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
.navbar {
  border-bottom: 2px solid #ccc;
}
.nav-link {
  color: #555;
  transition: color 0.3s;
  padding-left: 10px;
  padding-right: 10px;
}
.nav-link:hover {
  color: #007bff;
}
.router-link-active {
  font-weight: bold;
  color: #007bff;
}
</style>

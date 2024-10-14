<template>
    <div class="popup-content">
      <h3>Best Guidelines</h3>
      <div class="iaq-tables">
        <!-- Table 1 -->
        <h4>Table 1: Guideline Maximum Concentration for Specific Indoor Air Contaminants</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Parameters</th>
              <th>Average Time</th>
              <th>Limit for Acceptance Indoor Air Quality</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Carbon dioxide</td>
              <td>8 hours</td>
              <td>1800 / 1000</td>
              <td>mg/m3 / ppm</td>
            </tr>
            <tr>
              <td>Carbon monoxide</td>
              <td>8 hours</td>
              <td>10 / 9</td>
              <td>mg/m3 / ppm</td>
            </tr>
            <tr>
              <td>Formaldehyde</td>
              <td>8 hours</td>
              <td>120 / 0.1</td>
              <td>mg/m3 / ppm</td>
            </tr>
            <tr>
              <td>Ozone</td>
              <td>8 hours</td>
              <td>100 / 0.05</td>
              <td>mg/m3 / ppm</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Table 2 -->
        <h4>Table 2: Recommended Maximum Concentrations for Specific Classes of Contaminants</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Parameters</th>
              <th>Limit for Acceptable Indoor Air Quality</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Suspended particulate matter</td>
              <td>150</td>
              <td>mg/m3 / ppm</td>
            </tr>
            <tr>
              <td>Volatile organic compounds</td>
              <td>3</td>
              <td>ppm</td>
            </tr>
            <tr>
              <td>Total bacteria counts</td>
              <td>500</td>
              <td>CFU/m3</td>
            </tr>
            <tr>
              <td>Total fungal counts</td>
              <td>500</td>
              <td>CFU/m3</td>
            </tr>
          </tbody>
        </table>
  
        <!-- Table 3 -->
        <h4>Table 3: Guideline Values for Specific Physical Parameters</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Parameters</th>
              <th>Range for Acceptable Indoor Air Quality</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Air temperature</td>
              <td>22.5 - 25.5</td>
              <td>°C</td>
            </tr>
            <tr>
              <td>Relative humidity</td>
              <td>&lt; 70</td>
              <td>%</td>
            </tr>
            <tr>
              <td>Air movement</td>
              <td>&lt; 0.25</td>
              <td>m/s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'IAQGuidelines'
  };
  </script>
  
  <style scoped>
  .popup-content {
    padding: 20px;
  }
  .table {
    width: 100%;
    margin-bottom: 20px;
  }
  </style>
  
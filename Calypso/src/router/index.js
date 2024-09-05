import { createRouter, createWebHistory } from 'vue-router';
import OverviewPage from '@/views/OverviewPage.vue';
import WaterMeterReadingPage from '@/views/WaterMeterReadingPage.vue';
import IAQDevicesReadingPage from '@/views/IAQDevicesReadingPage.vue';
import BMSReadingPage from '@/views/BMSReadingPage.vue';
import FireAlarmSystem from '@/views/FireAlarmSystem.vue';
import PowerMeterReadingPage from '@/views/PowerMeterReadingPage.vue';
import PowerDeviceDetailPage from '@/views/PowerDeviceDetailPage.vue';
import SmartLandscapeSystem from '@/views/SmartLandscapeSystem.vue';
import SmartToiletSystem from '@/views/SmartToiletSystem.vue';
import SmartPestControlSystem from '@/views/SmartPestControlSystem.vue';
import SmartSecuritySystem from '@/views/SmartSecuritySystem.vue';
import SmartAirQualitySystem from '@/views/SmartAirQualitySystem.vue';
import AssetTaggingSystem from '@/views/AssetTaggingSystem.vue';
import SmartLightingSystem from '@/views/SmartLightingSystem.vue';
// import HybridAirconSystem from '@/views/HybridAirconSystem.vue';
import AlarmsNotificationsPage from '@/views/AlarmsNotificationsPage.vue';
import FaultCallTicket from '@/views/FaultCallTicket.vue';
import IndoorAirQuality from '@/views/IndoorAirQuality.vue';
import HybridAircon from '@/views/HybridAircon.vue';

const routes = [
  {
    path: '/',
    name: 'OverviewPage',
    component: OverviewPage,
  },
  {
    path: '/power-meter-reading',
    name: 'PowerMeterReading',
    component: PowerMeterReadingPage,
  },
  {
    path: '/power-meter-reading/:id',
    name: 'PowerDeviceDetail',
    component: PowerDeviceDetailPage,
    props: true,
  },
  {
    path: '/water-meter-reading',
    name: 'WaterMeterReadingPage',
    component: WaterMeterReadingPage,
  },
  {
    path: '/iaq-devices-reading',
    name: 'IAQDevicesReadingPage',
    component: IAQDevicesReadingPage,
  },
  {
    path: '/bms-reading',
    name: 'BMSReadingPage',
    component: BMSReadingPage,
  },
  {
    path: '/fire-alarm-system',
    name: 'FireAlarmReadingPage',
    component: FireAlarmSystem,
  },
  {
    path: '/smart-landscape-system',
    name: 'SmartLandscapeSystem',
    component: SmartLandscapeSystem
  },
  {
    path: '/smart-toilet-system',
    name: 'SmartToiletSystem',
    component: SmartToiletSystem
  },
  {
    path: '/smart-pest-control-system',
    name: 'SmartPestControlSystem',
    component: SmartPestControlSystem
  },
  {
    path: '/smart-security-system',
    name: 'SmartSecuritySystem',
    component: SmartSecuritySystem
  },
  {
    path: '/smart-air-quality-system',
    name: 'SmartAirQualitySystem',
    component: SmartAirQualitySystem
  },
  {
    path: '/asset-tagging-system',
    name: 'AssetTaggingSystem',
    component: AssetTaggingSystem
  },
  {
    path: '/Smart-lighting-system',
    name: 'SmartLightingSystem',
    component: SmartLightingSystem
  },
  // {
  //   path: '/hybrid-aircon-system',
  //   name: 'HybridAirconSystem',
  //   component: HybridAirconSystem
  // },
  {
    path: '/indoor-air-quality',
    name: 'IndoorAirQuality',
    component: IndoorAirQuality
  },
  {
    path: '/hybrid-aircon',
    name: 'HybridAircon',
    component: HybridAircon
  },
  {
    path: '/alarms-notifications',
    name: 'AlarmsNotifications',
    component: AlarmsNotificationsPage,
  },
  {
    path: '/quick-links',
    name: 'QuickLinks',
    component: FaultCallTicket,
  },
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import OverviewPage from '@/views/OverviewPage.vue';
import WaterMeterReadingPage from '@/views/WaterMeterReadingPage.vue';
import IAQDevicesReadingPage from '@/views/IAQDevicesReadingPage.vue';
import BMSReadingPage from '@/views/BMSReadingPage.vue';
import FireAlarmSystem from '@/views/FireAlarmSystem.vue';
import PowerMeterReadingPage from '@/views/PowerMeterReadingPage.vue';
import PowerDeviceDetailPage from '@/views/PowerDeviceDetailPage.vue';

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

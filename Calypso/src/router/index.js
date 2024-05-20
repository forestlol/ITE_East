import { createRouter, createWebHistory } from 'vue-router';
import OverviewPage from '@/views/OverviewPage.vue';
import PowerMeterReadingPage from '@/views/PowerMeterReadingPage.vue';
import WaterMeterReadingPage from '@/views/WaterMeterReadingPage.vue';
import IAQDevicesReadingPage from '@/views/IAQDevicesReadingPage.vue';
import BMSReadingPage from '@/views/BMSReadingPage.vue';

const routes = [
  {
    path: '/',
    name: 'OverviewPage',
    component: OverviewPage,
  },
  {
    path: '/power-meter-reading',
    name: 'PowerMeterReadingPage',
    component: PowerMeterReadingPage,
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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

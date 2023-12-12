import { createRouter, createWebHashHistory } from 'vue-router'
import Graficos from '../views/GraficosView.vue'


const routes = [
  {
    path: '/',
    name: 'Graficos',
    component: Graficos
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

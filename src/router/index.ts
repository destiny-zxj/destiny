import Path from '@/utils/Path'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Index',
    path: '/',
    redirect: Path.Main.url
  },
  {
    name: Path.Main.name,
    path: Path.Main.path,
    component: () => import('@/views/Main.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

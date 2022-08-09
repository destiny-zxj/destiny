import Path from '@/utils/Path'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    name: 'Index',
    path: '/',
    redirect: Path.Main.path
  },
  {
    name: Path.Main.name,
    path: Path.Main.path,
    component: () => import('@/views/Main.vue'),
    children: [
      {name: Path.Home.name, path: Path.Home.path, component: ()=>import('@/views/Home.vue')},
      {name: Path.LocalServer.name, path: Path.LocalServer.path, component: ()=>import('@/views/LocalServer.vue')},
      {name: Path.Settings.name, path: Path.Settings.path, component: ()=>import('@/views/Settings.vue')},
      {name: Path.Bookmark.name, path: Path.Bookmark.path, component: ()=>import('@/views/Bookmark.vue')}
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

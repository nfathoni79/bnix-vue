import { createWebHistory, createRouter } from 'vue-router'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'
import Base from '../views/Base.vue'
import Accounts from '../views/Accounts.vue'
import Transfers from '../views/Transfers.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Base,
    beforeEnter: (to, from) => {
      if (localStorage.getItem('token') == null) {
        return { name: 'login' }
      }
    },
    children: [
      {
        path: '',
        name: 'accounts',
        component: Accounts,
        alias: '/accounts',
      },
      {
        path: '/transfers',
        name: 'transfers',
        component: Transfers,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: NotFound,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

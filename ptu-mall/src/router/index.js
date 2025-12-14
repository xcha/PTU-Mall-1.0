import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/index.vue'
import LoginView from '../views/login/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: () => import('../views/detail/index.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/cart/index.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/index.vue'),
      children: [
        {
          path: '',
          name: 'adminIndex',
          component: () => import('../views/admin/components/index.vue'),
        },
        {
          path: 'category',
          name: 'adminCategory',
          component: () => import('../views/admin/components/Category.vue'),
        },
        {
          path: 'order',
          name: 'adminOrder',
          component: () => import('../views/admin/components/Order.vue'),
        },
        {
          path: 'product',
          name: 'adminProduct',
          component: () => import('../views/admin/components/Product.vue'),
        },
        {
          path: 'user',
          name: 'adminUser',
          component: () => import('../views/admin/components/User.vue'),
        },
      ],
    },
  ],
})
export default router

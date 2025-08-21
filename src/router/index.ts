import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import LoginPage from '../views/LoginView.vue';
import DashboardPage from '../views/DashboardView.vue';
import NotFoundPage from '../views/NotFoundView.vue';
import AuthService from '../services/authService';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login page',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'home',
    component: DashboardPage,
    meta: { requiresAuth: true}
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
  console.log('Navigating to:', to.path);

  const requiresAuth: boolean = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated: boolean = AuthService.checkAuth();

  console.log('requiresAuth:', requiresAuth);
  console.log('isAuthenticated:', isAuthenticated);

  if (!requiresAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    if (to.path !== '/login') {
      console.log('User not authenticated, redirecting to login');
      next('/login');
    } else {
      next();
    }
  } else if (to.path === '/login' && isAuthenticated) {
    console.log('User authenticated, redirecting to dashboard');
    next('/');
  } else if (requiresAuth && !isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    next('/login');
  } else {
    next();
  }
});

export default router;

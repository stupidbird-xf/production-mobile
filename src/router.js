import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const router =  new Router({
  // mode: 'history',
  base: '/', // process.env.NODE_ENV === 'production' ? '/dist/' :
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/materiel',
      name: 'materiel',
      component: () => import('./components/materiel.vue')
    }
  ]
});

export default router;

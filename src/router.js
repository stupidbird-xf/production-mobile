import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/pamier',
      name: 'home',
      component: Home
    },
    // {
    //   path: '/pamier/gift',
    //   name: 'gift',
    //   component: () => import('./views/gift.vue')
    // }
  ]
});

export default router;

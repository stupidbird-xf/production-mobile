import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vant from 'vant';
import './assets/reset.css';
import 'vant/lib/index.css';
import axios from './assets/axios';
import store from './vuex';

Vue.use(Vant);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');

window.onresize = setHtmlFontSize;
function setHtmlFontSize () {
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const htmlDom = document.getElementsByTagName('html')[0];
  htmlDom.style.fontSize = htmlWidth / 10 + 'px';
}
setHtmlFontSize();
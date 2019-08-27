import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: { // 初始化状态
    popMsg: {}
  },
  mutations: { // 处理状态
    SET_POPMSG(state, params) {
      state.popMsg = params;
    }
  },
  actions: {} // 提交改变后的状态
});

export default store;

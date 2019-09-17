import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';
const publicPath = process.env.NODE_ENV === 'production' ? process.env.NODE_TEST === 'true' ? '' : 'http://39.100.122.95:8080/code_test_manager' : 'http://39.100.122.95:8080/code_test_manager';

const getXhrPromise = (config) => {
  return new Promise((resolve) => {
    axios(config).then(res => {
      res.data = (typeof res.data === 'object' && res.data) || {};
      res.data._http_status = res.status;
      resolve(res.data);
    }).catch(() => {
      resolve();
    });
  });
};

axios.interceptors.response.use(res => {
  if (res.status === 200) {
    while (res.data.code === 101) {
      const urlStr = window.location.href
      const url = urlStr.split('&')[0]
      Object.keys(Cookies.get()).forEach(key => Cookies.remove(key))
      window.location.href = `https://reitschain.com/code/login?redirect_url=${url}`
      return false
    }
    return res;
  }
  Vue.prototype.$notify.error({
    title: '错误',
    message: res.data.msg || '网络错误，请刷新'
  });
  return false;
}, err => {
  Vue.prototype.$notify.error({
    title: '错误',
    message: err.msg || '网络错误，请刷新'
  });
  return false;
});

export default {
  all(params) {
    return axios.all(params);
  },
  spread(params) {
    return axios.spread(params);
  },
  get(url, data) {
    const config = {
      url: `${publicPath}${url}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      params: data
    };
    return getXhrPromise(config);
  },
  post(url, data) {
    let config = {
      url: `${publicPath}${url}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      data: qs.stringify(data)
    };
    return getXhrPromise(config);
  }
};

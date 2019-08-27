import axios from 'axios';
import qs from 'qs';

const getXhrPromise = (config) => {
  return new Promise((resolve) => {
    axios(config).then(res => {
      res.data = res.data || {};
      res.data._http_status = res.status;
      resolve(res.data);
    }).catch(err => {
      let { status } = err.response;
      err.response.data = err.response.data || {};
      err.response.data._http_status = status;
      resolve(err.response.data);
    });
  });
};

export default {
  all(params) {
    return axios.all(params);
  },
  spread(params) {
    return axios.spread(params);
  },
  get(url, data) {
    const config = {
      url,
      method: 'get',
      params: data
    };
    return getXhrPromise(config);
  },
  post(url, data, type) {
    let config = {
      url,
      method: 'post',
      data: qs.stringify(data),
      headers: {
        'Content-Type': type || 'application/x-www-form-urlencoded'
        // 'Token': 'https://testweiop.chengjuiot.com/a/p/guangxi-jins-cons-unpack-redpack.html?appid=jiangxizhongyan&barcode=fcLTgSPjSKfObXA8doVfskdixl&bn=fcLTgS&fvt=2018-02-23%2011:01:45&n=ce6c96b1b61317f9&pdi=jxtest&pdn=%E9%87%91%E5%9C%A3%28%E6%BB%95%E7%8E%8B%E9%98%81%C2%B7%E6%9B%B4%E4%B8%8A%E4%B8%80%E5%B1%82%E6%A5%BC%29%28%E7%9B%92%29&pdt=2&pin=true&res=1&st=5884&ts=1557219434080&vt=3198&sign=7e651f0a2885fd75db9b3963915d6778'
      }
    };
    return getXhrPromise(config);
  },
  postJson(url, data, type) {
    let config = {
      url,
      method: 'post',
      data,
      headers: {
        'Content-Type': type || 'application/x-www-form-urlencoded'
      }
    };
    return getXhrPromise(config);
  }
};

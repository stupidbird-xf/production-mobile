<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import wx from 'weixin-js-sdk';
import Cookies from 'js-cookie';
/* global AMap */

export default ({
  name: 'App',
  async mounted() {
    Cookies.remove('hasDraw');
    let result = await this.$http.post('/pamier/api/wechat/tokenjs', {
      url: window.location.href
    });
    if (result._http_status !== 200 || result.code !== 0) return;
    let {
      appid,
      timestamp,
      noncestr,
      signature
    } = result.data;
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appid, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名
      jsApiList: [
        'scanQRCode',
        'hideAllNonBaseMenuItem',
        'getLocation',
        'onMenuShareAppMessage',
        'onMenuShareTimeline', // 分享到朋友圈
        'hideOptionMenu',
        'hideMenuItems'
      ] // 必填，需要使用的JS接口列表
    });
    wx.ready(() => {
      wx.hideMenuItems({ // 分享只能分享给朋友，其他禁掉
        menuList: [
          'menuItem:copyUrl',
          'menuItem:share:qq',
          'menuItem:share:weiboApp',
          'menuItem:favorite',
          'menuItem:share:facebook',
          'menuItem:share:QZone',
          'menuItem:editTag',
          'menuItem:delete',
          'menuItem:copyUrl',
          'menuItem:originPage',
          'menuItem:readMode',
          'menuItem:openWithQQBrowser',
          'menuItem:openWithSafari',
          'menuItem:share:email',
          'menuItem:share:brand'
        ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
      });
      wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: res => {
          let pointAry = [res.longitude, res.latitude];
          this.getUserAddress(pointAry);
        },
        cancel: () => {
          window._hmt && window._hmt.push(['_trackEvent', '矿泉水微信登录', '获取地理位置', 'cancel']);
        },
        fail: (err) => {
          window._hmt && window._hmt.push(['_trackEvent', '矿泉水微信登录', '获取地理位置', 'fail']);
          window._hmt && window._hmt.push(['_trackEvent', '矿泉水微信登录', '失败原因', err.errMsg]);
        }
      });
    });
  },
  methods: {
    getUserAddress(pointAry) {
      AMap.plugin('AMap.Geocoder', () => {
        let Geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'all'
        });
        Geocoder.getAddress(pointAry, (status, result) => {
          if (status !== 'complete' || result.info !== 'OK') {
            return;
          }
          const addressInfo = result.regeocode.addressComponent;
          const provinceCode = `${addressInfo.adcode.substr(0, 3)}000`;
          const params = {
            longitude: pointAry[0],
            latitude: pointAry[1],
            province: addressInfo.province,
            city: addressInfo.city || addressInfo.province,
            cityCode: `${addressInfo.adcode.substr(0, 3)}${addressInfo.citycode}`,
            district: addressInfo.district,
            districtCode: addressInfo.adcode,
            provinceCode: provinceCode
          };
          if (provinceCode.startsWith('65')) {
            Cookies.set('canDraw', true);
          }
          Cookies.set('province_id', params.provinceCode);
          Cookies.set('city_id', params.cityCode);
          /* eslint-disable */
          console.log(params);
          console.log(addressInfo);
        });
      });
    }
  }
});
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  font-size: 30px;
  overflow-x: hidden;
}
</style>

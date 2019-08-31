<template>
  <div class="home">
    <van-row class="top-tip">
      <van-col span="17">
        <p>使用指南：<br/>1、在下方列表选择需要挂接的产品信息<br/>2、点击“挂接”按钮</p>
      </van-col>
      <van-col span="7">
        <img class="product-code-img" src="@/components/img/product-code-img.png" alt="">
      </van-col>
    </van-row>
    <div class="card">
      <div class="title">码信息</div>
      <div class="message">
        <p>类型：{{ codeMsg.type }}</p>
        <p>数量：{{ codeMsg.num }}</p>
      </div>
    </div>
    <div class="card">
      <div class="title">选择产品</div>
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="value"
          :options="productOptions"
          @change="changeValue"/>
      </van-dropdown-menu>
      <div
        v-if="showList"
        class="product-msg">
        <van-row class="list-title border-outside">
          <van-col class="border-inside" span="7">产品名称</van-col>
          <van-col class="border-inside" span="6">英文ID</van-col>
          <van-col class="border-inside" span="6">产品编码</van-col>
          <van-col class="border-inside" span="5">积分奖励</van-col>
        </van-row>
        <van-row>
          <van-col class="border-inside" span="7">{{ productMsg.proName }}</van-col>
          <van-col class="border-inside" span="6">{{ productMsg.sname }}</van-col>
          <van-col class="border-inside" span="6">{{ productMsg.signId }}</van-col>
          <van-col class="border-inside" span="5">{{ productMsg.reward }}</van-col>
        </van-row>
      </div>
    </div>
    <van-button
      class="confirm-btn"
      type="default"
      @click="bindProduct">确认挂接</van-button>
    <van-popup v-model="show">
      <div class="confirm-pop">
        <img
          class="close"
          @click="closePop"
          src="@/components/img/close.png">
        <p class="title">产品码挂接成功</p>
        <img
          class="success"
          src="@/components/img/success.png">
        <div class="content">
          <p><span class="name">产品名称：</span>{{ productMsg.proName }}</p>
          <p><span class="name">英文ID：</span>{{ productMsg.sname }}</p>
          <p><span class="name">产品编码：</span>{{ productMsg.signId }}</p>
          <p><span class="name">积分：</span>{{ productMsg.amount }}</p>
          <p><span class="name">码类型：</span>{{ productMsg.type }}</p>
          <p><span class="name">数量：</span>{{ productMsg.num }}</p>
        </div>
        <van-button
          class="confirm-btn"
          type="default"
          @click="confirmClick">确认</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      show: false,
      codeMsg: {},
      productMsg: {},
      id: '',
      backLogin: '',
      value: 0,
      productOptions: [
        { text: '请选择产品名称', value: 0 }
      ],
      proAddress: '',
      bindAddress: '',
      canLinkUp: false,
      showList: false,
      address: '',
      msgAllGet: false
    };
  },
  created() {
    // 判断是否是微信端打开
    // const userNavigator = navigator.userAgent;
    // eslint-disable-next-line
    let timer = setInterval(() => {
      if (!this.msgAllGet) {
        this.id = this.getUrlKey('id');
        this.backLogin = this.getUrlKey('backLogin');
        this.address = this.getUrlKey('address');
        if (this.backLogin !== '' && this.id !== '' && this.address !== '') {
          this.msgAllGet = true;
        }
      } else {
        clearInterval(timer);
        timer = null;
        // if (userNavigator.toLowerCase().match(/micromessenger/i) == 'micromessenger') {
        this.msgAllGet = true;
        this.getBatchById(this.id);
        // } else {
        //   this.$notify({
        //     title: '网络错误',
        //     message: '请在微信端打开页面',
        //     background: '#ffe1e1',
        //     duration: 3000
        //   });
        // }
      }
    }, 300);
  },
  methods: {
    changeValue() {
      this.getMessage();
    },
    getUrlKey(name) {
      // eslint-disable-next-line
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null;
    },
    closePop() {
      this.show = false;
    },
    async getBatchById(id) {
      let result = await this.$http.post('/backapi/vipproduct/getBatchById', {
        backLogin: this.backLogin,
        id: id
      });
      if (result._http_status !== 200 || result.code !== 0) {
        this.$notify({
          message: result.msg,
          color: '#ad0000',
          background: '#ffe1e1',
          duration: 3000
        });
        return;
      }
      // 1-防伪码   2-防伪码+溯源码  3-溯源码
      this.codeMsg.type = result.data.type === 1 ? '防伪码' : result.data.type === 2 ? '防伪码+溯源码' : '溯源码';
      this.bindAddress = result.data.proAddress; // 产品码地址
      this.codeMsg.num = result.data.num;
      this.addressList();
    },
    async getMessage() {
      let result = await this.$http.post('/backapi/vipproduct/getProductById', {
        backLogin: this.backLogin,
        id: this.value
      });
      this.showList = true;
      this.canLinkUp = true;
      this.proAddress = result.data.proAddress; // 产品地址
      this.productMsg = {
        amount: result.data.amount, 
        type: result.data.type === 1 ? '防伪码' : result.data.type === 2 ? '防伪码+溯源码' : '溯源码',
        num: result.data.num,
        signId: result.data.signId,
        proName: result.data.proName,
        sname: result.data.sname,
        reward: result.data.reward,
        assetId: result.data.assetId
      }
    },
    async addressList() {
      let result = await this.$http.post('/backapi/vipproduct/addressList', {
        backLogin: this.backLogin,
      });
      if (result._http_status !== 200 || result.code !== 0) {
        this.$notify({
          message: result.msg,
          color: '#ad0000',
          background: '#ffe1e1',
          duration: 2000
        });
        return;
      }
      result.data.forEach((item) => {
        let obj = {};
        obj.text = item.proName;
        obj.value = item.id;
        this.productOptions.push(obj);
      });
    },
    async confirmClick() {
      const busiJson = JSON.stringify({
          proAddress: this.proAddress,
          bindAddress: this.bindAddress,
          num: this.productMsg.num,
          info: "绑定产品"
        });
      let result = await this.$http.post('/backapi/vipproduct/coinMoney', {
        backLogin: this.backLogin,
        productAddress: this.proAddress, // 产品地址
        address: this.address, // 用户地址
        busiJson: busiJson,
        assetId: this.productMsg.assetId
      });
      if (result._http_status !== 200 || result.code !== 0) {
        this.$notify({
          message: result.msg,
          color: '#ad0000',
          background: '#ffe1e1',
          duration: 3000
        });
      }
    },
    async bindProduct() {
      if (!this.canLinkUp) return;
      if (this.value === 0) {
        this.$notify({
          message: '请选择挂接产品',
          color: '#ad0000',
          background: '#ffe1e1',
          duration: 3000
        });
        return;
      }
      // alert(`proAddress--->${this.proAddress}bindAddress--->${this.bindAddress}`);
      let result = await this.$http.post('/backapi/vipproduct/bindProduct', {
        backLogin: this.backLogin,
        productAddress: this.proAddress,
        batchAddress: this.bindAddress
      });
      if (result._http_status !== 200 || result.code !== 0) {
        this.$notify({
          message: result.msg,
          color: '#ad0000',
          background: '#ffe1e1',
          duration: 3000
        });
        return;
      }
      this.show = true;
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  .top-tip {
    background-color: #fff;
    line-height: 48px;
    padding: 15px 11px 15px 32px;
    .product-code-img {
      width: 221px;
    }
  }
  .card {
    background-color: #fff;
    margin-top: 20px;
    line-height: 60px;
    .title {
      font-size: 28px;
      font-weight: 800;
      height: 90px;
      line-height: 90px;
      border-bottom: 1px solid #e1e1e1;
      padding-left: 30px;
      position: relative;
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 8px;
        height: 40px;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        background-color: #169bd5;
        top: 50%;
        transform: translate(0, -50%);
      }
    }
    .message {
      padding-left: 30px;
    }
    .product-msg {
      width: 690px;
      margin: 34px auto 32px;
      border: 1px solid #e1e1e1;
      text-align: center;
      .list-title {
        background-color: #f5f5f5;
      }
      .border-outside {
        border-bottom: 1px solid #e1e1e1;
      }
      .border-inside {
        border-right: 1px solid #e1e1e1;
        &:last-child {
          border: none;
        }
      }
    }
  }
  .confirm-btn {
    display: block;
    width: 400px;
    height: 88px;
    line-height: 88px;
    background-color: #169bd5;
    color: #fff;
    font-size: 28px;
    font-weight: 600px;
    border-radius: 6px;
    margin: 40px auto 0;
  }
  .confirm-pop {
    width: 550px;
    padding: 76px 40px 46px;
    position: relative;
    .close {
      width: 40px;
      position: absolute;
      right: 30px;
      top: 30px;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
      text-align: center;
    }
    .success {
      display: block;
      margin: 60px auto 38px;
      width: 109px;
    }
    .content {
      line-height: 48px;
      color: #737373;
      .name {
        display: inline-block;
        width: 180px;
      }
    }
  }
}
</style>

<style lang="less">
  .van-popup {
    border-radius: 6px;
  }
  .product-msg {
    .van-col {
      height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>

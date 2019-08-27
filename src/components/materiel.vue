<template>
  <div class="materiel">
    <img
      class="top-img"
      src="./img/top-img.png">
      <div class="card">
        <div class="title">码信息</div>
        <van-row class="">
          <van-col span="17">
            <p>
              <span>接受企业：</span>
              <span></span>
            </p>
            <p>
              <span>营业执照编号</span>
              <span></span>
            </p>
          </van-col>
          <van-col span="7">
            <img class="header-img" src="@/components/img/header-img.png" alt="">
          </van-col>
        </van-row>
      </div>
      <div class="card">
        <div class="title">码信息</div>
        <div class="form">
          <van-field
            v-model="username"
            required
            clearable
            label="用户名"
            right-icon="question-o"
            placeholder="请输入用户名"
            @click-right-icon="$toast('question')"/>
            <van-field
              v-model="username"
              required
              clearable
              label="用户名"
              right-icon="question-o"
              placeholder="请输入用户名"
              @click-right-icon="$toast('question')"/>
        </div>
      </div>
  </div>
</template>

<script>
export default({
  name: 'Materiel',
  data() {
    return {};
  },
  methods: {}
})
</script>

<style lang="less" scoped>
  .materiel {}
</style>
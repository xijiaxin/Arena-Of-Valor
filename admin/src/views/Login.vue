<template>
  <div>
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      model: {}
    }
  },
  methods: {
    async login() {
      // console.log(this.model)
      const res = await this.$http.post('/login', this.model)
      // console.log(res.data)
      // 用localStorage.token对token进行存储
      localStorage.token = res.data.token
      // 也可以用sessionStorage进行存储，俩者区别为sessionStorage关闭浏览器就删除token
      // 而localStorage的token不会删除，只要打开的是相同的站点可以直接使用
      // sessionStorage.token = res.data.token
      // token判断完成后，进行页面跳转
      this.$router.push('/')
      this.$message({
        type: 'success',
        message: '登录成功'
      })
    }
  }
}
</script>
<style>
.login-card{
  width: 50rem;
  margin: 20rem auto;
}
</style>

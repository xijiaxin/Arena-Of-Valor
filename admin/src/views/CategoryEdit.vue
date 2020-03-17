<template>
    <div class="about">
      <!-- 通过三位用算符，判断是否携带id值，低耦合表现-->
        <h1>{{id ? '编辑' : '新建'}}分类</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
          <!-- 上级分类 -->
            <el-form-item label="上级分类">
              <!-- 用el-select下拉菜单来获取和选择上级菜单选项，在通过双向绑定到model.parent -->
                <el-select v-model="model.parent">
                  <!-- lable：表示显示什么内容  value：表示真正显示的值 -->
                  <el-option v-for="item in parents" :key="item._id" :label="item.name" :value="item._id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  // 路由的时候，就把id值通过props携带过来
  props: {
    id: {}
  },
  data() {
    return {
      model: {},
      parents: []
    }
  },
  methods: {
    async save() {
      let res
      if (this.id) {
        res = await this.$http.put(`rest/categories/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/categories', this.model)
      }
      this.$router.push('/categories/list')
      console.log(res)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async fetch() {
      const res = await this.$http.get(`rest/categories/${this.id}`)
      this.model = res.data
    },
    async fetchParents() {
      const res = await this.$http.get('rest/categories')
      this.parents = res.data
    }
  },
  created() {
    this.id && this.fetch()
    this.fetchParents()
  }
}
</script>

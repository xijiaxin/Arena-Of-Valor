<template>
    <div class="about">
      <!-- 通过三位用算符，判断是否携带id值，低耦合表现-->
        <h1>{{id ? '编辑' : '新建'}}文章</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
          <!-- 上级分类 -->
            <el-form-item label="所属分类">
              <!-- 用el-select下拉菜单来获取和选择所属分类选项，在通过双向绑定到model.categories -->
                <el-select v-model="model.categories" multiple>
                  <!-- lable：表示显示什么内容  value：表示真正显示的值 -->
                  <el-option v-for="item in categories" :key="item._id" :label="item.name" :value="item._id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="model.title"></el-input>
            </el-form-item>
            <el-form-item label="详情">
                <vue-editor v-model="model.body" useCustomImageHandler @image-added="handleImageAdded"></vue-editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
export default {
  // 路由的时候，就把id值通过props携带过来
  props: {
    id: {}
  },
  components: {
    VueEditor
  },
  data() {
    return {
      model: {},
      categories: []
    }
  },
  methods: {
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await this.$http.post('upload', formData)
      Editor.insertEmbed(cursorLocation, 'image', res.data.url)
      resetUploader()
    },
    async save() {
      let res
      if (this.id) {
        res = await this.$http.put(`rest/articles/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/articles', this.model)
      }
      this.$router.push('/articles/list')
      console.log(res)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async fetch() {
      const res = await this.$http.get(`rest/articles/${this.id}`)
      this.model = res.data
    },
    async fetchCatgories() {
      const res = await this.$http.get('rest/categories')
      this.categories = res.data
    }
  },
  created() {
    this.id && this.fetch()
    this.fetchCatgories()
  }
}
</script>

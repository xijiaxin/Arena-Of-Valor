<template>
    <div class="about">
      <!-- 通过三位用算符，判断是否携带id值，低耦合表现-->
        <h1>{{id ? '编辑' : '新建'}}英雄</h1>
        <el-form label-width="120px" @submit.native.prevent="save">
            <el-tabs value="basic" type="border-card">
              <el-tab-pane label="基本信息" name="basic">
                <el-form-item label="名称">
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item label="称号">
                <el-input v-model="model.title"></el-input>
            </el-form-item>
            <el-form-item label="头像">
              <el-upload class="avatar-uploader" :action="$http.defaults.baseURL + '/upload'" :show-file-list="false" :on-success="afterUpload">
                <img v-if="model.avatar" :src="model.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <!-- 类型创建比较特殊，首先用el-select下拉菜单显示内容，数据双向绑定到了model.categories中去
            model中categories的数据时通过fethCategories（）请求到的一个数组，所以在使用v-for循环遍历出
            每个数据，其中需要用到label表示显示什么内容，value表示内容的实际，还需要必须要有的key值为_id -->
            <el-form-item label="类型">
              <el-select v-model="model.categories" multiple>
                <el-option v-for="item of categories" :label="item.name" :value="item._id" :key="item._id"></el-option>
              </el-select>
            </el-form-item>
            <!--el-rate是一个打分组件，其中默认值为0  并且对于这种v-model="model.scores.difficult"中间是
              多层级的需要把中间的地址创建在data里面，不然会找不到，并且要配合使用Objetc.assign({},现有的默认数据,获取到的数据)
              这个方法，不然还是找不到 -->
            <el-form-item label="难度">
                <el-rate v-model="model.scores.difficult" :max="9" show-score style="margin-top:0.6rem"></el-rate>
            </el-form-item>
            <el-form-item label="技能">
                <el-rate v-model="model.scores.skills" :max="9" show-score style="margin-top:0.6rem"></el-rate>
            </el-form-item>
            <el-form-item label="攻击">
                <el-rate v-model="model.scores.attack" :max="9" show-score style="margin-top:0.6rem"></el-rate>
            </el-form-item>
            <el-form-item label="生存">
                <el-rate v-model="model.scores.suivive" :max="9" show-score style="margin-top:0.6rem"></el-rate>
            </el-form-item>
            <el-form-item label="顺风出装">
              <el-select v-model="model.items1" multiple>
                <el-option v-for="item of items" :label="item.name" :value="item._id" :key="item._id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="逆风出装">
              <el-select v-model="model.items2" multiple>
                <el-option v-for="item of items" :label="item.name" :value="item._id" :key="item._id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="使用技巧">
              <el-input type="textarea" v-model="model.usageTips"></el-input>
            </el-form-item>
            <el-form-item label="对抗技巧">
              <el-input type="textarea" v-model="model.battleTips"></el-input>
            </el-form-item>
            <el-form-item label="团战思路">
              <el-input type="textarea" v-model="model.teamTips"></el-input>
            </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="技能" name="skills">
                <el-button @click="model.skills.push({})"><i class="el-icon-plus"></i>添加技能</el-button>
                <el-row type="flex" style="flex-wrap: wrap">
                  <el-col :md="12" v-for="(item,i) in model.skills" :key="i">
                    <el-form-item label="名称">
                      <el-input v-model="item.name"></el-input>
                    </el-form-item>
                    <el-form-item label="图标">
                      <el-upload class="avatar-uploader" :action="$http.defaults.baseURL + '/upload'" :show-file-list="false" :on-success="res => $set(item, 'icon', res.url)">
                        <img v-if="item.icon" :src="item.icon" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </el-form-item>
                    <el-form-item label="描述">
                      <el-input v-model="item.description" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="小提示">
                      <el-input v-model="item.tips" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button size="small" type="danger" @click="model.skills.splice(i, 1)">删除</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
            <el-form-item style="margin-top: 1rem;">
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
      items: [],
      categories: [],
      model: {
        name: '',
        avatar: '',
        scores: {
          difficult: 0
        },
        skills: []
      }
    }
  },
  methods: {
    afterUpload(res) {
      console.log(res)
      // this.$set(this.model, 'avatar', res.url)
      this.model.avatar = res.url
    },
    async save() {
      let res
      if (this.id) {
        res = await this.$http.put(`rest/heroes/${this.id}`, this.model)
      } else {
        res = await this.$http.post('rest/heroes', this.model)
      }
      this.$router.push('/heroes/list')
      console.log(res)
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async fetch() {
      const res = await this.$http.get(`rest/heroes/${this.id}`)
      // this.model = res.data 使用这种方法赋值就等于直接把res.data里面的内容直接覆盖给了
      // this.model，就可能导致一些资源无法访问到所以采取新的赋值方法
      // 这种赋值方法可以称为数据的合并 Objetc.assign({},现有的默认数据,获取到的数据)
      // 使用这种方法并不会覆盖掉this.model里面的数据，而是通过先后数据进行拼接，有的改掉，没有的加上
      this.model = Object.assign({}, this.model, res.data)
    },
    async fetchCategories() {
      const res = await this.$http.get('rest/categories')
      this.categories = res.data
    },
    async fetchItems() {
      const res = await this.$http.get('rest/items')
      this.items = res.data
    }
  },
  created() {
    this.id && this.fetch()
    this.fetchCategories()
    this.fetchItems()
  }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 7rem;
    height: 7rem;
    line-height: 7rem;
    text-align: center;
  }
  .avatar {
    width: 7rem;
    height: 7rem;
    display: block;
  }
</style>

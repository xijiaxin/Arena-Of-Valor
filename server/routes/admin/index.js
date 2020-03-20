module.exports = app =>{
    const express = require('express')
    const router = express.Router({
        mergeParams: true
    })

    const jwt = require('jsonwebtoken')
    const AdminUser = require('../../models/AdminUser')
    const assert = require('http-assert')

    // 登录校验中间件
    const authMiddleware = require('../../middleware/auth')
    // 模型中间件
    const resourceMiddleware = require('../../middleware/resource')

    // 创建新的资源列表接口
    router.post('/',async(req, res) => {
       const model = await req.Model.create(req.body)
       res.send(model)
    })
    // 获取资源列表接口
        //其中populate方式是取出其中字段关联的内容
    router.get('/', async(req,res) => {
        // console.log(req.user)
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
    })
     // 获取某个资源详情接口
    router.get('/:id',async(req,res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })
     // 通过id更改某个资源的名称
    router.put('/:id',async(req,res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
    })
    // 删除资源接口
    router.delete('/:id',async(req,res) => {
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success: true
        })
     })
    //  资源路由接口
    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)
    // 上传接口
    const multer = require('multer')
    const upload = multer({dest: __dirname + '/../../uploads'})
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'),async(req,res) =>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })
    //登录接口
    app.post('/admin/api/login',async(req,res) => {
        // 通过结构赋值的方法，直接得到req.body中的username，password
        const { username,password } = req.body
        // 1、根据用户名找用户，并且在前端http.js采取错误提醒处理
        // 第一步，将用户名引用进来
        // const AdminUser = require('../../models/AdminUser')
        // 创建一个user 通过findOne（）来规定找一个条数据，这个数据的形式位键值对方式
        const user = await AdminUser.findOne({
            username: username
        }).select('+password')
        // 得到用户名后进行判断,判断有俩种方法，之前正常使用的if判断，或者现在用assert判断
         assert(user, 422, '用户不存在')
        // if(!user) {
        //     // 在设置一个状态码422，让系统知道返回值不是一个正常状态
        //     return res.status(422).send({
        //         message: '用户名不存在'
        //     })
        // }
        // 2、校验密码
        const isValid = require('bcryptjs').compareSync(password, user.password)
        // 用asster写报错判断
        // assert(isValid, 422, '密码错误')
        if(!isValid){
            return res.status(422).send({
                message: '密码错误'
            })
        }
        // 3、返回token
        // 安装模块 jsonwebtoken  npm i jsonwebtoken

        const token = jwt.sign({ id: user._id }, app.get('secret'))
        res.send({token})
    })
// 错误处理函数
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}
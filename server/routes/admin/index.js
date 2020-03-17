module.exports = app =>{
    const express = require('express')
    const router = express.Router({
        mergeParams: true
    })
    // 创建新的分类列表接口
    router.post('/',async(req,res) => {
       const model = await req.Model.create(req.body)
       res.send(model)
    })
    // 获取分类列表接口
        //其中populate方式是取出其中字段关联的内容
    router.get('/',async(req,res) => {
        const queryOptions = {}
        if(req.Model.modelName === 'Category'){
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
    })
     // 获取某个分类详情接口
    router.get('/:id',async(req,res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })
     // 通过id更改某个分类的名称
    router.put('/:id',async(req,res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
    })
    // 删除接口
    router.delete('/:id',async(req,res) => {
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success: true
        })
     })
    app.use('/admin/api/rest/:resource', async(req,res,next) =>{
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    },router)
    const multer = require('multer')
    const upload = multer({dest: __dirname + '/../../uploads'})
    app.post('/admin/api/upload',upload.single('file'),async(req,res) =>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })
}
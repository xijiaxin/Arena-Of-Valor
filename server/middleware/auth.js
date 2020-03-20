module.exports = options => {
    const jwt = require('jsonwebtoken')
    const AdminUser = require('../models/AdminUser')
    const assert = require('http-assert')
    return async(req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        // 用assert写错误判断 assert(判断条件， 返回值， 弹出提示) 
        assert(token, 401, '请先提供 jwt token')
        const { id } = jwt.verify(token, req.app.get('secret'))
        assert(id, 401, '无效的jwt token')
        req.user = await AdminUser.findById(id)
        assert(req.user, 401, '请先登录')
        // console.log(req.user)
        await next()
    }
}
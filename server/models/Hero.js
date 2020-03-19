const mongoose = require('mongoose')
// 英雄模型定义
const schema = new mongoose.Schema({
    // 英雄名称
    name: {type: String},
    // 英雄头像
    avatar: {type: String},
    // 英雄称号
    title: {type: String},
    // 英雄分类定位，与categoriy有关联关系，并且一个英雄可能有
    // 俩个定位，所以命名为categories
    categories: [{type: mongoose.SchemaTypes.ObjectId, ref:'Category'}],
    // 技能评分，可以定义成数组，再通过索引进行取值操作，但不如直接
    // 定义成对象，方便使用
    scores: {
        difficult: {type: Number},
        skills: {type: Number},
        attack: {type: Number},
        suivive: {type: Number}
    },
    // 定义技能，在技能页面不仅有名称，还有头像，以及技能介绍
    // 需要多个字段同时显示，所以使用数组定义后建立对象
    skills: [{
        icon: {type : String},
        name: {type : String},
        description: {type : String},
        tips: {type : String}
    }],
    // 装备方面，有俩套出装，所以定义items1，items2 进行区分，
    // 其中数据与之前写好的Item模型相关
    items1: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Item'}],
    items2: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Item'}],
    // 使用技巧、对战技巧、团战思路模型建立
    usageTips: {type : String},
    battleTips: {type : String},
    teamTips: {type : String},
    // 搭档模型建立有英雄以及为什么这俩个可以成为搭档，
    // 只是多了一个文本描述，所以直接在加以恶个description就可以
    partners: [{
        hero: {type: mongoose.SchemaTypes.ObjectId, ref: 'hero'},
        description: {type: String}
    }]

})
module.exports = mongoose.model('Hero',schema)
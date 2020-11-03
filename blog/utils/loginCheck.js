const { ResError } = require("../model/model.js")

const loginCheck = async (ctx, next)=>{
    if(ctx.session.username){ // 已登录
        await next()
    }else{
        ctx.body = new ResError("未登录")
    }
}

module.exports = {
    loginCheck
}
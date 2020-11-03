const router = require('koa-router')()

router.prefix('/api/user')

const { ResSuccess,ResError } = require("../model/model.js")
const { login } = require("../controller/user.js")

router.post('/login', async (ctx, next) => {
    // let { username,password } = ctx.query
    let { username,password } = ctx.request.body

    let result = await login(username, password)
    if(result.username){
        ctx.session.username = result.username
        ctx.session.realname = result.realname
        ctx.body = new ResSuccess()
    }else{
        ctx.body = new ResError("登录失败")
    }
});


module.exports = router

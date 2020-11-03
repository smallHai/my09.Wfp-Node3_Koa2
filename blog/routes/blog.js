const router = require('koa-router')()

router.prefix('/api/blog')


const { ResSuccess,ResError } = require("../model/model.js")
const { getList,getDetail,addBlog,updateBlog,deleteBlog } = require("../controller/blog.js")
const { loginCheck } = require("../utils/loginCheck.js")

router.get('/list', async (ctx, next) => {
    let keyword = ctx.query.keyword || ""
    let author = ctx.query.author || ""

    if(ctx.query.isadmin){
        if(ctx.session.username ==null){
            ctx.body = new ResError("未登录")
        }else{
            author = ctx.session.username
        }
    }

    let listData = await getList(author, keyword)
    ctx.body = new ResSuccess(listData, "OK")
})

router.get('/detail', async (ctx, next) => {
    let id = ctx.query.id || ""

    let detailData = await getDetail(id)
    ctx.body = new ResSuccess(detailData, "OK")
})

router.post('/add', loginCheck, async (ctx, next) => {
    ctx.request.body.author = ctx.session.username

    let blogData = await addBlog(ctx.request.body)
    ctx.body = new ResSuccess(blogData, "OK")
})

router.post('/delete', loginCheck, async (ctx, next) => {
    let id = ctx.query.id || ""
    let author = ctx.session.username

    let deleteResult = await deleteBlog(id, author)
    if(deleteResult){
        ctx.body = new ResSuccess()
    }else{
        ctx.body = new ResError("删除失败")
    }
})

router.post('/update', loginCheck, async (ctx, next) => {
    let id = ctx.query.id || ""

    let updateResult = await updateBlog(id, ctx.request.body)
    if(updateResult){
        ctx.body = new ResSuccess()
    }else{
        ctx.body = new ResError("更新失败")
    }
})

module.exports = router

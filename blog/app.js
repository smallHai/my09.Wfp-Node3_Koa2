const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const fs = require("fs")
const path = require("path")
const morgan = require("koa-morgan")
const session = require("koa-generic-session")
const redisStore = require("koa-redis")
const { redisConfig } = require('./db/redis.js')


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(logger())
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// morgan
// const ENV = process.env.NODE_ENV
// if(ENV ==="dev"){
//     app.use(morgan('dev', {
//         stream: process.stdout,
//     }));
// }else{
    let fileName = path.join(__dirname, "logs", "access.log")
    let writeStream = fs.createWriteStream(fileName, {
        flags: "a"
    })
    app.use(morgan('combined', {
        stream: writeStream,
    }));
// }

// session
app.keys = ["mk_node"] // 密匙
app.use(session({
    cookie: {
        path: "/",
        httpOnly: true,
        maxAge: 24*60*60*1000
    },
    store: redisStore({
        // client: redisClient
        // all: "127.0.0.1:6379"
        all: `${redisConfig.host}:${redisConfig.port}`
    })
}))

// routes
const index = require('./routes/index')
const user = require('./routes/user')
const blog = require('./routes/blog')
app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app

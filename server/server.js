const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
const favicon =  require('serve-favicon')
const session = require('express-session');
const serverRender = require('./util/server-render')
const isDev = process.env.NODE_ENV === 'development'

const app = express()



app.use(bodyParser.json()) // 把application/json的数据转换成req.body上的数据
app.use(bodyParser.urlencoded({ extended: false })) // 将application/x-www-form-urlencoded的数据转换成req.body上的数据

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tids',
  resave: false, // 是否每次请求都重新生成cookie
  saveUninitialized: false,
  secret: 'react cnode class', // 随便生成字符串加密cookie
}))

app.use(favicon(path.join(__dirname,'../favicon.ico')))

app.use('/api/user',require('./util/handle-login'))
app.use('/api',require('./util/proxy'))

if (!isDev) {
  //  nodejs 中 require 不会去读default里面的内容，
  const serverEntry = require('../dist/app-server')

  //  不加utf8为buffer的数据格式，加了之后为字符串
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')

  // '/public'开头的文件，全部当做静态文件处理，不走路由这一层,全部指向dist目录
  app.use('/public', express.static(path.join(__dirname, '../dist')))

  app.get('*', function (req, res, next) {
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.use(function(err, req, res, next){
  console.log(err)
  res.status(500).send(err)
})

app.listen(3333, function () {
  console.log('server is listening on 3333')
})

//  服务端渲染关键点
//  1、const ReactSSR = require('react-dom/server')
//  2、const serverEntry =  require('../dist/app').default 里的内容为commonjs2的规范
//  3、ReactSSR.renderToString(serverEntry)  用renderToString方法解析

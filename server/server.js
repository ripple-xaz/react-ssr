const express = require('express');
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')


const isDev = process.env.NODE_ENV === 'development' ;

const app = express()
// '/public'开头的文件，全部当做静态文件处理，不走路由这一层,全部指向dist目录



if(!isDev){
  //nodejs 中 require 不会去读default里面的内容，
  const serverEntry = require('../dist/server-entry').default
  //所有引用文件路径的方式，去用path去解析一下,保证不会出错
  //不加utf8为buffer的数据格式，加了之后为字符串
  const template = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8')
  app.use('/public',express.static(path.join(__dirname,'../dist')))

  app.get('*',function(req,res){
    const appString =   ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!-- app -->',appString))
  })
}else{
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.listen(3333,function(){
    console.log('server is listening on 3333')
})

//服务端渲染关键点
//1、const ReactSSR = require('react-dom/server')
//2、const serverEntry =  require('../dist/server-entry').default 里的内容为commonjs2的规范
//3、ReactSSR.renderToString(serverEntry)  用renderToString方法解析
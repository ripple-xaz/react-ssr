const path = require('path');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base')
//  扔出一个webpack的配置对象
module.exports = webpackMerge(baseConfig,{
  target:'node',//  打包出来的内容是使用在哪一个执行环境中
  entry:{
    app:path.join(__dirname,'../server/app-server.js')
  },
  externals: Object.keys(require('../package.json').dependencies), // 在这里面指定的某些包，不打包输出到js里面
  output:{
    filename:'app-server.js',// 服务端没有缓冲的概念
    libraryTarget:'commonjs2' //  模块方案 UMD、AMD、CMD、commonjs
  }
})
// 不用public 的静态资源的路径 'app.hash.js'
// 用了public 的静态资源的路径 '/public/app.hash.js'

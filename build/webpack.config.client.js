const path = require('path');
const HTMLPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base')
const webpack = require('webpack')
const isDEV = process.env.NODE_ENV === 'development'

//  扔出一个webpack的配置对象
const config =webpackMerge(baseConfig,{
  entry:{
      app:path.join(__dirname,'../client/app.js')
  },
  output:{
      filename: '[name].[hash].js',
  },
  plugins:[
    new HTMLPlugin({
      template: path.join(__dirname,'../template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname,'../server.template.ejs'),
      filename: 'server.ejs'
    })
  ]
})

// 不用public 的静态资源的路径 'app.hash.js'
// 用了public 的静态资源的路径 '/public/app.hash.js'

if (isDEV){
    config.entry = {
        app:[ //包含很多文件，全部打包到output
            'react-hot-loader/patch',//热加载的一个模块
            path.join(__dirname,'../client/app.js')
        ]

    }
    config.devServer = {
        host: '0.0.0.0', //方便别人连接你的IP进行调试
        port: '8888',
        contentBase: path.join(__dirname,'../public'), //devServer静态文件的位置
        hot:true,
        overlay:{ //有错误是弹窗提示
            errors:true //之弹出错误信息，不弹出warning
        },
        publicPath:'/public/',//要访问静态资源路径，必须要在前面加 '/public' 才能访问到
        historyApiFallback:{ //配置对应关系
            index:'/public/index.html' // 404s will fallback to '/public/index.html'
        },
        proxy:{
          '/api': 'http://localhost:3333'
        }
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}else{

}

module.exports = config

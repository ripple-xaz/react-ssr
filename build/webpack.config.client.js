const path = require('path');
const HTMLPlugin = require('html-webpack-plugin')

const webpack = require('webpack')
const isDEV = process.env.NODE_ENV === 'development'

//扔出一个webpack的配置对象
config = {
    entry:{
        app:path.join(__dirname,'../client/client-entry.js')
    },
    output:{
        filename:'[name].[hash].js',
        path:path.join(__dirname,'../dist'),
        publicPath:'/public/' //最终js的访问路径为'/public'
    },
    module:{
        rules:[
            {
              enforce:'pre',//在执行代码编译之前，执行eslint-loader
              test:/.(js|jsx)$/,
              loader:'eslint-loader',
              exclude:[//不eslint 以下路径
                  path.join(__dirname,'../node_modules'),
                  path.join(__dirname,'../client/client-entry.js')
              ]
            },
            {
                test:/.jsx$/, //正则匹配，以jsx结尾的文件
                loader:'babel-loader' //用babel-loader去进行编译，babel-loader是个插件，并不包含babel核心代码，要安装babel-core
            },
            {
                test:/.js$/, //正则匹配，以jsx结尾的文件
                loader:'babel-loader', //用babel-loader去进行编译，babel-loader是个插件，并不包含babel核心代码，要安装babel-core
                exclude:[ //不babel以下路径的文件
                    path.join(__dirname,'../node_modules')
                ]
            }
        ]
    },
    plugins:[
        new HTMLPlugin({
            template:path.join(__dirname,'../template.html')
        })
    ]
}
// 不用public 的静态资源的路径 'app.hash.js'

// 用了public 的静态资源的路径 '/public/app.hash.js'

if (isDEV){
    config.entry = {
        app:[ //包含很多文件，全部打包到output
            'react-hot-loader/patch',//热加载的一个模块
            path.join(__dirname,'../client/client-entry.js')
        ]

    }
    config.devServer = {
        host:'0.0.0.0', //方便别人连接你的IP进行调试
        port:'8888',
        contentBase:path.join(__dirname,'../public'), //devServer静态文件的位置
        hot:true,
        overlay:{ //有错误是弹窗提示
            errors:true //之弹出错误信息，不弹出warning
        },
        publicPath:'/public/',//要访问静态资源路径，必须要在前面加 '/public' 才能访问到
        historyApiFallback:{ //配置对应关系
            index:'/public/index.html' // 404s will fallback to '/public/index.html'
        }
    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}else{

}

module.exports = config

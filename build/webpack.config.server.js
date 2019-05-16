const path = require('path');
const HTMLPlugin = require('html-webpack-plugin')

//扔出一个webpack的配置对象
module.exports = {
    target:'node',//打包出来的内容是使用在哪一个执行环境中
    entry:{
        app:path.join(__dirname,'../server/server-entry.js')
    },
    output:{
        filename:'server-entry.js',//服务端没有缓冲的概念
        path:path.join(__dirname,'../dist'),
        publicPath:'/public/' ,//帮我们区分是静态资源还是一个路由
        libraryTarget:'commonjs2' //模块方案 UMD、AMD、CMD、commonjs
    },
    module:{
        rules:[
            {
                test:/.jsx$/, //正则匹配，以jsx结尾的文件
                loader:'babel-loader' //用babel-loader去进行编译，babel-loader是个插件，并不包含babel核心代码，要安装babel-core
            },
            {
                test:/.js$/, //正则匹配，以jsx结尾的文件
                loader:'babel-loader', //用babel-loader去进行编译，babel-loader是个插件，并不包含babel核心代码，要安装babel-core
                exclude:[ //不编译以下路径的文件
                    path.join(__dirname,'../node_modules')
                ]
            }
        ]
    },
    plugins:[
        // new HTMLPlugin(),不需要plugin
    ]
}
// 不用public 的静态资源的路径 'app.hash.js'
// 用了public 的静态资源的路径 '/public/app.hash.js'
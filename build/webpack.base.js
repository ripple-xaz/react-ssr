const path = require('path')

module.exports = {
  output:{
    path:path.join(__dirname,'../dist'),//  webpack处理后的结果路径
    publicPath:'/public/' ,// 帮我们区分是静态资源还是一个路由
  },
  module: {
    rules: [
      {
        enforce: 'pre', // 在执行代码编译之前，执行eslint-loader
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [//  不eslint 以下路径
          path.join(__dirname, '../node_modules')
        ],
        resolve: {
            extensions: ['.js', '.jsx'],
        }
      },
      {
        test: /.jsx$/, // 正则匹配，以jsx结尾的文件
        loader: 'babel-loader',// 用babel-loader去进行编译，babel-loader是个插件，并不包含babel核心代码，要安装babel-core
        resolve: {
            extensions: ['.js', '.jsx'],
        },
      },
      {
        test: /.js$/, //  正则匹配，以jsx结尾的文件
        loader: 'babel-loader', // 用babel-loader去进行编译，babel-loader是个插件，并不包含babel核心代码，要安装babel-core
        exclude: [ // 不babel以下路径的文件
          path.join(__dirname, '../node_modules')
        ],
        resolve: {
            extensions: ['.js', '.jsx'],
        },
      }
    ]
  }
}

const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs') //  从内存上读写文件
const proxy = require('http-proxy-middleware')
const bootstrapper = require('react-async-bootstrapper')
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const reactDomServer = require('react-dom/server')
const serverConfig = require('../../build/webpack.config.server')
const Helmet = require('react-helmet').default;

// 获取从字符串中获取模块
const NativeModule = require('module')
const vm = require('vm')
const getModuleFromString = (bundle,filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports,m.exports,require,m)
  return m
}

//  由于在开发环境，webpack处理后文件不会写在硬盘里面，没有办法去读取文件，用http请求的方式，在客户端webpack-dev-server打包出来的站点下面
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
    .then(res => {
      resolve(res.data)
    })
    .catch(err => {
      console.error('get template error', err)
    })
  })
}

//将store中的数据转换成 { appState: { count: 1, name: 'Jokoy' } }
const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result,storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  },{})
}

const Module = module.constructor
const mfs = new MemoryFs() // 实例化memory-fs模块
serverConfig.mode = 'development'

const serverCompiler = webpack(serverConfig) // 生成编译器
serverCompiler.outputFileSystem = mfs // 以前用fs读写文件，现在用mfs读写文件，从内存中读写文件会比硬盘快很多

let serverBundle, createStoreMap

//  编译的所有文件是否有变化，如果有变化，会重新去编译
serverCompiler.watch({
  ignored: /node_modules/
}, (err, stats) => {
  if (err) throw err
  //  打印错误和警告信息
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(1, err))
  stats.warnings.forEach(warn => console.warn(2, warn))

  const bundlePath = path.join( //  将webpack output中的内容生成字符串，返回到浏览器
    serverConfig.output.path,//
    serverConfig.output.filename
  )

  const bundle = mfs.readFileSync(bundlePath, 'utf8') //  读的内容是string内容

  //  为了使用 reactDomServer.renderToString 方法，必须将webpack生成的内容封装成module
  // const m = new Module()
  // m._compile(bundle, 'app.js') //  生成新的模块,并制定文件名去定义

  const m = getModuleFromString(bundle,'app.js')
  serverBundle = m.exports.default
  createStoreMap = m.exports.createStoreMap

  console.log('webpack:-------------compile over-------------')
})

module.exports = function (app) {
  //  将静态资源定向到webpack-dev-server里面
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function (req, res, next) {

    if(!serverBundle){
      return
    }

    getTemplate().then(template => {
      // router上下文，再经过reactDomServer.renderToString后会变成
      // { action: 'REPLACE',location: {pathname: '/list',search: '',hash: '',state: undefined},url: '/list'}
      const routerContex = {}
      const stores = createStoreMap()
      const app = serverBundle(stores,routerContex,req.url)

      // 服务端渲染用到一些异步的数据，拿到一些数据去渲染内容，比如在topiclist拿到一些内容比如appState中的msg，并改变它，改变的过程是异步的
      bootstrapper(app)
      .then(() => {
        const helmet = Helmet.rewind()
        const content = reactDomServer.renderToString(app)
        const state = getStoreState(stores)

        // 对于有redirect属性的路由，先重定向后返回给客户端
        if(routerContex.url){
          res.status(302).setHeader('Location',routerContex.url)
          res.end() //结束本次请求
          return
        }

        //用ejs 将 APPString 和 initialstate 替换
        const html = ejs.render(template,{
          appString: content,
          initialState: serialize(state), //state为 [object object] 序列化state
          meta: helmet.meta.toString(),
          title: helmet.title.toString(),
          style: helmet.style.toString(),
          link: helmet.link.toString(),
        })

        res.send(html)

        // res.send(template.replace('<!-- app -->', content))
      })
      .catch(err => console.log('Eek, error!', err))
    })
  })

}

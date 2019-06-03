const bootstrapper = require('react-async-bootstrapper')
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const reactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default;

// 将store中的数据转换成 { appState: { count: 1, name: 'Jokoy' } }
const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result,storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  },{})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap
    const creactApp = bundle.default

    // router上下文，再经过 reactDomServer.renderToString 后会变成
    // { action: 'REPLACE',location: { pathname: '/list', search: '', hash: '', state: undefined }, url: '/list'}
    const routerContex = {}
    const stores = createStoreMap()

    const app = creactApp(stores,routerContex,req.url)

    // 服务端渲染用到一些异步的数据，拿到一些数据去渲染内容，比如在topiclist拿到一些内容比如appState中的msg，并改变它，改变的过程是异步的
    bootstrapper(app)
    .then(() => {
      const helmet = Helmet.rewind()
      const content = reactDomServer.renderToString(app)
      const state = getStoreState(stores)

      // 对于有redirect属性的路由，先重定向后返回给客户端
      if(routerContex.url){
        res.status(302).setHeader('Location',routerContex.url)
        res.end() // 结束本次请求
        return
      }

      // 用ejs 将 APPString 和 initialstate 替换
      const html = ejs.render(template,{
        appString: content,
        initialState: serialize(state), // state为 [object object] 序列化state
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
      })

      res.send(html)
      resolve()
      // res.send(template.replace('<!-- app -->', content))
    }).catch(reject)
  })
}

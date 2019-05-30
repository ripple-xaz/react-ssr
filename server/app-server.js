import App from '../client/views/App'
import React from 'react'
import { Provider,useStaticRendering } from 'mobx-react'
import { StaticRouter } from 'react-router-dom'

import { createStoreMap } from '../client/store/store';

useStaticRendering(true) // 使用静态渲染，让mobx在服务端渲染的时候不会重复的数据变换

// App
export default (stores,routerContext,url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
)

// store
export { createStoreMap }

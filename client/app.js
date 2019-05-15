import React from 'react' 
//有react-dom 也有 react-native
//react-dom 是 react 专门为web端开发的渲染工具。我们可以在客户端使用react-dom的render方法渲染组件，而在服务端，react-dom/server提供我们将react组件渲染成HTML的方法
import ReactDOM from 'react-dom' 
import App from './App.jsx'

//react推荐有默认的节点去挂载App
//jsx代码最终会调用React.createElement 函数，所以用到jsx代码的地方都要引用 React
//服务端没有document这个对象的

ReactDOM.render(<App />,document.getElementById('root')) 

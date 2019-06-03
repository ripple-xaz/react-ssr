import React, { Component } from 'react'
import {
  Link,
} from 'react-router-dom'
import Routes from '../config/router'

export default class App extends Component {
  compoentDidMount() {
    // do
  }

  render() {
    // 路由和导航渲染的方式，return一个数组。
    return [
      <div key="banner">
        <Link to="/">首页/</Link>
        <Link to="/detail">详情页</Link>
      </div>,
      <Routes key="routes" />,
    ]
  }
}

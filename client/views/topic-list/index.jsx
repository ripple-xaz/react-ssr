import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet';
//  在组件或页面中使用mobx-react
import {
  observer,
  inject,
} from 'mobx-react';
import AppState from '../../store/app-state';

//  装饰器
@inject('appState') @observer
class TopicList extends Component {
  constructor() {
    super()
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {
    // do
  }

  bootstrap() {
    const { appState } = this.props
    return new Promise((resolve) => {
      setTimeout(() => {
        appState.add()
        resolve(true)
      })
    })
  }

  changeName(event) {
    const { appState } = this.props
    // appState.name = event.target.value
    // 建议用action的方式去改变
    appState.changeName(event.target.value)
  }

  render() {
    const { appState } = this.props
    return (
      <div>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <input type="text" onChange={this.changeName} />
        <span>{appState.msg}</span>
      </div>
    )
  }
}

//  对props进行验证（类型等）
TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}

export default TopicList

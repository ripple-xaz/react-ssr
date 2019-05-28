import React, { Component } from 'react'
import axios from 'axios';

/* eslint-disable */
export default class apiTest extends Component {
  componentDidMount() {
    this.getTopics = this.getTopics.bind(this)
    this.login = this.login.bind(this)
    this.markAll = this.markAll.bind(this)
  }

  getTopics() {
    axios.get('/api/topics')
    .then(resp => {
      console.log(resp)
    })
  }

  login() {
    axios.post('/api/user/login',{
      accessToken: 'e5b96ffa-f525-41a1-843f-f1a9b5a3b3ce'
    })
    .then(resp => {
      console.log(resp)
    })
  }

  markAll() {
    axios.post('/api/message/mark_all?needAccessToken=true')
    .then(resp => {
      console.log(resp)
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopics} >getTopics</button>
        <button onClick={this.login} >login</button>
        <button onClick={this.markAll} >markAll</button>
      </div>
    )
  }
}
/* eslint-enable */

import {
  observable,
  computed,
  autorun,
  action,
} from 'mobx'

export class AppState {
  @observable count = 0

  @observable name = 'Jokcy'

  //  用appState.msg的方法就可以获取到return的值
  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }

  // 定义一个action来改变observable
  @action add() {
    this.count += 1
  }

  // 通过改变name来改变
  @action changeName(name) {
    this.name = name
  }
}

const appState = new AppState()

// 监听state的变化，如果有，执行回调
autorun(() => {
  // dosomething
})

setInterval(() => {
  appState.add()
}, 1000);

export default appState

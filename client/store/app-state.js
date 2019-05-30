import {
  observable,
  computed,
  action,
} from 'mobx'

export default class AppState {
  constructor({ count, name } = { count: 0, name: 'Jokoy' }) {
    this.count = count
    this.name = name
  }

  @observable count

  @observable name

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

  //  将store中的数据转换成 { appState: { count: 1, name: 'Jokoy' } }
  toJson() {
    return {
      count: this.count,
      name: this.name,
    }
  }
}

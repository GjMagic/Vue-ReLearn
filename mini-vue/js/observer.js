class Observer {
  constructor (data) {
    this.walk(data)
  }

  walk (data) {
    // 1、判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 2、遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive (obj, key, val) {
    let _that = this
    // 负责收集依赖，并发送通知
    let dep = new Dep()
    // 3、如果val是对象，把val内部的属性转换成响应式数据
    this.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newValue) {
        if (newValue === val) {
          return
        }

        val = newValue
        // 4、如果修改后的data属性仍是对象，把它内部的属性转换成响应式数据
        _that.walk(newValue)
        // 发送通知
        dep.notify()
      }
    })
  }
}
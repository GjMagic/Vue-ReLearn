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
    // 3、如果val是对象，把val内部的属性转换成响应式数据
    this.walk(val)
    let _that = this
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
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
      }
    })
  }
}
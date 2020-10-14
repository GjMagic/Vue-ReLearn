class Compiler {
  constructor (vm) {
    this.vm = vm
    this.el = vm.$el
    this.compile(this.el)
  }

  // 编译模板，处理文本节点和元素节点
  compile (el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        // 处理文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      }

      // 判断node节点是否有子节点，如果有，则递归compile方法
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译元素节点，处理指令
  compileElement (node) {
    Array.from(node.attributes).forEach(attr => {
      // 判断是否是指令
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // v-text => text  ||  v-model => model
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, attrName, key)
      }
    })
  }

  update (node, attrName, key) {
    let updateFn = this[`${attrName}Updater`]
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }

  textUpdater (node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, (newValue) => {
      node.textContent = newValue
    })
  }

  modelUpdater (node, value, key) {
    node.value = value
    new Watcher(this.vm, key, (newValue) => {
      node.value = newValue
    })

    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  // 编译文本节点，处理差值表达式
  compileText (node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建watcher对象，当数据改变更新视图
      new Watcher(this.vm, key, (newValue) => {
        node.textContent = newValue
      })
    }
  }

  // 判断元素属性是否是指令
  isDirective (attrname) {
    return attrname.startsWith('v-')
  }

  // 判断节点是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3
  }

  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1
  }
}
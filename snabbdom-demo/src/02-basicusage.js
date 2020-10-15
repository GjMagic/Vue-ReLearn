// 2、div中放置子元素 h1、p
import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

let patch = init([])

let vnode = h('div#container', [
  h('h1', 'Hello Snabbdom'),
  h('p', '这是一个p标签')
])

let app = document.querySelector('#app')

let oldVnode = patch(app, vnode)

setTimeout(() => {
  vnode = h('div#container', [
    h('h1', 'Hello H1'),
    h('p', 'Hello P')
  ])

  patch(oldVnode, vnode)

  // 清空页面元素
  // patch(oldVnode, null) // 错误
  patch(oldVnode, h('!')) // 添加注释节点来清空页面元素
}, 2000);
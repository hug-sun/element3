# (wip) element for vue3

1. 修改 build/bin/buld-entry.js 的 72 行。
2. 组件加上白名单，比如加一个 'input'，执行 `npm run dev`。
3. 访问文档(也可访问 http://localhost:8086/#/ )，在对应的组件页面调试报错即可，完成的记得标记。
4. 提交代码前请先拉取代码，commit 时信息格式为 key: content，如 `refactor: refactor alert`，注意表达简洁易懂。

## Install

```js
npm install element3 -S

```

## Quick Start

```js
import 'element3/lib/theme-chalk/index.css'
import { createApp } from 'vue'
import Element3 from 'element3'
import App from './App.vue'

const app = createApp(App)
app.use(Element3)
app.mount('#app')

// or
import {
  ElButton
  // ...
} from 'element3'

Vue.use(ElButton)
```

> 注意暂时不要在生产坏境使用

## export components

目前已经导出可以使用的组件列表

- ElButton
- ElSwitch
- ElProgress
- ElLink
- ElIcon
- ElBreadcrumb
- ElBreadcrumbItem
- ElContainer

## Join Discussion Group

Scan the QR code using [Dingtalk App](https://www.dingtalk.com/) to join in discussion group :

<img alt="Join Discusion Group" src="https://pic4.zhimg.com/80/v2-73947edcba4cbfe52cd779a3b1b974b5_1440w.png" width="300">

## Contribution

[See Contributing Guide.](https://juejin.im/post/6864462363039531022)

<p align="center">
  <img src="https://gitee.com/pandafe/element3/raw/master/element_logo.svg">
</p>

<p align="center">
  <a href="https://travis-ci.org/ElemeFE/element">
    <img src="https://travis-ci.org/ElemeFE/element.svg?branch=master">
  </a>
  <a href="https://coveralls.io/github/ElemeFE/element?branch=master">
    <img src="https://coveralls.io/repos/github/ElemeFE/element/badge.svg?branch=master">
  </a>
  <a href="https://cdnjs.com/libraries/element-ui">
    <img src="https://img.shields.io/cdnjs/v/element-ui.svg">
  </a>
  <a href="https://www.npmjs.org/package/element-ui">
    <img src="https://img.shields.io/npm/v/element-ui.svg">
  </a>
  <a href="https://npmcharts.com/compare/element-ui?minimal=true">
    <img src="http://img.shields.io/npm/dm/element-ui.svg">
  </a>
  <br>
  <a href="http://img.badgesize.io/https://unpkg.com/element-ui/lib/index.js?compression=gzip&label=gzip%20size:%20JS">
    <img src="http://img.badgesize.io/https://unpkg.com/element-ui/lib/index.js?compression=gzip&label=gzip%20size:%20JS">
  </a>
  <a href="http://img.badgesize.io/https://unpkg.com/element-ui/lib/theme-chalk/index.css?compression=gzip&label=gzip%20size:%20CSS">
    <img src="http://img.badgesize.io/https://unpkg.com/element-ui/lib/theme-chalk/index.css?compression=gzip&label=gzip%20size:%20CSS">
  </a>
  <a href="#backers">
    <img src="https://opencollective.com/element/backers/badge.svg">
  </a>
  <a href="#sponsors">
    <img src="https://opencollective.com/element/sponsors/badge.svg">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

<p align="center">
  <b>Special thanks to the generous sponsorship by:</b>
</p>
<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="https://tipe.io/?ref=element" target="_blank">
          <img width="150px" src="https://user-images.githubusercontent.com/1016365/34124854-48fafa06-e3e9-11e7-8c04-251055feebee.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://www.duohui.cn/?utm_source=element&utm_medium=web&utm_campaign=element-index" target="_blank">
          <img width="150px" src="https://user-images.githubusercontent.com/10095631/35603534-bb24470c-0678-11e8-8bcc-17ceaef8cbef.png">
        </a>
      </td>
      <td align="center" valign="middle">
        <a href="https://bitsrc.io/" target="_blank">
          <img width="150px" src="https://user-images.githubusercontent.com/10095631/41342907-e44e7196-6f2f-11e8-92f2-47702dc8f059.png">
        </a>
      </td>
    </tr>
  </tbody>
</table>

> A Vue.js 3.0 UI Toolkit for Web.（WIP）

## Links

- Homepage and documentation
  - [International users](http://element.eleme.io/#/en-US)
  - [Chinese users](http://element-cn.eleme.io/#/zh-CN)
  - [Spanish users](http://element.eleme.io/#/es)
  - [French users](http://element.eleme.io/#/fr-FR)
- [awesome-element](https://github.com/ElementUI/awesome-element)
- [FAQ](./FAQ.md)
- [Customize theme](http://element.eleme.io/#/en-US/component/custom-theme)
- [Preview and generate theme online](https://elementui.github.io/theme-chalk-preview)
- [Element for React](https://github.com/elemefe/element-react)
- [Element for Angular](https://github.com/ElemeFE/element-angular)
- [Atom helper](https://github.com/ElemeFE/element-helper)
- [Visual Studio Code helper](https://github.com/ElemeFE/vscode-element-helper)
- Starter kit
  - [element-starter](https://github.com/ElementUI/element-starter)
  - [element-in-laravel-starter](https://github.com/ElementUI/element-in-laravel-starter)
- [Design resources](https://github.com/ElementUI/Resources)
- Gitter
  - [International users](https://gitter.im/element-en/Lobby)
  - [Chinese users](https://gitter.im/ElemeFE/element)

## Install

```shell
npm install element-ui -S
```

## Quick Start

```javascript
import Vue from 'vue'
import Element from 'element-ui'

Vue.use(Element)

// or
import {
  Select,
  Button
  // ...
} from 'element-ui'

Vue.component(Select.name, Select)
Vue.component(Button.name, Button)
```

For more information, please refer to [Quick Start](http://element.eleme.io/#/en-US/component/quickstart) in our documentation.



## LICENSE

[MIT](LICENSE)

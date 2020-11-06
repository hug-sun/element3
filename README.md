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
  <a href="">
    <img src="https://img.shields.io/cdnjs/v/element-ui.svg">
  </a>
  <a href="https://www.npmjs.com/package/element3">
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

## Introduction

A Vue.js 3.0 UI Toolkit for Web.

## Install

```shell
npm install element3 -S
```

## Quick Start

```js
import { createApp } from 'vue'
import App from './App.vue'
// import style
import "element3/lib/theme-chalk/index.css";
import Element3 from 'element3'

// global import
createApp(App)
  .use(Element3)
  .mount("#app")

// or according to the need to import
import {
  ElLink,
  ElButton
  // ...
} from 'element3'


createApp(App)
  .use(ElLink)
  .use(ElButton)
```

## Documentation

TODO

## Questions

TODO

## Issues

Please make sure to read the [Issue Reporting Checklist](TODO) before opening an issue. Issues not conforming to the guidelines may be closed immediately.

## Changelog

Detailed changes for each release are documented in the [CHANGELOG](https://github.com/kkbjs/element3/blob/master/CHANGELOG.md).

## Contribution

Please make sure to read the [Contributing Guide](https://juejin.im/post/6864462363039531022) before making a pull request. If you have a Element3-related project/component/tool, add it with a pull request to [this curated list](TODO)!

Thank you to all the people who already contributed to Element3!

## Join Discussion Group

Scan the QR code using [Dingtalk App](https://www.dingtalk.com/) to join in discussion group :

<img alt="Join Discusion Group" src="https://pic2.zhimg.com/50/v2-1442930ab968582ef6b959902ff71712_r.jpg" width="300">

## License

[MIT](http://opensource.org/licenses/MIT)

## 影响力

[![Stargazers over time](https://starchart.cc/kkbjs/element3.svg)](https://starchart.cc/kkbjs/element3)

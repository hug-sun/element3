<template>
  <el-button :plain="true" @click="open">打开消息提示</el-button>
  <el-button :plain="true" @click="open">打开消息提示</el-button>
  <el-button :plain="true" @click="openVn">VNode</el-button>
</template>

<script>
import { h } from 'vue'
import { Message } from 'element3'

export default {
  setup() {
    function open() {
      // message('这是一条消息提示')
      Message({
        duration: 2000,
        closeOnClickModal: true,
        message: 'verticalOffset'
      })
    }

    function openVn() {
      Message({
        message: h('p', null, [
          h('span', null, '内容可以是 '),
          h('i', { style: 'color: teal' }, 'VNode')
        ])
      })
    }

    return {
      open,
      openVn
    }
  }
}
</script>

<template>
  <div
    class="el-upload-dragger"
    :class="{
      'is-dragover': dragover
    }"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <slot></slot>
  </div>
</template>
<script>
import { ref, inject } from 'vue'
export default {
  name: 'ElUploadDrag',
  props: {
    disabled: Boolean
  },
  setup(props, ctx) {
    const dragover = ref(false)
    const uploader = inject('uploader')
    const onDragover = () => {
      if (!props.disabled) {
        dragover.value = true
      }
    }
    const onDrop = (e) => {
      if (props.disabled || !uploader) return
      const accept = uploader.accept
      dragover.value = false
      if (!accept) {
        ctx.emit('file', e.dataTransfer.files)
        return
      }
      ctx.emit(
        'file',
        [].slice.call(e.dataTransfer.files).filter((file) => {
          const { type, name } = file
          const extension =
            name.indexOf('.') > -1 ? `.${name.split('.').pop()}` : ''
          const baseType = type.replace(/\/.*$/, '')
          return accept
            .split(',')
            .map((type) => type.trim())
            .filter((type) => type)
            .some((acceptedType) => {
              if (/\..+$/.test(acceptedType)) {
                return extension === acceptedType
              }
              if (/\/\*$/.test(acceptedType)) {
                return baseType === acceptedType.replace(/\/\*$/, '')
              }
              // eslint-disable-next-line no-useless-escape
              if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
                return type === acceptedType
              }
              return false
            })
        })
      )
    }
    return {
      dragover,
      onDragover,
      onDrop
    }
  }
}
</script>

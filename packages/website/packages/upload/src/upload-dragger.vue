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
import { inject, toRefs, ref } from 'vue'
export default {
  name: 'ElUploadDrag',
  props: {
    disabled: Boolean
  },
  emits: ['file'],
  inject: ['uploader'],
  setup(props, { emit }) {
    const uploader = inject('uploader', {})
    const { disabled } = toRefs(props)
    const dragover = ref(false)

    const onDragover = () => {
      if (!disabled.value) {
        dragover.value = true
      }
    }

    const onDrop = (e) => {
      if (disabled.value || !uploader) return
      const accept = uploader.accept
      dragover.value = false
      if (!accept) {
        emit('file', e.dataTransfer.files)
        return
      }
      emit(
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
      onDragover,
      onDrop,
      dragover
    }
  }
}
</script>

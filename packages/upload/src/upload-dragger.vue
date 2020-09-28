<template>
  <div
    :class="{
      'el-upload-dragger': true,
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
import { defineComponent, ref, inject } from 'vue'

export default defineComponent({
  name: 'ElUploadDrag',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['file'],
  setup(props, { emit }) {
    const uploader = inject('uploader', {})
    const dragover = ref(false)

    const onDrop = (e) => {
      if (props.disabled || !uploader) return
      const accept = uploader.accept
      dragover.value = false
      if (!accept) {
        emit('file', e.dataTransfer.files)
        return
      }
      emit(
        'file',
        Array.from(e.dataTransfer.files).filter((file) => {
          const { type, name } = file
          const extension =
            name.indexOf('.') > -1 ? `.${name.split('.').pop()}` : ''
          const baseType = type.replace(/\/.*$/, '')
          return accept
            .split(',')
            .map((type) => type.trim())
            .filter((type) => type)
            .some((acceptedType) => {
              if (acceptedType.startsWith('.')) {
                return extension === acceptedType
              }
              if (/\/\*$/.test(acceptedType)) {
                return baseType === acceptedType.replace(/\/\*$/, '')
              }
              // if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
              if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
                return type === acceptedType
              }
              return false
            })
        })
      )
    }

    const onDragover = () => {
      if (!props.disabled) dragover.value = true
    }

    return {
      dragover,
      onDrop,
      onDragover
    }
  }
})
</script>

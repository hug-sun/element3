<script>
import {
  computed,
  defineComponent,
  h,
  getCurrentInstance,
  inject,
  ref,
  provide,
  onBeforeUnmount
} from 'vue'

import ajax from './ajax'
import UploadList from './upload-list.vue'
import Upload from './upload.vue'
import usePatch from './usePatch.js'

function noop() {}

export default defineComponent({
  name: 'ElUpload',
  components: {
    Upload,
    UploadList
  },
  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    },
    multiple: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'file'
    },
    drag: {
      type: Boolean,
      default: false
    },
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'select'
    },
    beforeUpload: Function,
    beforeRemove: Function,
    onRemove: {
      type: Function,
      default: noop
    },
    onChange: {
      type: Function,
      default: noop
    },
    onPreview: {
      type: Function
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    fileList: {
      type: Array,
      default: () => []
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'text'
    },
    httpRequest: {
      type: Function,
      default: ajax
    },
    disabled: Boolean,
    limit: {
      type: Number,
      default: null
    },
    onExceed: {
      type: Function,
      default: noop
    }
  },
  setup(props) {
    const elForm = inject('elForm', {})
    const uploadDisabled = computed(() => {
      return props.disabled || elForm.disabled
    })

    const {
      clearFiles,
      handleError,
      handleProgress,
      handleStart,
      handleSuccess,
      handleRemove,
      submit,
      uploadRef,
      uploadFiles
    } = usePatch(props)

    provide('uploader', getCurrentInstance())

    onBeforeUnmount(() => {
      uploadFiles.value.forEach((file) => {
        if (file.url && file.url.indexOf('blob:') === 0) {
          URL.revokeObjectURL(file.url)
        }
      })
    })

    return {
      dragOver: ref(false),
      draging: ref(false),
      handleError,
      handleProgress,
      handleRemove,
      handleStart,
      handleSuccess,
      uploadDisabled,
      uploadFiles,
      uploadRef,
      submit,
      clearFiles
    }
  },
  render() {
    let uploadList
    if (this.showFileList) {
      uploadList = h(
        UploadList,
        {
          disabled: this.uploadDisabled,
          listType: this.listType,
          files: this.uploadFiles,
          onRemove: this.handleRemove,
          handlePreview: this.onPreview
        },
        {
          file: (props) => {
            if (this.$slots.file) {
              return this.$slots.file({
                file: props.file
              })
            }
            return null
          }
        }
      )
    } else {
      uploadList = null
    }

    const uploadData = {
      type: this.type,
      drag: this.drag,
      action: this.action,
      multiple: this.multiple,
      'before-upload': this.beforeUpload,
      'with-credentials': this.withCredentials,
      headers: this.headers,
      name: this.name,
      data: this.data,
      accept: this.accept,
      fileList: this.uploadFiles,
      autoUpload: this.autoUpload,
      listType: this.listType,
      disabled: this.uploadDisabled,
      limit: this.limit,
      'on-exceed': this.onExceed,
      'on-start': this.handleStart,
      'on-progress': this.handleProgress,
      'on-success': this.handleSuccess,
      'on-error': this.handleError,
      'on-preview': this.onPreview,
      'on-remove': this.handleRemove,
      'http-request': this.httpRequest,
      ref: 'uploadRef'
    }
    const trigger = this.$slots.trigger || this.$slots.default
    const uploadComponent = h(Upload, uploadData, {
      default: () => trigger?.()
    })
    return h('div', [
      this.listType === 'picture-card' ? uploadList : null,
      this.$slots.trigger
        ? [uploadComponent, this.$slots.default()]
        : uploadComponent,
      this.$slots.tip?.(),
      this.listType !== 'picture-card' ? uploadList : null
    ])
  }
})
</script>

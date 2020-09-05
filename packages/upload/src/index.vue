<script>
import {
  computed,
  inject,
  watch,
  reactive,
  toRefs,
  onBeforeUnmount,
  ref
} from 'vue'
import UploadList from './upload-list'
import Upload from './upload'
import ElProgress from 'element-ui/packages/progress'
import Migrating from 'element-ui/src/mixins/migrating'

function noop() {}

export default {
  name: 'ElUpload',

  mixins: [Migrating],

  components: {
    ElProgress,
    UploadList,
    Upload
  },

  props: {
    action: {
      type: String,
      required: true
    },
    headers: {
      type: Object,
      default() {
        return {}
      }
    },
    data: Object,
    multiple: Boolean,
    name: {
      type: String,
      default: 'file'
    },
    drag: Boolean,
    dragger: Boolean,
    withCredentials: Boolean,
    showFileList: {
      type: Boolean,
      default: true
    },
    accept: String,
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
      default() {
        return []
      }
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    listType: {
      type: String,
      default: 'text' // text,picture,picture-card
    },
    httpRequest: Function,
    disabled: Boolean,
    limit: Number,
    onExceed: {
      type: Function,
      default: noop
    }
  },

  provide() {
    return {
      uploader: this
    }
  },

  inject: {
    elForm: {
      default: ''
    }
  },

  setup(props, ctx) {
    // props
    const { listType, disabled, fileList } = toRefs(props)

    // computed
    const uploadDisabled = userUploadDisabled(disabled)

    // data (also can be called 'state')
    const state = reactive({
      uploadFiles: [],
      dragOver: false,
      draging: false,
      tempIndex: 1
    })

    // sub Component reference
    const uploadInner = ref(null) // ref --> Upload

    // lifecycle --> beforeDestory
    onBeforeUnmount(() => {
      state.uploadFiles.forEach((file) => {
        if (file.url && file.url.indexOf('blob:') === 0) {
          URL.revokeObjectURL(file.url)
        }
      })
    })

    // "listType watch handler
    const handleListTypeChange = (type) => {
      if (type === 'picture-card' || type === 'picture') {
        state.uploadFiles = state.uploadFiles.map((file) => {
          if (!file.url && file.raw) {
            try {
              file.url = URL.createObjectURL(file.raw)
            } catch (err) {
              console.error('[Element Error][Upload]', err)
            }
          }
          return file
        })
      }
    }

    // "fileList" watch handler
    const handleFileListChange = () => {
      state.uploadFiles = fileList.value.map((item) => {
        item.uid = item.uid || Date.now() + state.tempIndex++
        item.status = item.status || 'success'
        return item
      })
    }

    // watch
    watch(listType, handleListTypeChange)
    watch(fileList, handleFileListChange, { immediate: true })

    // 上传之前的钩子
    const handleStart = (rawFile) => {
      rawFile.uid = Date.now() + state.tempIndex++
      const file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      }
      if (props.listType === 'picture-card' || props.listType === 'picture') {
        try {
          file.url = URL.createObjectURL(rawFile)
        } catch (err) {
          console.error('[Element Error][Upload]', err)
          return
        }
      }
      state.uploadFiles.push(file)
      props.onChange(file, state.uploadFiles)
    }
    // 上传中的钩子
    const handleProgress = (ev, rawFile) => {
      const file = getFile(rawFile)
      props.onProgress(ev, file, state.uploadFiles)
      file.status = 'uploading'
      file.percentage = ev.percent || 0
    }
    // 处理操作成功的钩子函数
    const handleSuccess = (res, rawFile) => {
      const file = getFile(rawFile)
      if (file) {
        file.status = 'success'
        file.response = res
        props.onSuccess(res, file, state.uploadFiles)
        props.onChange(file, state.uploadFiles)
      }
    }
    // 处理异常错误的钩子函数
    const handleError = (err, rawFile) => {
      const file = getFile(rawFile)
      const fileList = state.uploadFiles
      file.status = 'fail'
      fileList.splice(fileList.indexOf(file), 1)
      props.onError(err, file, state.uploadFiles)
      props.onChange(file, state.uploadFiles)
    }
    // 处理移除文件的钩子函数
    const handleRemove = (file, raw) => {
      if (raw) {
        file = getFile(raw)
      }
      const doRemove = () => {
        abort(file)
        const fileList = state.uploadFiles
        fileList.splice(fileList.indexOf(file), 1)
        props.onRemove(file, fileList)
      }
      if (!props.beforeRemove) {
        doRemove()
      } else if (typeof props.beforeRemove === 'function') {
        const before = props.beforeRemove(file, state.uploadFiles)
        if (before && before.then) {
          before.then(() => {
            doRemove()
          }, noop)
        } else if (before !== false) {
          doRemove()
        }
      }
    }
    // 清空上传文件
    const clearFiles = () => {
      state.uploadFiles = []
    }
    // 提交
    const submit = function () {
      state.uploadFiles
        .filter((file) => file.status === 'ready')
        .forEach((file) => {
          uploadInner.value.upload(file.raw)
        })
    }
    // 文件格式化
    const getFile = function (rawFile) {
      const fileList = state.uploadFiles
      let target
      fileList.every((item) => {
        target = rawFile.uid === item.uid ? item : null
        return !target
      })
      return target
    }
    // 中断
    const abort = (file) => {
      uploadInner.value.abort(file)
    }

    return {
      // refs
      uploadInner,
      // data
      uploadFiles: state.uploadFiles,
      dragOver: state.dragOver,
      draging: state.draging,
      tempIndex: state.tempIndex,
      // computed
      uploadDisabled,
      // methods
      handleStart,
      handleProgress,
      handleSuccess,
      handleError,
      handleRemove,
      getFile,
      abort,
      submit,
      clearFiles,
      getMigratingConfig
    }
  },

  render() {
    let uploadList

    console.log('file slot', this.$slots.file)

    const slots = {
      file: this.$slots.file
    }

    // more detail please to see: https://github.com/vuejs/jsx-next
    if (this.showFileList) {
      uploadList = (
        <UploadList
          disabled={this.uploadDisabled}
          listType={this.listType}
          files={this.uploadFiles}
          onRemove={this.handleRemove}
          handlePreview={this.onPreview}
          v-slots={slots}
        ></UploadList>
      )
    }

    const uploadData = {
      props: {
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
        'http-request': this.httpRequest
      },
      ref: 'upload-inner'
    }

    // 发现{...uploadData} 只能浅解构
    const trigger = this.$slots.trigger || this.$slots.default
    const uploadComponent = (
      <Upload {...uploadData.props} ref="uploadInner">
        {trigger()}
      </Upload>
    )

    return (
      <div>
        {this.listType === 'picture-card' ? uploadList : ''}
        {this.$slots.trigger
          ? [uploadComponent, this.$slots.default()]
          : uploadComponent}
        {this.$slots.tip ? this.$slots.tip() : ''}
        {this.listType !== 'picture-card' ? uploadList : ''}
      </div>
    )
  }
}
// compute property uploadDisabled
const userUploadDisabled = (disabled) => {
  // inject
  const elForm = inject('elForm', { default: '' })
  const uploadDisabled = computed(() => {
    return disabled || (elForm || {}).disabled
  })
  return uploadDisabled.value
}
const getMigratingConfig = function () {
  return {
    props: {
      'default-file-list': 'default-file-list is renamed to file-list.',
      'show-upload-list': 'show-upload-list is renamed to show-file-list.',
      'thumbnail-mode':
        'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
    }
  }
}
</script>

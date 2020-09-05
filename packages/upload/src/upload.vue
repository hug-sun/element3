<script>
import ajax from './ajax'
import UploadDragger from './upload-dragger.vue'
import { ref, reactive } from 'vue'
export default {
  inject: ['uploader'],
  components: {
    UploadDragger
  },
  props: {
    type: String,
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    data: Object,
    headers: Object,
    withCredentials: Boolean,
    multiple: Boolean,
    accept: String,
    onStart: Function,
    onProgress: Function,
    onSuccess: Function,
    onError: Function,
    beforeUpload: Function,
    drag: Boolean,
    onPreview: {
      type: Function,
      default: function () {}
    },
    onRemove: {
      type: Function,
      default: function () {}
    },
    fileList: Array,
    autoUpload: Boolean,
    listType: String,
    httpRequest: {
      type: Function,
      default: ajax
    },
    disabled: Boolean,
    limit: Number,
    onExceed: Function
  },
  setup(props) {
    // data
    const state = reactive({
      mouseover: false,
      reqs: {}
    })

    // ref -- input type=file
    const input = ref(null)

    // methods
    // post上传文件
    const post = (rawFile) => {
      const { uid } = rawFile
      const options = {
        headers: props.headers,
        withCredentials: props.withCredentials,
        file: rawFile,
        data: props.data,
        filename: props.name,
        action: props.action,
        onProgress: (e) => {
          props.onProgress(e, rawFile)
        },
        onSuccess: (res) => {
          props.onSuccess(res, rawFile)
          delete state.reqs[uid]
        },
        onError: (err) => {
          props.onError(err, rawFile)
          delete state.reqs[uid]
        }
      }
      const req = props.httpRequest(options)
      state.reqs[uid] = req
      if (req && req.then) {
        req.then(options.onSuccess, options.onError)
      }
    }
    // 上传文件
    const upload = (rawFile) => {
      input.value.value = null
      if (!props.beforeUpload) {
        return post(rawFile)
      }
      const before = props.beforeUpload(rawFile)
      if (before && before.then) {
        before.then(
          (processedFile) => {
            const fileType = Object.prototype.toString.call(processedFile)
            if (fileType === '[object File]' || fileType === '[object Blob]') {
              if (fileType === '[object Blob]') {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type
                })
              }
              for (const p in rawFile) {
                if (Object.hasOwnProperty.call(rawFile, p)) {
                  processedFile[p] = rawFile[p]
                }
              }
              post(processedFile)
            } else {
              post(rawFile)
            }
          },
          () => {
            props.onRemove(null, rawFile)
          }
        )
      } else if (before !== false) {
        post(rawFile)
      } else {
        props.onRemove(null, rawFile)
      }
    }
    // 上传多个文件
    const uploadFiles = (files) => {
      if (props.limit && props.fileList.length + files.length > props.limit) {
        props.onExceed && props.onExceed(files, props.fileList)
        return
      }
      let postFiles = Array.prototype.slice.call(files)
      if (!props.multiple) {
        postFiles = postFiles.slice(0, 1)
      }
      if (postFiles.length === 0) {
        return
      }
      postFiles.forEach((rawFile) => {
        props.onStart(rawFile)
        if (props.autoUpload) upload(rawFile)
      })
    }
    // 监听input内容变化
    const handleChange = (ev) => {
      const files = ev.target.files
      if (!files) return
      uploadFiles(files)
    }
    // 点击上传文件响应事件
    const handleClick = () => {
      if (!props.disabled) {
        input.value.value = null
        input.value.click()
      }
    }
    // 键盘监听事件
    const handleKeydown = (e) => {
      if (e.target !== e.currentTarget) return
      if (e.keyCode === 13 || e.keyCode === 32) {
        handleClick()
      }
    }
    // 中断
    const abort = (file) => {
      const { reqs } = state
      if (file) {
        let uid = file
        if (file.uid) uid = file.uid
        if (reqs[uid]) {
          reqs[uid].abort()
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort()
          delete reqs[uid]
        })
      }
    }

    return {
      input,
      mouseover: state.mouseover,
      reqs: state.req,
      isImage,
      handleChange,
      uploadFiles,
      upload,
      abort,
      post,
      handleClick,
      handleKeydown
    }
  },
  render() {
    const {
      drag,
      name,
      multiple,
      accept,
      listType,
      uploadFiles,
      disabled
    } = this

    // const data = {
    //   class: {
    //     'el-upload': true
    //   },
    //   on: {
    //     click: this.handleClick,
    //     keydown: this.handleKeydown
    //   }
    // }

    // data.class[`el-upload--${listType}`] = true

    return (
      <div
        onClick={this.handleClick}
        keydown={this.handleKeydown}
        tabindex="0"
        class={'el-upload ' + `el-upload--${listType}`}
      >
        {drag ? (
          <upload-dragger disabled={disabled} onFile={uploadFiles}>
            {this.$slots.default()}
          </upload-dragger>
        ) : (
          this.$slots.default()
        )}
        <input
          class="el-upload__input"
          type="file"
          ref="input"
          name={name}
          onChange={this.handleChange}
          multiple={multiple}
          accept={accept}
        ></input>
      </div>
    )
  }
}

// 纯函数方法
const isImage = (str) => str.indexOf('image') !== -1
</script>

<template>
  <div
    :class="['el-upload', `el-upload--${listType}`]"
    tabindex="0"
    @click="handleClick"
    @keydown.self.enter.space="handleKeydown"
  >
    <template v-if="drag">
      <upload-dragger :disabled="disabled" @file="uploadFiles">
        <slot></slot>
      </upload-dragger>
    </template>
    <template v-else>
      <slot></slot>
    </template>
    <input
      ref="inputRef"
      class="el-upload__input"
      type="file"
      :name="name"
      :multiple="multiple"
      :accept="accept"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { noop } from 'lodash'
import { defineComponent, ref } from 'vue'
import ajax from './ajax'
import UploadDragger from './upload-dragger.vue'

export default defineComponent({
  components: {
    UploadDragger
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: 'file'
    },
    data: {
      type: Object,
      default: () => null
    },
    headers: {
      type: Object,
      default: () => null
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: null
    },
    accept: {
      type: String,
      default: ''
    },
    onStart: {
      type: Function,
      default: noop
    },
    onProgress: {
      type: Function,
      default: noop
    },
    onSuccess: {
      type: Function,
      default: noop
    },
    onError: {
      type: Function,
      default: noop
    },
    beforeUpload: {
      type: Function,
      default: noop
    },
    drag: {
      type: Boolean,
      default: false
    },
    onPreview: Function,
    onRemove: Function,
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
      default: () => ajax
    },
    disabled: Boolean,
    limit: {
      type: Number,
      default: null
    },
    onExceed: Function
  },
  setup(props) {
    const reqs = ref({})
    const mouseover = ref(false)
    const inputRef = ref(null)

    const uploadFiles = (files) => {
      if (props.limit && props.fileList.length + files.length > props.limit) {
        props.onExceed(files, props.fileList)
        return
      }
      let postFiles = Array.from(files)
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

    const upload = (rawFile) => {
      inputRef.value.value = null
      if (!props.beforeUpload) {
        return post(rawFile)
      }
      const before = props.beforeUpload(rawFile)
      if (before instanceof Promise) {
        before
          .then((processedFile) => {
            const fileType = Object.prototype.toString.call(processedFile)
            if (fileType === '[object File]' || fileType === '[object Blob]') {
              if (fileType === '[object Blob]') {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type
                })
              }
              for (const p in rawFile) {
                if (Object.prototype.hasOwnProperty.call(rawFile, p)) {
                  processedFile[p] = rawFile[p]
                }
              }
              post(processedFile)
            } else {
              post(rawFile)
            }
          })
          .catch(() => {
            props.onRemove(null, rawFile)
          })
      } else if (before !== false) {
        post(rawFile)
      } else {
        props.onRemove(null, rawFile)
      }
    }
    const abort = (file) => {
      const _reqs = reqs.value
      if (file) {
        let uid = file
        if (file.uid) uid = file.uid
        if (_reqs[uid]) {
          _reqs[uid].abort()
        }
      } else {
        Object.keys(_reqs).forEach((uid) => {
          if (_reqs[uid]) _reqs[uid].abort()
          delete _reqs[uid]
        })
      }
    }

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
          delete reqs.value[uid]
        },
        onError: (err) => {
          props.onError(err, rawFile)
          delete reqs.value[uid]
        }
      }
      const req = props.httpRequest(options)
      reqs.value[uid] = req
      if (req instanceof Promise) {
        req.then(options.onSuccess, options.onError)
      }
    }

    const handleChange = (e) => {
      const files = e.target.files
      if (!files) return
      uploadFiles(files)
    }

    const handleClick = () => {
      if (!props.disabled) {
        inputRef.value.value = null
        inputRef.value.click()
      }
    }

    const handleKeydown = () => {
      handleClick()
    }

    return {
      reqs,
      mouseover,
      inputRef,
      abort,
      post,
      handleChange,
      handleClick,
      handleKeydown,
      upload,
      uploadFiles
    }
  }
})
</script>

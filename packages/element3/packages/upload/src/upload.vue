<template>
  <div
    class="el-upload"
    :class="{ [`el-upload--${listType}`]: true }"
    @click="handleClick"
    @keydown="handleKeydown"
    tabindex="0"
  >
    <upload-dragger v-if="drag" :disabled="disabled" @file="uploadFiles">
      <slot></slot>
    </upload-dragger>
    <slot v-else></slot>
    <input
      class="el-upload__input"
      type="file"
      ref="input"
      :name="name"
      @change="handleChange"
      :multiple="multiple"
      :accept="accept"
    />
  </div>
</template>
<script>
import ajax from './ajax'
import UploadDragger from './upload-dragger.vue'
import { ref, reactive, toRefs, unref } from 'vue'

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
    const { limit, fileList, onExceed, multiple, autoUpload } = toRefs(props)
    // eslint-disable-next-line vue/no-setup-props-destructure
    const {
      onStart,
      beforeUpload,
      httpRequest,
      onProgress,
      onSuccess,
      onError,
      disabled,
      onRemove
    } = props
    const mouseover = ref(false)
    const reqs = reactive({})
    const input = ref(null)
    const isImage = (str) => {
      return str.indexOf('image') !== -1
    }
    const handleChange = (ev) => {
      const files = ev.target.files
      if (!files) return
      uploadFiles(files)
    }
    const uploadFiles = (files) => {
      if (limit.value && fileList.length + files.length > limit.value) {
        onExceed && onExceed(files, fileList)
        return
      }

      let postFiles = Array.prototype.slice.call(files)
      if (!multiple.value) {
        postFiles = postFiles.slice(0, 1)
      }

      if (postFiles.length === 0) {
        return
      }

      postFiles.forEach((rawFile) => {
        onStart(rawFile)
        if (autoUpload.value) upload(rawFile)
      })
    }
    const upload = (rawFile) => {
      input.value.value = null

      if (!beforeUpload) {
        return post(rawFile)
      }

      const before = beforeUpload(rawFile)
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
            onRemove(null, rawFile)
          }
        )
      } else if (before !== false) {
        post(rawFile)
      } else {
        onRemove(null, rawFile)
      }
    }
    const abort = (file) => {
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
          onProgress(e, rawFile)
        },
        onSuccess: (res) => {
          onSuccess(res, rawFile)
          delete reqs[uid]
        },
        onError: (err) => {
          onError(err, rawFile)
          delete reqs[uid]
        }
      }
      const req = httpRequest(options)
      reqs[uid] = req
      if (req && req.then) {
        req.then(options.onSuccess, options.onError)
      }
    }
    const handleClick = () => {
      if (!unref(disabled)) {
        input.value.value = null
        input.value.click()
      }
    }
    const handleKeydown = (e) => {
      if (e.target !== e.currentTarget) return
      if (e.keyCode === 13 || e.keyCode === 32) {
        handleClick()
      }
    }
    return {
      mouseover,
      isImage,
      handleChange,
      uploadFiles,
      handleClick,
      handleKeydown,
      post,
      upload,
      input,
      reqs,
      abort
    }
  }
}
</script>

<template>
  <div>
    <UploadList
      :disabled="uploadDisabled"
      :listType="listType"
      :files="uploadFiles"
      @remove="handleRemove"
      :handlePreview="onPreview"
      v-if="listType === 'picture-card' && showFileList"
    >
      <template v-if="$slots.file" #default="props">
        <slot name="file" :file="props.file"></slot>
      </template>
    </UploadList>

    <div v-if="$slots.trigger">
      <upload
        :type="type"
        :drag="drag"
        :action="action"
        :multiple="multiple"
        :before-upload="beforeUpload"
        :with-credentials="withCredentials"
        :headers="headers"
        :name="name"
        :data="data"
        :accept="accept"
        :fileList="uploadFiles"
        :autoUpload="autoUpload"
        :listType="listType"
        :disabled="uploadDisabled"
        :limit="limit"
        @exceed="onExceed"
        @start="handleStart"
        @progress="handleProgress"
        @success="handleSuccess"
        @error="handleError"
        @preview="onPreview"
        @remove="handleRemove"
        :http-request="httpRequest"
        ref="uploadInner"
      >
        <slot name="trigger"></slot>
      </upload>
      <slot></slot>
    </div>
    <upload
      :type="type"
      :drag="drag"
      :action="action"
      :multiple="multiple"
      :before-upload="beforeUpload"
      :with-credentials="withCredentials"
      :headers="headers"
      :name="name"
      :data="data"
      :accept="accept"
      :fileList="uploadFiles"
      :autoUpload="autoUpload"
      :listType="listType"
      :disabled="uploadDisabled"
      :limit="limit"
      @exceed="onExceed"
      @start="handleStart"
      @progress="handleProgress"
      @success="handleSuccess"
      @error="handleError"
      @preview="onPreview"
      @remove="handleRemove"
      :http-request="httpRequest"
      ref="uploadInner"
      v-else
    >
      <slot name="trigger"></slot>
      <slot></slot>
    </upload>

    <slot name="tip"></slot>

    <UploadList
      :disabled="uploadDisabled"
      :listType="listType"
      :files="uploadFiles"
      @remove="handleRemove"
      :handlePreview="onPreview"
      v-if="listType !== 'picture-card' && showFileList"
    >
      <template v-if="$slots.file" #default="props">
        <slot name="file" :file="props.file"></slot>
      </template>
    </UploadList>
  </div>
</template>

<script>
import UploadList from './upload-list'
import Upload from './upload'
import Migrating from '../../../src/mixins/migrating'
import {
  ref,
  unref,
  reactive,
  toRefs,
  inject,
  computed,
  watch,
  onUnmounted
} from 'vue'

function noop() {}

export default {
  name: 'ElUpload',

  mixins: [Migrating],

  components: {
    UploadList,
    Upload
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

  setup(props) {
    const { disabled, listType, fileList } = toRefs(props)
    // eslint-disable-next-line vue/no-setup-props-destructure
    const {
      onRemove,
      beforeRemove,
      onProgress,
      onSuccess,
      onError,
      onChange
    } = props
    let tempIndex = 1
    let uploadFiles = reactive(
      fileList.value.map((item) => {
        item.uid = item.uid || Date.now() + tempIndex++
        item.status = item.status || 'success'
        return item
      })
    )
    const dragOver = ref(false)
    const draging = ref(false)
    const uploadInner = ref(null)
    const uploadDisabled = computed(() => {
      const elForm = inject('elForm', {})
      return disabled.value || unref((elForm || {}).disabled)
    })

    watch(listType, (type) => {
      if (type === 'picture-card' || type === 'picture') {
        uploadFiles.forEach((file) => {
          if (!file.url && file.raw) {
            try {
              file.url = URL.createObjectURL(file.raw)
            } catch (err) {
              console.error('[Element Error][Upload]', err)
            }
          }
        })
      }
    })

    onUnmounted(() => {
      uploadFiles.forEach((file) => {
        if (file.url && file.url.indexOf('blob:') === 0) {
          URL.revokeObjectURL(file.url)
        }
      })
    })

    const abort = (file) => {
      uploadInner.value.abort(file)
    }

    const getFile = (rawFile) => {
      const fileList = uploadFiles
      let target
      fileList.every((item) => {
        target = rawFile.uid === item.uid ? item : null
        return !target
      })
      return target
    }

    const handleRemove = (file, raw) => {
      if (raw) {
        file = getFile(raw)
      }
      const doRemove = () => {
        abort(file)
        const fileList = uploadFiles
        fileList.splice(fileList.indexOf(file), 1)
        onRemove(file, fileList)
      }

      if (!beforeRemove) {
        doRemove()
      } else if (typeof beforeRemove === 'function') {
        const before = beforeRemove(file, uploadFiles)
        if (before && before.then) {
          before.then(() => {
            doRemove()
          }, noop)
        } else if (before !== false) {
          doRemove()
        }
      }
    }

    const handleProgress = (ev, rawFile) => {
      const file = getFile(rawFile)
      onProgress(ev, file, uploadFiles)
      file.status = 'uploading'
      file.percentage = ev.percent || 0
    }

    const handleSuccess = (res, rawFile) => {
      const file = getFile(rawFile)

      if (file) {
        file.status = 'success'
        file.response = res

        onSuccess(res, file, uploadFiles)
        onChange(file, uploadFiles)
      }
    }

    const handleError = (err, rawFile) => {
      const file = getFile(rawFile)
      const fileList = uploadFiles

      file.status = 'fail'

      fileList.splice(fileList.indexOf(file), 1)

      onError(err, file, uploadFiles)
      onChange(file, uploadFiles)
    }

    const handleStart = (rawFile) => {
      rawFile.uid = Date.now() + tempIndex++

      const file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      }

      if (unref(listType) === 'picture-card' || unref(listType) === 'picture') {
        try {
          file.url = URL.createObjectURL(rawFile)
        } catch (err) {
          console.error('[Element Error][Upload]', err)
          return
        }
      }

      uploadFiles.push(file)
      onChange(file, uploadFiles)
    }

    const clearFiles = () => {
      uploadFiles = []
    }

    const submit = () => {
      uploadFiles
        .filter((file) => file.status === 'ready')
        .forEach((file) => {
          uploadInner.value.upload(file.raw)
        })
    }

    const getMigratingConfig = () => {
      return {
        props: {
          'default-file-list': 'default-file-list is renamed to file-list.',
          'show-upload-list': 'show-upload-list is renamed to show-file-list.',
          'thumbnail-mode':
            'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
        }
      }
    }

    return {
      uploadFiles,
      uploadInner,
      dragOver,
      draging,
      uploadDisabled,
      handleRemove,
      abort,
      handleStart,
      handleProgress,
      handleSuccess,
      handleError,
      clearFiles,
      submit,
      getMigratingConfig
    }
  }
}
</script>

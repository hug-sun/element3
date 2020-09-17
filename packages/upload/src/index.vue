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
      <template v-slot:file="props">
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
        ref="upload-inner"
      >
        <slot name="trigger"></slot>
        <slot></slot>
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
      ref="upload-inner"
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
      <template v-slot:file="props">
        <slot name="file" :file="props.file"></slot>
      </template>
    </UploadList>
  </div>
</template>

<script>
import UploadList from './upload-list'
import Upload from './upload'
import Migrating from 'element-ui/src/mixins/migrating'

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

  data() {
    return {
      uploadFiles: [],
      dragOver: false,
      draging: false,
      tempIndex: 1
    }
  },

  computed: {
    uploadDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    }
  },

  watch: {
    listType(type) {
      if (type === 'picture-card' || type === 'picture') {
        this.uploadFiles = this.uploadFiles.map((file) => {
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
    },
    fileList: {
      immediate: true,
      handler(fileList) {
        this.uploadFiles = fileList.map((item) => {
          item.uid = item.uid || Date.now() + this.tempIndex++
          item.status = item.status || 'success'
          return item
        })
      }
    }
  },

  methods: {
    handleStart(rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++
      const file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      }

      if (this.listType === 'picture-card' || this.listType === 'picture') {
        try {
          file.url = URL.createObjectURL(rawFile)
        } catch (err) {
          console.error('[Element Error][Upload]', err)
          return
        }
      }

      this.uploadFiles.push(file)
      this.onChange(file, this.uploadFiles)
    },
    handleProgress(ev, rawFile) {
      const file = this.getFile(rawFile)
      this.onProgress(ev, file, this.uploadFiles)
      file.status = 'uploading'
      file.percentage = ev.percent || 0
    },
    handleSuccess(res, rawFile) {
      const file = this.getFile(rawFile)

      if (file) {
        file.status = 'success'
        file.response = res

        this.onSuccess(res, file, this.uploadFiles)
        this.onChange(file, this.uploadFiles)
      }
    },
    handleError(err, rawFile) {
      const file = this.getFile(rawFile)
      const fileList = this.uploadFiles

      file.status = 'fail'

      fileList.splice(fileList.indexOf(file), 1)

      this.onError(err, file, this.uploadFiles)
      this.onChange(file, this.uploadFiles)
    },
    handleRemove(file, raw) {
      if (raw) {
        file = this.getFile(raw)
      }
      const doRemove = () => {
        this.abort(file)
        const fileList = this.uploadFiles
        fileList.splice(fileList.indexOf(file), 1)
        this.onRemove(file, fileList)
      }

      if (!this.beforeRemove) {
        doRemove()
      } else if (typeof this.beforeRemove === 'function') {
        const before = this.beforeRemove(file, this.uploadFiles)
        if (before && before.then) {
          before.then(() => {
            doRemove()
          }, noop)
        } else if (before !== false) {
          doRemove()
        }
      }
    },
    getFile(rawFile) {
      const fileList = this.uploadFiles
      let target
      fileList.every((item) => {
        target = rawFile.uid === item.uid ? item : null
        return !target
      })
      return target
    },
    abort(file) {
      this.$refs['upload-inner'].abort(file)
    },
    clearFiles() {
      this.uploadFiles = []
    },
    submit() {
      this.uploadFiles
        .filter((file) => file.status === 'ready')
        .forEach((file) => {
          this.$refs['upload-inner'].upload(file.raw)
        })
    },
    getMigratingConfig() {
      return {
        props: {
          'default-file-list': 'default-file-list is renamed to file-list.',
          'show-upload-list': 'show-upload-list is renamed to show-file-list.',
          'thumbnail-mode':
            'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
        }
      }
    }
  },

  beforeDestroy() {
    this.uploadFiles.forEach((file) => {
      if (file.url && file.url.indexOf('blob:') === 0) {
        URL.revokeObjectURL(file.url)
      }
    })
  }
}
</script>

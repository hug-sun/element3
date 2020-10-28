import { ref, watch } from 'vue'

function getFile(rawFile, uploadFiles) {
  return uploadFiles.find((file) => file.uid === rawFile.uid)
}

function genUid(seed) {
  return Date.now() + seed
}

export default (props) => {
  const uploadFiles = ref([])
  const uploadRef = ref(null)

  let tempIndex = 1

  const abort = (file) => {
    uploadRef.value.abort(file)
  }

  const clearFiles = () => {
    uploadFiles.value = []
  }

  const handleError = (err, rawFile) => {
    const file = getFile(rawFile, uploadFiles.value)
    file.status = 'fail'
    uploadFiles.value.splice(uploadFiles.value.indexOf(file), 1)
    props.onError(err, file, uploadFiles.value)
    props.onChange(file, uploadFiles.value)
  }

  const handleProgress = (ev, rawFile) => {
    const file = getFile(rawFile, uploadFiles.value)
    props.onProgress(ev, file, uploadFiles.value)
    file.status = 'uploading'
    file.percentage = ev.percent || 0
  }

  const handleSuccess = (res, rawFile) => {
    const file = getFile(rawFile, uploadFiles.value)
    if (file) {
      file.status = 'success'
      file.response = res
      props.onSuccess(res, file, uploadFiles.value)
      props.onChange(file, uploadFiles.value)
    }
  }

  const handleStart = (rawFile) => {
    const uid = genUid(tempIndex++)
    rawFile.uid = uid
    const file = {
      name: rawFile.name,
      percentage: 0,
      status: 'ready',
      size: rawFile.size,
      raw: rawFile,
      uid
    }
    if (props.listType === 'picture-card' || props.listType === 'picture') {
      try {
        file.url = URL.createObjectURL(rawFile)
      } catch (err) {
        console.error('[Element Error][Upload]', err)
        props.onError(err, file, uploadFiles.value)
      }
    }
    uploadFiles.value.push(file)
    props.onChange(file, uploadFiles.value)
  }

  const handleRemove = (file, raw) => {
    if (raw) {
      file = getFile(raw, uploadFiles.value)
    }
    const doRemove = () => {
      abort(file)
      const fileList = uploadFiles.value
      fileList.splice(fileList.indexOf(file), 1)
      props.onRemove(file, fileList)
    }
    if (!props.beforeRemove) {
      doRemove()
    } else if (typeof props.beforeRemove === 'function') {
      const before = props.beforeRemove(file, uploadFiles.value)
      if (before instanceof Promise) {
        before
          .then(() => {
            doRemove()
          })
          .catch()
      } else if (before !== false) {
        doRemove()
      }
    }
  }

  const submit = () => {
    uploadFiles.value
      .filter((file) => file.status === 'ready')
      .forEach((file) => {
        uploadRef.value.upload(file.raw)
      })
  }

  watch(
    () => props.listType,
    (val) => {
      if (val === 'picture-card' || val === 'picture') {
        uploadFiles.value = uploadFiles.value.map((file) => {
          if (!file.url && file.raw) {
            try {
              file.url = URL.createObjectURL(file.raw)
            } catch (err) {
              props.onError(err, file, uploadFiles.value)
            }
          }
          return file
        })
      }
    }
  )

  watch(
    () => props.fileList,
    (fileList) => {
      uploadFiles.value = fileList.map((file) => {
        file.uid = file.uid || genUid(tempIndex++)
        file.status = file.status || 'success'
        return file
      })
    },
    {
      immediate: true
    }
  )

  return {
    clearFiles,
    handleError,
    handleProgress,
    handleStart,
    handleSuccess,
    handleRemove,
    submit,
    uploadFiles,
    uploadRef
  }
}

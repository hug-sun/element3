import Upload from '../src/index.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
const postUrl = 'https://jsonplaceholder.typicode.com/posts/'
const files = [
  {
    name: 'food.jpeg',
    url:
      'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  },
  {
    name: 'food2.jpeg',
    url:
      'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  }
]

function setInputFiles(element) {
  const fileList = [new File([''], 'test.jpg'), new File([''], 'test.jpg')]
  Object.defineProperty(element, 'files', {
    value: fileList
  })
}

it('show-file-list', () => {
  const wrapper = mount(Upload, {
    props: {
      showFileList: false,
      fileList: files,
      action: postUrl
    }
  })
  expect(wrapper.find('.el-upload-list').exists()).toBe(false)
})

it('drag', () => {
  const wrapper = mount(Upload, {
    props: {
      drag: true,
      action: postUrl
    }
  })
  expect(wrapper.find('.el-upload-dragger').exists()).toBe(true)
})

it('disabled', async () => {
  const onChange = jest.fn()

  const wrapper = mount(Upload, {
    props: {
      disabled: true,
      onChange,
      action: postUrl,
      fileList: files
    }
  })

  const element = wrapper.find('input').element
  setInputFiles(element)

  await wrapper.find('input').trigger('click')
  expect(onChange).not.toHaveBeenCalled()
  expect(wrapper.find('.is-disabled').exists()).toBe(true)
})

it('limit and on-exceed', async () => {
  const onExceed = jest.fn()
  const wrapper = mount(Upload, {
    props: {
      onExceed,
      limit: 1,
      action: postUrl
    }
  })
  const fileList = [new File([''], 'test.jpg'), new File([''], 'test.jpg')]
  const element = wrapper.find('input').element
  Object.defineProperty(element, 'files', {
    value: fileList
  })
  await wrapper.find('input').trigger('change')
  expect(onExceed).toHaveBeenCalled()
})

describe('methods', () => {
  it('clearFiles', async () => {
    const wrapper = mount(Upload, {
      props: {
        action: postUrl,
        fileList: files
      }
    })

    wrapper.vm.clearFiles()
    await nextTick()
    // Why the old value is still console
    // console.log(wrapper.componentVM.uploadFiles)
  })
})

describe('slot', () => {
  it('trigger', async () => {
    const wrapper = mount(Upload, {
      slots: {
        trigger: '<div class="slot-trigger">选取文件</div>'
      },
      props: {
        action: postUrl,
        fileList: files
      }
    })
    expect(wrapper.find('.slot-trigger').exists()).toBe(true)
  })

  it('tip', async () => {
    const wrapper = mount(Upload, {
      slots: {
        tip:
          '<div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>'
      },
      props: {
        action: postUrl,
        fileList: files
      }
    })
    expect(wrapper.find('.el-upload__tip').exists()).toBe(true)
  })
})

describe('upload event', () => {
  it('on-preview', async () => {
    const onPreview = jest.fn()
    const wrapper = mount(Upload, {
      props: {
        onPreview,
        action: postUrl,
        fileList: files
      }
    })
    await wrapper.find('.el-upload-list__item-name').trigger('click')
    expect(onPreview).toHaveBeenCalled()
  })

  it('on-remove', async () => {
    const onRemove = jest.fn()
    const wrapper = mount(Upload, {
      props: {
        onRemove,
        action: postUrl,
        fileList: files
      }
    })
    await wrapper.find('.el-icon-close').trigger('click')
    expect(onRemove).toHaveBeenCalled()
  })

  it('on-success(httpRequest)', async () => {
    const httpRequest = jest.fn(() => Promise.resolve())
    const onSuccess = jest.fn()
    const onError = jest.fn()

    const wrapper = mount(Upload, {
      props: {
        httpRequest,
        onSuccess,
        onError,
        action: postUrl
      }
    })
    const element = wrapper.find('input').element
    setInputFiles(element)

    await wrapper.find('input').trigger('change')
    expect(onSuccess).toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('on-error(httpRequest)', async () => {
    const httpRequest = jest.fn(() => Promise.reject())
    const onSuccess = jest.fn()
    const onError = jest.fn()

    const wrapper = mount(Upload, {
      props: {
        httpRequest,
        onSuccess,
        onError,
        action: postUrl
      }
    })
    const element = wrapper.find('input').element
    setInputFiles(element)

    await wrapper.find('input').trigger('change')
    expect(onError).toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('on-progress(httpRequest)', async () => {
    const onProgress = jest.fn()
    const httpRequest = jest.fn(({ onProgress }) => {
      onProgress()
      Promise.resolve()
    })

    const wrapper = mount(Upload, {
      props: {
        httpRequest,
        onProgress,
        action: postUrl
      }
    })
    const element = wrapper.find('input').element
    setInputFiles(element)

    await wrapper.find('input').trigger('change')
    expect(onProgress).toHaveBeenCalled()
  })

  it('on-change(httpRequest)', async () => {
    const onChange = jest.fn()
    const httpRequest = jest.fn(() => Promise.resolve())

    const wrapper = mount(Upload, {
      props: {
        httpRequest,
        onChange,
        action: postUrl
      }
    })
    const element = wrapper.find('input').element
    setInputFiles(element)

    await wrapper.find('input').trigger('change')
    expect(onChange).toHaveBeenCalled()
  })

  it('before-upload', async () => {
    const beforeUpload = jest.fn(() => false)
    const onRemove = jest.fn()
    const wrapper = mount(Upload, {
      props: {
        beforeUpload,
        onRemove,
        action: postUrl
      }
    })
    const element = wrapper.find('input').element
    setInputFiles(element)

    await wrapper.find('input').trigger('change')
    expect(beforeUpload).toHaveBeenCalled()
    expect(onRemove).toHaveBeenCalled()
  })

  it('before-remove', async () => {
    const beforeRemove = jest.fn(() => false)
    const onRemove = jest.fn()
    const wrapper = mount(Upload, {
      props: {
        beforeRemove,
        onRemove,
        fileList: files,
        action: postUrl
      }
    })

    await wrapper.find('.el-icon-close').trigger('click')
    expect(beforeRemove).toHaveBeenCalled()
    expect(onRemove).not.toHaveBeenCalled()
  })
})

describe('list-type', () => {
  it('should have a el-upload--text/el-upload-list--text class when set listType prop value equal to text', async () => {
    const wrapper = mount(Upload, {
      props: {
        listType: 'text',
        action: postUrl,
        fileList: files
      }
    })

    expect(wrapper.find('.el-upload--text').exists()).toBe(true)
    expect(wrapper.find('.el-upload-list--text').exists()).toBe(true)
  })

  it('should have a el-upload--picture/el-upload-list--picture class when set listType prop value equal to picture', async () => {
    const wrapper = mount(Upload, {
      props: {
        listType: 'picture',
        action: postUrl,
        fileList: files
      }
    })

    expect(wrapper.find('.el-upload--picture').exists()).toBe(true)
    expect(wrapper.find('.el-upload-list--picture').exists()).toBe(true)
  })

  it('should have a el-upload--picture-card/el-upload-list--picture-card class when set listType prop value equal to picture-card', async () => {
    const wrapper = mount(Upload, {
      props: {
        listType: 'picture-card',
        action: postUrl,
        fileList: files
      }
    })

    expect(wrapper.find('.el-upload--picture-card').exists()).toBe(true)
    expect(wrapper.find('.el-upload-list--picture-card').exists()).toBe(true)
  })
})

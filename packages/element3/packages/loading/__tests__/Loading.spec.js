import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Loading from '../index'
import { directive as LoadingDirective } from '../directive'
// todo
// loading 的单元测试需要重写

const LoadingService = Loading.service

const globalOption = {
  directives: {
    Loading: LoadingDirective
  }
}

describe('Loading', () => {
  let loadingInstance, loadingInstance2
  afterEach((done) => {
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance.proxy.$el &&
        loadingInstance.proxy.$el.parentNode &&
        loadingInstance.proxy.$el.parentNode.removeChild(
          loadingInstance.proxy.$el
        )
    }
    if (loadingInstance2) {
      loadingInstance2.close()
      loadingInstance2.proxy.$el &&
        loadingInstance2.proxy.$el.parentNode &&
        loadingInstance2.proxy.$el.parentNode.removeChild(
          loadingInstance2.proxy.$el
        )
    }
    loadingInstance = loadingInstance2 = null
    setTimeout(() => {
      done()
    }, 100)
  })

  describe('as a directive', () => {
    it('create', async () => {
      const wrapper = mount(
        {
          template: `
          <div v-loading="loading"></div>
        `,
          data() {
            return {
              loading: true
            }
          }
        },
        {
          global: globalOption
        }
      )
      await nextTick()
      const mask = wrapper.find('.el-loading-mask')
      expect(mask.exists()).toBeTruthy()
    })

    it('unbind', async () => {
      const wrapper = mount(
        {
          template: `
            <div v-if="show" v-loading="loading"></div>
        `,
          data() {
            return {
              show: true,
              loading: true
            }
          }
        },
        {
          global: globalOption
        }
      )

      await nextTick()

      wrapper.vm.show = false

      await nextTick()

      const mask = wrapper.find('.el-loading-mask')
      expect(mask.exists()).toBeFalsy()
    })

    it('body', async () => {
      mount(
        {
          template: `
            <div v-if="show" v-loading.fullscreen="loading"></div>
          `,
          data() {
            return {
              loading: true,
              show: true
            }
          }
        },
        {
          global: globalOption
        }
      )
      await nextTick()

      const mask = document.querySelector('.el-loading-mask')
      expect(mask).toBeTruthy()
      expect(mask.parentNode === document.body).toBeTruthy()

      document.body.removeChild(mask)
    })

    it('fullscreen', async () => {
      mount(
        {
          template: `
            <div v-if="show" v-loading.fullscreen="loading"></div>
          `,
          data() {
            return {
              loading: true,
              show: true
            }
          }
        },
        {
          global: globalOption
        }
      )
      await nextTick()

      const mask = document.querySelector('.el-loading-mask')
      expect(mask).toBeTruthy()
      expect(mask.parentNode === document.body).toBeTruthy()

      document.body.removeChild(mask)
    })

    it('text', async () => {
      const wrapper = mount(
        {
          template: `
            <div v-if="show" v-loading="loading" element-loading-text="拼命加载中"></div>
          `,
          data() {
            return {
              loading: true,
              show: true
            }
          }
        },
        {
          global: globalOption
        }
      )
      await nextTick()

      const text = wrapper.find('.el-loading-text')
      expect(text.exists()).toBeTruthy()
      expect(text.text()).toEqual('拼命加载中')
    })

    it('customClass', async () => {
      const wrapper = mount(
        {
          template: `
            <div v-if="show" v-loading="loading"  element-loading-custom-class="loading-custom-class"></div>
          `,
          data() {
            return {
              loading: true,
              show: true
            }
          }
        },
        {
          global: globalOption
        }
      )
      await nextTick()

      const mask = wrapper.find('.el-loading-mask')
      expect(mask.classes()).toContain('loading-custom-class')
    })
  })

  describe('as a service', () => {
    it('create', () => {
      loadingInstance = LoadingService()
      expect(document.querySelector('.el-loading-mask')).toBeTruthy()
      loadingInstance.close()
    })

    it('close', () => {
      loadingInstance = LoadingService()
      loadingInstance.close()
      expect(loadingInstance.proxy.visible).toBe(false)
    })

    it('target', () => {
      const container = document.createElement('div')
      container.classList.add('loading-container')
      document.body.appendChild(container)
      loadingInstance = Loading.service({ target: container })
      const mask = document.querySelector('.el-loading-mask')
      expect(mask).toBeTruthy()
      expect(mask.parentNode).toEqual(container)
    })

    it('body', () => {
      const container = document.createElement('div')
      container.classList.add('loading-container')
      document.body.appendChild(container)
      loadingInstance = Loading.service({ target: container, body: true })
      const mask = document.querySelector('.el-loading-mask')
      expect(mask).toBeTruthy()
      expect(mask.parentNode).toEqual(document.body)
      loadingInstance.close()
    })

    it('fullscreen', () => {
      loadingInstance = LoadingService({
        fullscreen: true
      })
      const mask = document.querySelector('.el-loading-mask')
      expect(mask.parentNode).toEqual(document.body)
      expect(mask.classList.contains('is-fullscreen')).toBe(true)
    })

    it('fullscreen singleton', (done) => {
      loadingInstance = LoadingService({ fullScreen: true })
      setTimeout(() => {
        loadingInstance2 = LoadingService({ fullScreen: true })

        setTimeout(() => {
          let masks = document.querySelectorAll('.el-loading-mask')
          expect(masks.length).toEqual(1)
          loadingInstance2.close()

          setTimeout(() => {
            masks = document.querySelectorAll('.el-loading-mask')
            expect(masks.length).toEqual(0)
            done()
          }, 350)
        }, 50)
      }, 50)
    })

    it('lock', () => {
      loadingInstance = LoadingService({
        lock: true
      })
      expect(
        document.body.classList.contains('el-loading-parent--hidden')
      ).toBe(true)
    })

    it.only('text', () => {
      loadingInstance = LoadingService({
        text: 'Loading...'
      })
      const text = document.querySelector('.el-loading-text')
      expect(text).toBeTruthy()
      expect(text.textContent).toEqual('Loading...')
    })

    it('customClass', () => {
      loadingInstance = LoadingService({
        customClass: 'el-loading-custom-class'
      })
      const customClass = document.querySelector('.el-loading-custom-class')
      expect(customClass).toBeTruthy()
    })
  })
})

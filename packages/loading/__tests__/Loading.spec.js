// import { getStyle } from '../../../src/utils/dom'
// import { createVue, destroyVM } from '../util'
// import Vue from 'vue'
// import LoadingRaw from 'packages/loading'
// const Loading = LoadingRaw.service

// import { mount } from '@vue/test-utils'
import Loading from '../index'

const LoadingService = Loading.service

describe('Loading', () => {
  let loadingInstance, loadingInstance2
  afterEach((done) => {
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance.ctx.$el &&
        loadingInstance.ctx.$el.parentNode &&
        loadingInstance.ctx.$el.parentNode.removeChild(loadingInstance.ctx.$el)
    }
    if (loadingInstance2) {
      loadingInstance2.close()
      loadingInstance2.ctx.$el &&
        loadingInstance2.ctx.$el.parentNode &&
        loadingInstance2.ctx.$el.parentNode.removeChild(
          loadingInstance2.ctx.$el
        )
    }
    loadingInstance = loadingInstance2 = null
    setTimeout(() => {
      done()
    }, 100)
  })

  // describe('as a directive', () => {
  //   it('create', done => {
  //     vm = createVue({
  //       template: `
  //       <div v-loading="loading"></div>
  //     `,
  //
  //       data() {
  //         return {
  //           loading: true
  //         }
  //       }
  //     })
  //     Vue.nextTick(() => {
  //       const mask = vm.$el.querySelector('.el-loading-mask')
  //       expect(mask).to.exist
  //       vm.loading = false
  //       setTimeout(() => {
  //         expect(mask.style.display).to.equal('none')
  //         done()
  //       }, 100)
  //     })
  //   })
  //
  //   it('unbind', done => {
  //     const vm1 = createVue({
  //       template: `
  //       <div v-if="show" v-loading="loading"></div>
  //     `,
  //
  //       data() {
  //         return {
  //           show: true,
  //           loading: true
  //         }
  //       }
  //     })
  //     const vm2 = createVue({
  //       template: `
  //       <div v-if="show" v-loading.body="loading"></div>
  //     `,
  //
  //       data() {
  //         return {
  //           show: true,
  //           loading: true
  //         }
  //       }
  //     })
  //     Vue.nextTick(() => {
  //       vm1.loading = false
  //       vm2.loading = false
  //       Vue.nextTick(() => {
  //         vm1.show = false
  //         vm2.show = false
  //         Vue.nextTick(() => {
  //           expect(document.querySelector('.el-loading-mask')).to.not.exist
  //           done()
  //         })
  //       })
  //     })
  //   })
  //
  //   it('body', done => {
  //     vm = createVue({
  //       template: `
  //       <div v-loading.body="loading"></div>
  //     `,
  //
  //       data() {
  //         return {
  //           loading: true
  //         }
  //       }
  //     }, true)
  //     Vue.nextTick(() => {
  //       const mask = document.querySelector('.el-loading-mask')
  //       expect(mask.parentNode === document.body).to.true
  //       vm.loading = false
  //       document.body.removeChild(mask)
  //       document.body.removeChild(vm.$el)
  //       done()
  //     })
  //   })
  //
  //   it('fullscreen', done => {
  //     vm = createVue({
  //       template: `
  //       <div v-loading.fullscreen="loading"></div>
  //     `,
  //
  //       data() {
  //         return {
  //           loading: true
  //         }
  //       }
  //     }, true)
  //     Vue.nextTick(() => {
  //       const mask = document.querySelector('.el-loading-mask')
  //       expect(mask.parentNode === document.body).to.true
  //       expect(mask.classList.contains('is-fullscreen')).to.true
  //       vm.loading = false
  //       document.body.removeChild(mask)
  //       document.body.removeChild(vm.$el)
  //       done()
  //     })
  //   })
  //
  //   it('lock', done => {
  //     vm = createVue({
  //       template: `
  //       <div v-loading.fullscreen.lock="loading"></div>
  //     `,
  //
  //       data() {
  //         return {
  //           loading: true
  //         }
  //       }
  //     }, true)
  //     Vue.nextTick(() => {
  //       expect(getStyle(document.body, 'overflow')).to.equal('hidden')
  //       vm.loading = false
  //       document.body.removeChild(document.querySelector('.el-loading-mask'))
  //       document.body.removeChild(vm.$el)
  //       done()
  //     })
  //   })
  //
  //   it('text', done => {
  //     vm = createVue({
  //       template: `
  //       <div v-loading="loading" element-loading-text="拼命加载中"></div>
  //     `,
  //
  //       data() {
  //         return {
  //           loading: true
  //         }
  //       }
  //     }, true)
  //     Vue.nextTick(() => {
  //       const mask = document.querySelector('.el-loading-mask')
  //       const text = mask.querySelector('.el-loading-text')
  //       expect(text).to.exist
  //       expect(text.textContent).to.equal('拼命加载中')
  //       done()
  //     })
  //   })
  //
  //   it('customClass', done => {
  //     vm = createVue({
  //       template: `
  //       <div v-loading="loading" element-loading-custom-class="loading-custom-class"></div>
  //     `,
  //
  //       data() {
  //         return {
  //           loading: true
  //         }
  //       }
  //     }, true)
  //     Vue.nextTick(() => {
  //       const mask = document.querySelector('.el-loading-mask')
  //       expect(mask.classList.contains('loading-custom-class')).to.true
  //       done()
  //     })
  //   })
  // })

  describe('as a service', () => {
    it('create', () => {
      loadingInstance = LoadingService()
      expect(document.querySelector('.el-loading-mask')).toBeTruthy()
      loadingInstance.close()
    })

    it('close', () => {
      loadingInstance = LoadingService()
      loadingInstance.close()
      expect(loadingInstance.ctx.visible).toBe(false)
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

    it('text', () => {
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

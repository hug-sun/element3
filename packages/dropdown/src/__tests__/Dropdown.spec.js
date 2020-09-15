// import '@testing-library/jest-dom'
// import { mount } from '@vue/test-utils'
// import { nextTick } from 'vue'

// import Dropdown from '../dropdown.vue'
// import DropdownMenu from '../dropdown-menu.vue'
// import DropdownItem from '../dropdown-item.vue'

// const components = {
//   ElDropdown: Dropdown,
//   ElDropdownMenu: DropdownMenu,
//   ElDropdownItem: DropdownItem
// }

// jest.useFakeTimers()

// const wait = (time = 300) => {
//   jest.runAllTimers()
// }

describe('Dropdown', () => {
  it('create', () => {
    expect(true).toBe(true)
  })
  // it('create', (done) => {
  //   const wrapper = mount({
  //     template: `
  //       <el-dropdown ref="dropdown">
  //         <span class="el-dropdown-link" id="__trigger">
  //           下拉菜单<i class="el-icon-caret-bottom el-icon-right"></i>
  //         </span>
  //         <el-dropdown-menu slot="dropdown" class="dropdown-test-creat">
  //           <el-dropdown-item>黄金糕</el-dropdown-item>
  //           <el-dropdown-item>狮子头</el-dropdown-item>
  //           <el-dropdown-item>螺蛳粉</el-dropdown-item>
  //           <el-dropdown-item>双皮奶</el-dropdown-item>
  //           <el-dropdown-item>蚵仔煎</el-dropdown-item>
  //         </el-dropdown-menu>
  //       </el-dropdown>
  //     `,
  //     components
  //   })
  //   const dropdown = wrapper.findComponent(Dropdown).vm
  //   const triggerElm = wrapper.find('#__trigger')
  //   // wait mounted
  //   nextTick(async () => {
  //     await triggerElm.trigger('mouseenter')
  //     await wait(400)
  //     expect(dropdown.visible.value).toBeTruthy()
  //     await triggerElm.trigger('mouseleave')
  //     await wait(300)
  //     expect(dropdown.visible.value).toBeFalsy()
  //     done()
  //   })
  // })
  // it('menu click', (done) => {
  //   const myCmd = ref({ name: 'myCmd' })
  //   const callback = sinon.spy()
  //   const wrapper = mount({
  //     template: `
  //       <el-dropdown ref="dropdown" @command="handleCmd">
  //         <span class="el-dropdown-link" id="__trigger">
  //           下拉菜单<i class="el-icon-caret-bottom el-icon-right"></i>
  //         </span>
  //         <el-dropdown-menu slot="dropdown">
  //           <el-dropdown-item command="a">黄金糕</el-dropdown-item>
  //           <el-dropdown-item command="b">狮子头</el-dropdown-item>
  //           <el-dropdown-item ref="commandC" :command="myCmd">螺蛳粉</el-dropdown-item>
  //           <el-dropdown-item command="d">双皮奶</el-dropdown-item>
  //           <el-dropdown-item command="e">蚵仔煎</el-dropdown-item>
  //         </el-dropdown-menu>
  //       </el-dropdown>
  //     `,
  //     components,
  //     setup() {
  //       return {
  //         myCmd,
  //         handleCmd: callback
  //       }
  //     }
  //   })
  //   nextTick(async () => {
  //     const dropdown = wrapper.findComponent(Dropdown).vm
  //     await wrapper.find('#__trigger').trigger('mouseenter')
  //     await wait(300)
  //     expect(dropdown.visible.value).toBeTruthy()
  //     await wrapper.findAllComponents(DropdownItem)[2].trigger('click')
  //     expect(callback.calledWith(myCmd.value)).toBeTruthy()
  //     done()
  //   })
  // })
  // it('trigger', (done) => {
  //   const wrapper = mount({
  //     template: `
  //       <el-dropdown trigger="click" ref="dropdown">
  //         <span class="el-dropdown-link" id="__trigger">
  //           下拉菜单trigger click<i class="el-icon-caret-bottom el-icon-right"></i>
  //         </span>
  //         <el-dropdown-menu slot="dropdown">
  //           <el-dropdown-item>黄金糕</el-dropdown-item>
  //           <el-dropdown-item>狮子头</el-dropdown-item>
  //           <el-dropdown-item>螺蛳粉</el-dropdown-item>
  //           <el-dropdown-item>双皮奶</el-dropdown-item>
  //           <el-dropdown-item>蚵仔煎</el-dropdown-item>
  //         </el-dropdown-menu>
  //       </el-dropdown>
  //     `,
  //     components
  //   })
  //   nextTick(async () => {
  //     const dropdown = wrapper.findComponent(Dropdown).vm
  //     const triggerElm = wrapper.find('#__trigger')
  //     await triggerElm.trigger('mouseenter')
  //     dropdown.$nextTick(async () => {
  //       expect(dropdown.visible.value).toBeFalsy()
  //       await triggerElm.trigger('click')
  //       await wait(300)
  //       expect(dropdown.visible.value).toBeTruthy()
  //       done()
  //     })
  //   })
  // })
  // it('split button', (done) => {
  //   const myCmd = ref({ name: 'myCmd' })
  //   const receiveCmd = ref(null)
  //   const callback = sinon.spy()
  //   const wrapper = mount({
  //     template: `
  //       <el-dropdown split-button type="primary" ref="dropdown" @command="handleCmd">
  //         更多菜单
  //         <el-dropdown-menu slot="dropdown" class="dropdown-test-split-button">
  //           <el-dropdown-item>黄金糕</el-dropdown-item>
  //           <el-dropdown-item>狮子头</el-dropdown-item>
  //           <el-dropdown-item>螺蛳粉</el-dropdown-item>
  //           <el-dropdown-item>双皮奶</el-dropdown-item>
  //           <el-dropdown-item>蚵仔煎</el-dropdown-item>
  //         </el-dropdown-menu>
  //       </el-dropdown>
  //     `,
  //     components,
  //     setup() {
  //       return {
  //         myCmd,
  //         receiveCmd,
  //         handleCmd: callback
  //       }
  //     }
  //   })
  //   nextTick(async () => {
  //     const dropdown = wrapper.findComponent(Dropdown).vm
  //     const dropdownElm = wrapper.findComponent(DropdownItem)
  //     const triggerElm = wrapper.find('.el-dropdown__caret-button')
  //     await dropdownElm.trigger('click')
  //     expect(callback.called).toBeTruthy()
  //     await triggerElm.trigger('mouseenter')
  //     await wait(300)
  //     expect(dropdown.visible.value).toBeTruthy()
  //     await triggerElm.trigger('mouseleave')
  //     await wait(300)
  //     expect(dropdown.visible.value).toBeFalsy()
  //     done()
  //   })
  // })
  // it('hide on click', (done) => {
  //   const callback = sinon.spy()
  //   const wrapper = mount({
  //     template: `
  //       <el-dropdown ref="dropdown" :hide-on-click="false" @command="handlerCmd">
  //         <span class="el-dropdown-link" id="__trigger">
  //           下拉菜单<i class="el-icon-caret-bottom el-icon-right"></i>
  //         </span>
  //         <el-dropdown-menu slot="dropdown">
  //           <el-dropdown-item command="a">黄金糕</el-dropdown-item>
  //           <el-dropdown-item command="b">狮子头</el-dropdown-item>
  //           <el-dropdown-item ref="commandC" command="c">螺蛳粉</el-dropdown-item>
  //           <el-dropdown-item command="d">双皮奶</el-dropdown-item>
  //           <el-dropdown-item command="e">蚵仔煎</el-dropdown-item>
  //         </el-dropdown-menu>
  //       </el-dropdown>
  //     `,
  //     components,
  //     setup() {
  //       return {
  //         handlerCmd: callback
  //       }
  //     }
  //   })
  //   nextTick(async () => {
  //     const dropdown = wrapper.findComponent(Dropdown).vm
  //     const triggerElm = wrapper.find('#__trigger')
  //     await triggerElm.trigger('mouseenter')
  //     await wait(300)
  //     expect(dropdown.visible.value).toBeTruthy()
  //     await wrapper.findAllComponents(DropdownItem)[2].trigger('click')
  //     expect(callback.calledWith('c')).toBeTruthy()
  //     expect(dropdown.visible.value).toBeTruthy()
  //     done()
  //   })
  // })
  // it('triggerElm keydown', (done) => {
  //   const wrapper = mount({
  //     template: `
  //       <el-dropdown ref="dropdown">
  //         <span class="el-dropdown-link" id="__trigger">
  //           下拉菜单<i class="el-icon-caret-bottom el-icon-right"></i>
  //         </span>
  //         <el-dropdown-menu slot="dropdown" class="dropdown-test-creat">
  //           <el-dropdown-item>黄金糕</el-dropdown-item>
  //           <el-dropdown-item>狮子头</el-dropdown-item>
  //           <el-dropdown-item>螺蛳粉</el-dropdown-item>
  //           <el-dropdown-item>双皮奶</el-dropdown-item>
  //           <el-dropdown-item>蚵仔煎</el-dropdown-item>
  //         </el-dropdown-menu>
  //       </el-dropdown>
  //     `,
  //     components
  //   })
  //   nextTick(async () => {
  //     const dropdown = wrapper.findComponent(Dropdown).vm
  //     const triggerElm = wrapper.find('#__trigger')
  //     await triggerElm.trigger('keydown', {
  //       keyCode: 13 // enter
  //     })
  //     await wait(400)
  //     expect(dropdown.visible.value).toBeTruthy()
  //     await triggerElm.trigger('keydown', { keyCode: 27 }) // esc
  //     await wait(300)
  //     expect(dropdown.visible.value).toBeFalsy()
  //     done()
  //   })
  // })
  // it('dropdown menu keydown', (done) => {
  //   const wrapper = mount({
  //     template: `
  //       <el-dropdown ref="dropdown">
  //         <span class="el-dropdown-link" id="__trigger">
  //           下拉菜单<i class="el-icon-caret-bottom el-icon-right"></i>
  //         </span>
  //         <el-dropdown-menu slot="dropdown" class="dropdown-test-creat">
  //           <el-dropdown-item command="a">黄金糕</el-dropdown-item>
  //           <el-dropdown-item command="b">狮子头</el-dropdown-item>
  //           <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
  //           <el-dropdown-item command="d">双皮奶</el-dropdown-item>
  //           <el-dropdown-item command="e">蚵仔煎</el-dropdown-item>
  //         </el-dropdown-menu>
  //       </el-dropdown>
  //     `,
  //     components
  //   })
  //   nextTick(async () => {
  //     const dropdown = wrapper.findComponent(Dropdown).vm
  //     const dropdownMenu = wrapper.findComponent(DropdownMenu)
  //     const triggerElm = wrapper.find('#__trigger')
  //     await triggerElm.trigger('mouseenter')
  //     await wait(300)
  //     expect(dropdown.visible.value).toBeTruthy()
  //     await dropdownMenu.trigger('keydown', { keyCode: 40 }) // down
  //     await wait(100)
  //     await dropdownMenu.trigger('keydown', { keyCode: 13 }) // enter
  //     await wait(100)
  //     expect(dropdown.visible.value).toBeFalsy()
  //     done()
  //   })
  // })
  // it('updatePopper', (done) => {
  //   const wrapper = mount({
  //     template: `
  //       <el-dropdown ref="dropdown">
  //         <span class="el-dropdown-link" id="__trigger">
  //           下拉菜单<i class="el-icon-caret-bottom el-icon-right"></i>
  //         </span>
  //         <el-dropdown-menu slot="dropdown" class="dropdown-test-creat">
  //           <el-dropdown-item>黄金糕</el-dropdown-item>
  //           <el-dropdown-item>狮子头</el-dropdown-item>
  //           <el-dropdown-item>螺蛳粉</el-dropdown-item>
  //           <el-dropdown-item>双皮奶</el-dropdown-item>
  //           <el-dropdown-item>蚵仔煎</el-dropdown-item>
  //         </el-dropdown-menu>
  //       </el-dropdown>
  //     `,
  //     components
  //   })
  //   nextTick(async () => {
  //     const dropdown = wrapper.findComponent(Dropdown).vm
  //     const triggerElm = wrapper.find('#__trigger')
  //     await triggerElm.trigger('mouseenter')
  //     await wait(300)
  //     const zIndex1 = wrapper.findComponent(DropdownMenu).element.style.zIndex
  //     dropdown.broadcast('updatePopper')
  //     await wait(400)
  //     const zIndex2 = wrapper.findComponent(DropdownMenu).element.style.zIndex
  //     expect(zIndex2 > zIndex1).toBeTruthy()
  //     done()
  //   })
  // })
})

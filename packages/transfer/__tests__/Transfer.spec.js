import ElTransfer from '../src/Transfer.vue'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
const generateData = () => {
  const data = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `备选项 ${i}`,
      disabled: i % 4 === 0
    })
  }
  return data
}

describe('Transfer', () => {
  it('create', () => {
    const wrapper = mount(ElTransfer)
    expect(wrapper.exists()).toBe(true)
  })

  it('default target list', () => {
    const Comp = {
      template: `
      <el-transfer v-model="value" :data="data"></el-transfer>
      `
    }
    const wrapper = mount(Comp, {
      props: {
        data: generateData(),
        modelValue: [1, 4]
      },
      global: {
        components: {
          ElTransfer
        }
      }
    })
    const elTransfer = wrapper.findComponent({ name: 'ElTransfer' })
    expect(elTransfer.vm.sourceData.length).toEqual(13)
  })

  it('filterable', async () => {
    const Comp = {
      template: `
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入城市拼音"
        v-model="value"
        :data="data"
      >
      </el-transfer>
      `
    }

    const wrapper = mount(Comp, {
      props: {
        data: generateData(),
        filterMethod(query, option) {
          return option.key === Number(query)
        }
      },
      global: {
        components: {
          ElTransfer
        }
      }
    })
    const elTransferPanel = wrapper.findComponent({ name: 'ElTransferPanel' })
      .vm
    elTransferPanel.query = '1'
    await nextTick()
    expect(elTransferPanel.filteredData.length).toEqual(1)
  })

  it('customize', () => {
    const Comp = {
      template: `
      <el-transfer
        filterable
        v-model="value"
        :data="data"
        :titles="titles"
        :render-content="renderFunc"
        :format="format"
      >
      </el-transfer>
      `
    }
    const wrapper = mount(Comp, {
      props: {
        modelValue: [2],
        data: generateData(),
        titles: ['表1', '表2'],
        format: { noChecked: 'no', hasChecked: 'has' }
      },
      data() {
        return {
          renderFunc(h, option) {
            return (
              <span>
                {option.key} - {option.label}
              </span>
            )
          }
        }
      },
      global: {
        components: {
          ElTransfer
        }
      }
    })

    const label = wrapper.find('.el-transfer-panel__header .el-checkbox__label')
    const panelList = wrapper.find(
      '.el-transfer-panel__list .el-checkbox__label span'
    )
    expect(label.text().indexOf('表1') > -1).toBe(true)
    expect(panelList.text()).toEqual('1 - 备选项 1')
    expect(label.find('span').text()).toEqual('no')
  })

  it('check', () => {
    const Comp = {
      template: `
      <el-transfer
        v-model="value"
        :data="data"
      >
      </el-transfer>
      `
    }

    const wrapper = mount(Comp, {
      props: {
        modelValue: [],
        data: generateData()
      },
      global: {
        components: {
          ElTransfer
        }
      }
    })
    const leftList = wrapper.findComponent({ name: 'ElTransferPanel' }).vm
    leftList.handleAllCheckedChange({ target: { checked: true } })
    expect(leftList.checked.length).toEqual(12)
  })

  it('transfer', async () => {
    const Comp = {
      template: `
      <el-transfer
        filterable
        v-model="value"
        :data="data"
        :left-default-checked="leftDefaultChecked" 
        :right-default-checked="rightDefaultChecked"
      >
      </el-transfer>
      `
    }
    const wrapper = mount(Comp, {
      props: {
        modelValue: [1],
        data: generateData(),
        leftDefaultChecked: [2, 3],
        rightDefaultChecked: [1]
      },
      global: {
        components: {
          ElTransfer
        }
      }
    })
    const transfer = wrapper.findComponent({ name: 'ElTransfer' }).vm

    transfer.addToLeft()
    await nextTick()
    expect(transfer.sourceData.length).toEqual(14)

    transfer.addToRight()
    await nextTick()
    // expect(transfer.sourceData.length).toEqual(12)

    expect(transfer.sourceData.length).toEqual(14)
  })
})

// describe('target order', () => {
//   it('original(default)', async () => {
//     const Comp = {
//       template: `
//       <el-transfer
//         v-model="value"
//         :data="data"
//         :left-default-checked="[2, 3]"
//       >
//       </el-transfer>
//       `
//     }
//     const wrapper = mount(Comp, {
//       props: {
//         data: generateData()
//       },
//       data() {
//         return {
//           value: [1, 4]
//         }
//       },
//       global: {
//         components: {
//           ElTransfer
//         }
//       }
//     })
//     const transfer = wrapper.findComponent({ name: 'ElTransfer' }).vm

//     transfer.addToRight()
//     await nextTick()
//     const targetItems = [].slice
//       .call(
//         wrapper.findAll(
//           '.el-transfer__buttons + .el-transfer-panel .el-transfer-panel__body .el-checkbox__label span'
//         )
//       )
//       .map((item) => item.text())
//     // expect(targetItems).toEqual([
//     //   '备选项 1',
//     //   '备选项 2',
//     //   '备选项 3',
//     //   '备选项 4'
//     // ])
//     expect(targetItems).toEqual(['备选项 1', '备选项 4'])
//   })

//   it('push', async () => {
//     const Comp = {
//       template: `
//         <el-transfer
//           v-model="value"
//           :data="data"
//           :left-default-checked="[2, 3]"
//           target-order="push"
//         >
//         </el-transfer>
//         `
//     }
//     const wrapper = mount(Comp, {
//       props: {
//         data: generateData()
//       },
//       data() {
//         return {
//           value: [1, 4]
//         }
//       },
//       global: {
//         components: {
//           ElTransfer
//         }
//       }
//     })
//     const transfer = wrapper.findComponent({ name: 'ElTransfer' }).vm
//     transfer.addToRight()
//     await nextTick()
//     const targetItems = [].slice
//       .call(
//         wrapper.findAll(
//           '.el-transfer__buttons + .el-transfer-panel .el-transfer-panel__body .el-checkbox__label span'
//         )
//       )
//       .map((item) => item.text())
//     // expect(targetItems).toEqual([
//     //   '备选项 1',
//     //   '备选项 4',
//     //   '备选项 2',
//     //   '备选项 3'
//     // ])
//     console.log(targetItems)
//     expect(targetItems).toEqual(['备选项 1', '备选项 4'])
//   })

//   it('unshift', async () => {
//     const Comp = {
//       template: `
//           <el-transfer
//             v-model="value"
//             :data="data"
//             :left-default-checked="[2, 3]"
//             target-order="unshift"
//           >
//           </el-transfer>
//           `
//     }
//     const wrapper = mount(Comp, {
//       props: {
//         data: generateData()
//       },
//       data() {
//         return {
//           value: [1, 4]
//         }
//       },
//       global: {
//         components: {
//           ElTransfer
//         }
//       }
//     })

//     const transfer = wrapper.findComponent({ name: 'ElTransfer' }).vm
//     transfer.addToRight()
//     await nextTick()
//     const targetItems = [].slice
//       .call(
//         wrapper.findAll(
//           '.el-transfer__buttons + .el-transfer-panel .el-transfer-panel__body .el-checkbox__label span'
//         )
//       )
//       .map((item) => item.text())
//     // expect(targetItems).toEqual([
//     //   '备选项 2',
//     //   '备选项 3',
//     //   '备选项 1',
//     //   '备选项 4'
//     // ])
//     expect(targetItems).toEqual(['备选项 1', '备选项 4'])
//   })
// })

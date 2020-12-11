/*
 * @Author: Mr Chang
 * @Date: 2020-09-21 11:35:34
 * @LastEditTime: 2020-09-21 14:45:06
 * @LastEditors: Mr Chang
 * @Description:
 * @FilePath: \element3\packages\collapse\__tests__\collapse.spec.js
 */
import Collapse from '../src/collapse'
import CollapseItem from '../src/collapse-item'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'

describe('Collapse', () => {
  it('create', async () => {
    const wrapper = mount({
      setup() {
        const activeNames = ref(['1'])
        return {
          activeNames
        }
      },
      components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem
      },
      template: `
        <el-collapse v-model="activeNames" ref="collapse">
          <el-collapse-item title="一致性 Consistency" name="1" ref="item1">
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
          </el-collapse-item>
          <el-collapse-item title="反馈 Feedback" name="2">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
          <el-collapse-item title="效率 Efficiency" name="3" ref="item3">
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </el-collapse-item>
          <el-collapse-item title="可控 Controllability" name="4">
            <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
          </el-collapse-item>
        </el-collapse>
      `
    })
    expect(wrapper.vm.$refs.item1.isActive).toBe(true)
    wrapper.vm.$refs.item3.$el
      .querySelector('.el-collapse-item__header')
      .click()
    await nextTick()
    expect(wrapper.vm.$refs.item1.isActive).toBe(true)
    expect(wrapper.vm.$refs.item3.isActive).toBe(true)
    wrapper.vm.$refs.item1.$el
      .querySelector('.el-collapse-item__header')
      .click()
    expect(wrapper.vm.$refs.item1.isActive).toBe(false)
  })

  it('accordion', async () => {
    const wrapper = mount({
      setup() {
        const activeNames = ref(['1'])
        return {
          activeNames
        }
      },
      components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem
      },
      template: `
        <el-collapse accordion v-model="activeNames" ref="collapse">
          <el-collapse-item title="一致性 Consistency" name="1" ref="item1">
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
          </el-collapse-item>
          <el-collapse-item title="反馈 Feedback" name="2">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
          <el-collapse-item title="效率 Efficiency" name="3" ref="item3">
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </el-collapse-item>
          <el-collapse-item title="可控 Controllability" name="4">
            <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
          </el-collapse-item>
        </el-collapse>
      `
    })
    expect(wrapper.vm.$refs.item1.isActive).toBe(true)
    wrapper.vm.$refs.item3.$el
      .querySelector('.el-collapse-item__header')
      .click()
    await nextTick()
    expect(wrapper.vm.$refs.item1.isActive).toBe(false)
    expect(wrapper.vm.$refs.item3.isActive).toBe(true)
  })

  it('event:change', async () => {
    const wrapper = mount({
      setup() {
        const activeNames = ref(['1'])
        return {
          activeNames
        }
      },
      components: {
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem
      },
      template: `
        <el-collapse v-model="activeNames" ref="collapse">
          <el-collapse-item title="一致性 Consistency" name="1" ref="item1">
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
          </el-collapse-item>
          <el-collapse-item title="反馈 Feedback" name="2">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
          <el-collapse-item title="效率 Efficiency" name="3" ref="item3">
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </el-collapse-item>
          <el-collapse-item title="可控 Controllability" name="4">
            <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
            <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
          </el-collapse-item>
        </el-collapse>
      `
    })
    wrapper.vm.$refs.item3.$el
      .querySelector('.el-collapse-item__header')
      .click()
    await nextTick()
    // change事件发送一次
    expect(wrapper.vm.$refs.collapse.__emitted.change.length).toBe(1)
  })
})

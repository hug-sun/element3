import Steps from '../src/steps.vue'
import Step from '../src/step.vue'
import { mount } from '@vue/test-utils'
// import { nextTick } from 'vue'

describe('Steps.vue', () => {
  describe('props', () => {
    it('create', async () => {
      const wrapper = mount({
        template: `
        <el-steps :active="active" finish-status="success">
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
          <el-step title="步骤 3"></el-step>
        </el-steps>

        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
        `,
        components: {
          [Steps.name]: Steps,
          [Step.name]: Step
        },
        data() {
          return {
            active: 0
          }
        },
        methods: {
          next() {
            if (this.active++ > 2) this.active = 0
          }
        }
      })

      const stepsDom = wrapper.find('.el-steps')

      expect(stepsDom.attributes('class')).toBe('el-steps el-steps--horizontal')

      // await nextTick()
    })
  })
})

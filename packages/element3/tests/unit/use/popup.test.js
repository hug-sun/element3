import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { PopupComponent } from '../../../src/use/popup/index'

/**
 * mock 原生的tigger
 *
 */
Element.prototype.trigger = function (eventName) {
  this.dispatchEvent(new Event(eventName))
}

describe('open a teleport', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  it('should render teleport when call PopupComponent component', () => {
    const slotText = 'test'
    mount({
      components: { PopupComponent },
      template: `<PopupComponent class="el-dialog__wrapper">${slotText}</PopupComponent>`
    })

    expect(document.querySelector('body .el-dialog__wrapper')).not.toBeNull()
    expect(
      getComputedStyle(
        document.querySelector('body .el-dialog__wrapper'),
        null
      ).getPropertyValue('z-index')
    ).toBe('2000')
    expect(document.body.innerHTML).toContain(slotText)
  })

  it('should auto increament z-index when render', () => {
    mount({
      components: { PopupComponent },
      template: `<PopupComponent class="el-popup__wrapper"></PopupComponent>`
    })

    mount({
      components: { PopupComponent },
      template: `<PopupComponent class="el-popup__wrapper"></PopupComponent>`
    })

    expect(
      getComputedStyle(
        document.querySelectorAll('body  .el-popup__wrapper')[1],
        null
      ).getPropertyValue('z-index')
    ).toBe('2002')
  })

  it(' click modal should destory teleport and teleport when closeOnClickModal eq true ', async () => {
    let clicked = false
    mount({
      setup() {
        const close = () => (clicked = true)
        return {
          close
        }
      },
      components: { PopupComponent },
      template: `<PopupComponent class="el-popup__wrapper" :closeOnClickModal="true" @close="close"></PopupComponent>`
    })

    document.querySelector('.el-popup__wrapper').trigger('click')

    await nextTick()

    expect(document.querySelector('body > .el-popup__wrapper')).toBeNull()
    expect(clicked).toBeTruthy()
  })

  it('click modal should not destory teleport and teleport when closeOnClickModal eq false', async () => {
    let clicked = false
    mount({
      setup() {
        const close = () => (clicked = true)
        return {
          close
        }
      },
      components: { PopupComponent },
      template: `<PopupComponent class="el-popup__wrapper" :closeOnClickModal="false" @close="close"></PopupComponent>`
    })

    document.querySelector('.el-popup__wrapper').trigger('click')

    await nextTick()

    expect(document.querySelector('body  .el-popup__wrapper')).not.toBeNull()
    expect(clicked).toBeFalsy()
  })

  it('lockScroll', async () => {
    mount({
      setup() {
        const show = ref(true)

        return {
          show
        }
      },
      components: { PopupComponent },
      template: `<PopupComponent v-if="show" class="el-popup__wrapper" :close="show = false" :lockScroll="true"><div>123</div></PopupComponent>`
    })

    expect(document.querySelector('.el-popup-parent--hidden')).toBeTruthy()
    document.querySelector('.el-popup__wrapper').trigger('click')
    await nextTick()
    expect(document.querySelector('.el-popup-parent--hidden')).toBeNull()
  })
})

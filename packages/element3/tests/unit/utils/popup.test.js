import { mount } from '@vue/test-utils'
import { nextTick, ref, h, onUpdated } from 'vue'
import { PopupComponent } from '../../../src/utils/popup1/index'

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
    const component = <div></div>
    const children = h('h1', 'test')

    mount(PopupComponent(component, children))

    expect(document.querySelector('body div')).not.toBeNull()

    expect(
      getComputedStyle(
        document.querySelector('body div'),
        null
      ).getPropertyValue('z-index')
    ).toBe('2000')

    expect(document.body.innerHTML).toContain(`<h1>test</h1>`)
  })

  it('should auto increament z-index when render', () => {
    const component = <div className="el-popup__wrapper"></div>
    const children = h('h1', 'test')

    mount(PopupComponent(component, children))

    mount(PopupComponent(component, children))

    expect(
      getComputedStyle(
        document.querySelectorAll('body  .el-popup__wrapper')[1],
        null
      ).getPropertyValue('z-index')
    ).toBe('2002')
  })

  it('click modal should destory teleport and teleport when closeOnClickModal eq true ', async () => {
    let clicked = false

    const component = <div className="el-popup__wrapper"></div>

    mount(PopupComponent(component))

    document.querySelector('.el-popup__wrapper').trigger('click')

    setTimeout(() => {
      expect(document.querySelector('body .el-popup__wrapper')).toBeNull()
      expect(clicked).toBeTruthy()
    }, 0)
  })

  it('click modal should not destory teleport and teleport when closeOnClickModal eq false', async () => {
    let clicked = false

    const component = <div className="el-popup__wrapper"></div>

    const props = {
      closeOnClickModal: false,
      onClose: () => (clicked = true)
    }

    mount(PopupComponent(component), {
      props
    })

    document.querySelector('.el-popup__wrapper').trigger('click')

    // await nextTick() 不能使用 ?
    setTimeout(() => {
      expect(document.querySelector('body  .el-popup__wrapper')).not.toBeNull()
      expect(clicked).toBeFalsy()
    }, 0)
  })

  it('lockScroll', async () => {
    const props = {
      lockScroll: true
    }
    const component = <div className="el-popup__wrapper"></div>

    mount(PopupComponent(component), {
      props
    })

    expect(document.querySelector('.el-popup-parent--hidden')).toBeTruthy()
    setTimeout(() => {
      document.querySelector('.el-popup__wrapper').trigger('click')
      expect(document.querySelector('.el-popup-parent--hidden')).toBeNull()
    }, 0)
  })
})

import { migrating } from '../../../src/composables/migrating'
import { mount } from '@vue/test-utils'

jest.spyOn(global.console, 'warn')

describe('migrating', () => {
  it('Attribute', () => {
    const Comp = {
      name: 'Comp',
      template: '<div>comp</div>',
      setup() {
        migrating({
          test: 'on-color is renamed to active-color'
        })
      }
    }

    mount(Comp, {
      props: {
        test: 'test'
      }
    })

    expect(console.warn).toBeCalledWith(
      '[Element Migrating][Comp][Attribute]: on-color is renamed to active-color'
    )
  })

  it(' Event', () => {
    const Comp = {
      name: 'Comp',
      template: '<div>comp</div>',
      setup() {
        migrating({
          onClick: 'click is removed'
        })
      }
    }

    mount(Comp, {
      props: {
        onClick: () => {}
      }
    })

    expect(console.warn).toBeCalledWith(
      '[Element Migrating][Comp][Event]: click is removed'
    )
  })
})

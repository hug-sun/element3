import { mount } from '@cypress/vue'
import Button from './Button.vue'
import { cy } from 'local-cypress'

describe('BaseButton', () => {
  it('should show content', () => {
    const content = 'foo'

    mount(Button, {
      slots: {
        default: content
      }
    })

    cy.contains('foo')
  })

  it('autofocus', () => {
    const Comp = {
      template: '<Button autofocus></Button>',
      components: {
        Button
      }
    }

    mount(Comp)

    cy.get('button').should('have.attr', 'autofocus')
  })

  describe('set button size', () => {
    it('by props.size', async () => {
      // 如果是一个真实的用户的话，
      // 他并不会切换 size
      // 所以说 cypress 里面的测试还是大的测试
      // 属于 e2e 测试
      // 在 ut 里面做这些切换 size 的测试就很好了
      mount(Button, {
        props: {
          size: 'small'
        }
      })
      // const { getByRole, rerender } = render(Button, {
      //   props: {
      //     size: 'small'
      //   }
      // })
      // expect(getByRole('button')).toHaveClass('el-button--small')
      // await rerender({
      //   size: 'mini'
      // })
      // expect(getByRole('button')).toHaveClass('el-button--mini')
    })

    // it('by elFormItem.elFormItemSize', async () => {
    //   const size = 'small'

    //   const elFormItem = reactive({
    //     elFormItemSize: size
    //   })

    //   const { getByRole } = render(Button, {
    //     props: {
    //       size: ''
    //     },
    //     global: {
    //       provide: {
    //         elFormItem
    //       }
    //     }
    //   })

    //   expect(getByRole('button')).toHaveClass(`el-button--${size}`)

    //   // update
    //   elFormItem.elFormItemSize = 'mini'
    //   await waitFor(() => {
    //     expect(getByRole('button')).toHaveClass(`el-button--mini`)
    //   })
    // })

    // it('by global config ', () => {
    //   const size = 'small'

    //   const { getByRole } = render(Button, {
    //     props: {
    //       size: ''
    //     },
    //     global: {
    //       plugins: [
    //         setupGlobalOptions({
    //           size
    //         })
    //       ]
    //     }
    //   })

    //   expect(getByRole('button')).toHaveClass(`el-button--${size}`)
    // })
  })
  // it('takes in the default slot', () => {
  //   mount(Button, {
  //     props: {
  //       type: 'primary'
  //     },
  //     slots: {
  //       default: 'btn'
  //     }
  //   })

  //   cy.get('button').contains('btn').click()
  // })
})

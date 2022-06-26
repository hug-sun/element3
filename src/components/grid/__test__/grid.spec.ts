import { describe } from 'vitest'
// import { render } from '@testing-library/vue'
// import ElGrid from '../Grid.vue'
// import ElGridItem from '../GridItem.vue'

describe.skip('Grid.vue', () => {
  // it('should work with import on demand', () => {
  //   render(ElGrid, {
  //     slots: {
  //       default: render(ElGridItem),
  //     },
  //   })
  // })

  // it('should work with import on demand', () => {
  //   mount(
  //     defineComponent({
  //       render () {
  //         return (
  //           <NGrid>
  //             {{
  //               default: () => [<NGi />]
  //             }}
  //           </NGrid>
  //         )
  //       }
  //     })
  //   )
  // })
  // it('用户可以通过 slot 的方式，定义组件的内容', () => {
  //   const { getByText } = render(Button, {
  //     slots: {
  //       default: '默认按钮',
  //     },
  //   })
  //   expect(getByText('默认按钮')).toBeInTheDocument()
  // })

  // // type: primary | success | warning | danger | info | text
  // it('set button type', () => {
  //   const type = 'primary'
  //   const { getByRole } = render(Button, {
  //     props: {
  //       type,
  //     },
  //   })
  //   expect(getByRole('button')).toHaveClass(`el-button--${type}`)
  // })

  // // size: medium | small  | mini;
  // it('set button size', () => {
  //   const size = 'medium'
  //   const { getByRole } = render(Button, {
  //     props: {
  //       size,
  //     },
  //   })
  //   expect(getByRole('button')).toHaveClass(`el-button--${size}`)
  // })

  // it('set button round', async () => {
  //   const { getByRole, rerender } = render(Button, {
  //     props: {
  //       round: true,
  //     },
  //   })
  //   expect(getByRole('button')).toHaveClass('is-round')

  //   await rerender({
  //     round: false,
  //   })
  //   expect(getByRole('button')).not.toHaveClass('is-round')
  // })

  // it('set button plain', async () => {
  //   const { getByRole, rerender } = render(Button, {
  //     props: {
  //       plain: true,
  //     },
  //   })
  //   expect(getByRole('button')).toHaveClass('is-plain')

  //   await rerender({
  //     plain: false,
  //   })

  //   expect(getByRole('button')).not.toHaveClass('is-plain')
  // })

  // it('set button circle', async () => {
  //   const { getByRole, rerender } = render(Button, {
  //     props: {
  //       circle: true,
  //     },
  //   })
  //   expect(getByRole('button')).toHaveClass('is-circle')

  //   await rerender({
  //     circle: false,
  //   })

  //   expect(getByRole('button')).not.toHaveClass('is-circle')
  // })

  // describe('set button disabled', () => {
  //   it('by props.disabled', async () => {
  //     const { getByRole, rerender } = render(Button, {
  //       props: {
  //         disabled: true,
  //       },
  //     })

  //     const buttonElement = getByRole('button')

  //     expect(buttonElement).toHaveClass('is-disabled')
  //     expect(buttonElement).toHaveAttribute('disabled')

  //     await rerender({
  //       disabled: false,
  //     })
  //     expect(getByRole('button')).not.toHaveClass('is-disabled')
  //     expect(getByRole('button')).not.toHaveAttribute('disabled')
  //   })
  // })

  // describe('set button icon', () => {
  //   it('set props icon', () => {
  //     const { getByTestId } = render(Button, {
  //       props: {
  //         icon: 'el-icon-edit',
  //       },
  //     })
  //     expect(getByTestId('icon')).toBeInTheDocument()
  //   })

  //   it('if loading is true, the icon will not be displayed', () => {
  //     const { getByTestId, queryByTestId } = render(Button, {
  //       props: {
  //         loading: true,
  //         icon: 'el-icon-edit',
  //       },
  //     })
  //     expect(queryByTestId('icon')).not.toBeInTheDocument()
  //     expect(getByTestId('loadingIcon')).toBeInTheDocument()
  //   })
  // })

  // // button autofocus
  // it('set button autofocus', () => {
  //   const { getByRole } = render(Button, {
  //     props: {
  //       autofocus: true,
  //     },
  //   })

  //   expect(getByRole('button')).toHaveAttribute('autofocus')
  // })

  // // native type: button | reset | submit
  // it('set button native type', () => {
  //   const { getByRole } = render(Button, {
  //     props: {
  //       nativeType: 'submit',
  //     },
  //   })
  //   expect(getByRole('button')).toHaveAttribute('type', 'submit')
  // })
})

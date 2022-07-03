import { describe } from 'vitest'
import { h } from 'vue'
import { render } from '@testing-library/vue'
import ElGrid from '../Grid.vue'
import ElGridItem from '../GridItem.vue'

describe('Grid.vue', () => {
  it('should provide a default slot to display the component content', () => {
    const { getByText } = render(ElGrid, {
      slots: { default: 'test default slot' },
    })

    expect(getByText('test default slot')).toBeInTheDocument()
  })

  it('should work with `gap` prop', async () => {
    const { baseElement } = render(ElGrid, {
      props: {
        xGap: 10,
        yGap: 20,
      },
      slots: {
        default: [
          () => h(ElGridItem, null, { default: 'test1' }),
          () => h(ElGridItem, null, { default: 'test2' }),
        ],
      },
    })

    expect(baseElement.querySelector('.el-grid').getAttribute('style')).toContain('column-gap: 10px; row-gap: 20px;')
  })

  it('should work with `offset` prop', async () => {
    const { baseElement } = render(ElGrid, {
      slots: {
        default: [
          () => h(ElGridItem, { offset: 2 }, { default: 'test1' }),
          () => h(ElGridItem, { offset: 1 }, { default: 'test1' }),
        ],
      },
    })
    const gridEl = baseElement.querySelector('.el-grid')

    expect(gridEl.children[0].getAttribute('style')).toContain('grid-column: span 3 / span 3;')
    expect(gridEl.children[1].getAttribute('style')).toContain('grid-column: span 2 / span 2;')
  })
})

import { useLocale } from '../../../src/composables/locale'
import { h } from 'vue'

const Total = (props) => {
  return typeof props.total === 'number'
    ? h(
        'span',
        { class: 'el-pagination__total' },
        useLocale()('el.pagination.total', { total: props.total })
      )
    : ''
}
export default Total

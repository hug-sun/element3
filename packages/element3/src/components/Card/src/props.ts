import { CardShadow } from './types'
import { PropType } from 'vue'

export const props = {
  header: String,
  bodyStyle: {
    type: Object,
    default: () => {
      return {
        padding: '20px'
      }
    }
  },
  shadow: {
    type: String as PropType<CardShadow>,
    default: 'always',
    validator(val: string): boolean {
      return ['always', 'hover', 'never'].includes(val)
    }
  }
}

import { isString, isNumber } from '../../../utils/types'

export const props = {
  icon: {
    type: String
  },
  size: {
    type: [Number, String],
    default: 'large',
    validator(val) {
      if (isString(val)) {
        return ['large', 'medium', 'small'].includes(val)
      }
      return isNumber(val)
    }
  },
  shape: {
    type: String,
    default: 'circle',
    validator(val) {
      return ['circle', 'square'].includes(val)
    }
  },
  src: {
    type: String
  },
  alt: {
    type: String
  },
  srcSet: {
    type: String
  },
  fit: {
    type: String,
    default: 'cover'
  },
  error: {
    type: Function
  }
}

import { isNumber } from '../../../utils/types'

export const percentageValid = (val) => isNumber(val) && val >= 0 && val <= 100
export const statuses = ['success', 'exception', 'warning']
export const statusValid = (val) => statuses.includes(val)

export const props = {
  percentage: {
    type: Number,
    default: 0,
    required: true,
    validator: percentageValid
  },
  format: Function,
  status: {
    type: String,
    validator: statusValid
  },
  color: { type: [String, Function, Array], default: '' }
}

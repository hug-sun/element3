import { render } from '@testing-library/vue'
import BetterStep from '../BetterStep'

test('should render step by status', () => {
  // <Step status="success">状态2</Step>

  // given
  const { getByText } = render(BetterStep)

  // then
  expect(getByText('状态2')).toHaveStyle({ background: 'green' })
})

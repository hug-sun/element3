// jest matchers for vtu

function toHaveClass(wrapper, className) {
  const pass = wrapper.classes().includes(className)

  const to = this.isNot ? 'not to' : 'to'
  const message = () =>
    `Expected the element ${to} have EXACTLY defined classes`

  return { message, pass }
}

expect.extend({
  toHaveClass
})

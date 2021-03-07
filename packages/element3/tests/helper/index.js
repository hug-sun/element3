// 为了吧 jest-vtu 替换成 @testing-library/vue 临时解决方案
// 重构步骤
// 后面需要用 tlv 的写法把这些方法都替换掉

export function expectHaveClass(wrapper, className) {
  expect(wrapper.classes()).toContain(className)
}

export function expectNotHaveClass(wrapper, className) {
  expect(wrapper.classes()).not.toContain(className)
}

export function expectHaveAttribute(wrapper, key, value) {
  if (arguments.length === 2) {
    expect(wrapper.attributes()).toHaveProperty(key)
    return
  }

  expect(wrapper.attributes(key)).toBe(value)
}

export function expectNotHaveAttribute(wrapper, key, value) {
  if (arguments.length === 2) {
    expect(wrapper.attributes()).not.toHaveProperty(key)
    return
  }

  expect(wrapper.attributes(key)).toBe(value)
}

export function expectHaveStyle(wrapper, styleInfo) {
  expect(wrapper.element.style).toMatchObject(styleInfo)
}

export function expectToBeExist(wrapper) {
  expect(wrapper.exists()).toBe(true)
}

export function expectNotToBeExist(wrapper) {
  expect(wrapper.exists()).toBe(false)
}

export function expectHaveTextContent(wrapper, content) {
  expect(wrapper.text()).toContain(content)
}

// 为了吧 jest-vtu 替换成 @testing-library/vue 临时解决方案
// 重构步骤
// 后面需要用 tlv 的写法把这些方法都替换掉

export function expectHaveClass(wrapper, className) {
  expect(wrapper).toHaveClass(className)
}

export function expectNotHaveClass(wrapper, className) {
  expect(wrapper).not.toHaveClass(className)
}

export function expectHaveAttribute(wrapper, key, value) {
  if (arguments.length === 2) {
    expect(wrapper).toHaveAttribute(key)
    return
  }

  expect(wrapper).toHaveAttribute(key, value)
}

export function expectNotHaveAttribute(wrapper, key, value) {
  if (arguments.length === 2) {
    expect(wrapper).not.toHaveAttribute(key)
    return
  }
  expect(wrapper).not.toHaveAttribute(key, value)
}

export function expectHaveStyle(wrapper, styleInfo) {
  expect(wrapper).toHaveStyle(styleInfo)
}

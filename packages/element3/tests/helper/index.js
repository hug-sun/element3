// 为了吧 jest-vtu 替换成 @testing-library/vue 临时解决方案
// 重构步骤

export function expectHaveClass(wrapper, className) {
  expect(wrapper).toHaveClass(className)
}

export function expectNotHaveClass(wrapper, className) {
  expect(wrapper).not.toHaveClass(className)
}

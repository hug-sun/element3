import { h, render } from 'vue'

const MOUNT_COMPONENT_REF = 'el_component'

/**
 * 创建组件实例对象
 * 返回的实例和调用 getCurrentComponent() 返回的一致
 * @param {*} Component
 */
export function createComponent(Component, props, children) {
  const vnode = h(Component, { ...props, ref: MOUNT_COMPONENT_REF }, children)
  const container = document.createElement('div')

  render(vnode, container)
  return vnode.component
}

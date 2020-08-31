import { createApp, h } from 'vue'

const MOUNT_PARENT_NAME = 'el_service_component_root'
const MOUNT_COMPONENT_REF = 'el_component'

/**
 * 创建组件实例对象
 * 注意返回的是组件代理对象
 * @param {*} Component
 */
export function createComponent(Component) {
  const Parent = {
    name: MOUNT_PARENT_NAME,
    render() {
      return h(Component, {
        ref: MOUNT_COMPONENT_REF
      })
    }
  }

  const app = createApp(Parent)
  const el = document.createElement('div')
  const vm = app.mount(el)

  return vm.$refs[MOUNT_COMPONENT_REF]
}

const getReference = (el, binding, vnode) => {
  const _ref = binding.expression ? binding.value : binding.arg
  const popper = vnode.context.$refs[_ref]
  if (popper) {
    if (Array.isArray(popper)) {
      popper[0].$refs.reference = el
    } else {
      popper.$refs.reference = el
    }
  }
}

/* directive 暂时测试不通过，待修复，目前调试看起来是directive没有正确的执行挂载导致的 */
export default {
  beforeMount(el, binding, vnode) {
    console.log(el, binding)
    getReference(el, binding, vnode)
  },
  mounted(el, binding, vnode) {
    getReference(el, binding, vnode)
  }
}

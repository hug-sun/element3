<script>
import { addClass, removeClass, hasClass } from '../../src/utils/dom'
import { h, Transition } from 'vue'
export default {
  render(proxy) {
    const data = {
      mode: 'out-in',
      onBeforeEnter(el) {
        el.style.opacity = 0.2
      },

      onEnter(el) {
        addClass(el, 'el-opacity-transition')
        el.style.opacity = 1
      },

      onAfterEnter(el) {
        removeClass(el, 'el-opacity-transition')
        el.style.opacity = ''
      },

      onBeforeLeave(el) {
        if (!el.dataset) el.dataset = {}

        if (hasClass(el, 'el-menu--collapse')) {
          removeClass(el, 'el-menu--collapse')
          el.dataset.oldOverflow = el.style.overflow
          el.dataset.scrollWidth = el.clientWidth
          addClass(el, 'el-menu--collapse')
        } else {
          addClass(el, 'el-menu--collapse')
          el.dataset.oldOverflow = el.style.overflow
          el.dataset.scrollWidth = el.clientWidth
          removeClass(el, 'el-menu--collapse')
        }

        el.style.width = el.scrollWidth + 'px'
        el.style.overflow = 'hidden'
      },

      onLeave(el) {
        addClass(el, 'horizontal-collapse-transition')
        el.style.width = el.dataset.scrollWidth + 'px'
      }
    }
    return h(Transition, data, proxy.$slots)
  }
}
</script>

<style lang="scss" scoped></style>

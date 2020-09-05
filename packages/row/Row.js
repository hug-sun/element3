import { h, provide, computed, getCurrentInstance } from 'vue'
export default {
  name: 'ElRow',
  componentName: 'ElRow',
  setup(props) {
    const style = computed(() => {
      const ret = {}
      if (props.gutter) {
        ret.marginLeft = `-${props.gutter / 2}px`
        ret.marginRight = ret.marginLeft
      }
      return ret
    })
    provide('el-row', getCurrentInstance())
    return { style }
  },
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    gutter: {
      type: Number,
      default: 0
    },
    type: String,
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'top'
    }
  },

  render() {
    return h(
      this.tag,
      {
        class: [
          'el-row',
          this.justify !== 'start' ? `is-justify-${this.justify}` : '',
          this.align !== 'top' ? `is-align-${this.align}` : '',
          { 'el-row--flex': this.type === 'flex' }
        ],
        style: this.style
      },
      this.$slots.default && this.$slots.default()
    )
  }
}

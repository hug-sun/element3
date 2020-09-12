<script lang="jsx">
import { Fragment } from 'vue'
export default {
  name: 'ElTimeline',

  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  },

  provide() {
    return {
      timeline: this
    }
  },

  render() {
    const reverse = this.reverse
    const classes = {
      'el-timeline': true,
      'is-reverse': reverse
    }
    let slots
    if (this.$slots.default) {
      slots = this.$slots.default()
      let children
      if (slots.length > 0 && slots[0].type === Fragment) {
        children = slots[0].children
      } else {
        children = slots
      }
      if (reverse) {
        children.reverse()
      }
    }

    return <ul class={classes}>{slots}</ul>
  }
}
</script>

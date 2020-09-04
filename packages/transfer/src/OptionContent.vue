<script>
import { inject, h } from 'vue'

export default {
  name: 'OptionContent',
  props: {
    option: Object,
    renderContent: Function,
    labelProp: String,
    keyProp: String
  },
  setup() {
    const defaultScopedSlots = inject('defaultScopedSlots')

    return {
      defaultScopedSlots
    }
  },
  render() {
    return this.renderContent
      ? this.renderContent(h, this.option)
      : this.defaultScopedSlots
      ? this.defaultScopedSlots({ option: this.option })
      : h('span', this.option[this.labelProp] || this.option[this.keyProp])
  }
}
</script>

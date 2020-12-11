export default {
  name: 'ElMarker',

  props: {
    mark: {
      type: [String, Object]
    }
  },
  render() {
    const label = typeof this.mark === 'string' ? this.mark : this.mark.label

    return (
      <div class="el-slider__marks-text" style={this.mark.style || {}}>
        {label}
      </div>
    )
  }
}

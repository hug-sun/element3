import { h } from 'vue'

export function hGutter() {
  return h('col', {
    name: 'gutter'
  })
}

export function hColgroup(columns, hasGutter) {
  return h('colgroup', {}, [
    ...columns.map((column) =>
      h('col', {
        name: column.id,
        key: column.id
      })
    ),
    hasGutter && hGutter()
  ])
}

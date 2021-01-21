<template>
  <table>
    <thead>
      <tr>
        <template v-for="(column, index) in columns" :key="index">
          <th>{{ column.label }}</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-for="(row, index) in rows" :key="index">
        <tr>
          <td v-for="(val, key) in row" :key="key">{{ val }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import { computed, defineComponent, unref } from 'vue'
export default defineComponent({
  name: 'ElNewTable',
  props: ['data'],
  setup(props, { slots }) {
    const columns = computed(() => {
      const tableColumns = slots.default()

      return tableColumns.map((columnsVnode) => {
        const { prop, label } = columnsVnode.props
        return {
          prop,
          label
        }
      })
    })

    function createRows(columns) {
      return computed(() => {
        return props.data.map((item) => {
          return columns.reduce((result, { prop: key }) => {
            result[key] = item[key]
            return result
          }, {})
        })
      })
    }

    const rows = createRows(unref(columns))

    return { columns, rows }
  }
})
</script>

<style></style>

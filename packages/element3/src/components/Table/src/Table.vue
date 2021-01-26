<template>
  <table>
    <thead>
      <tr>
        <template v-for="(column, index) in tableHeads" :key="index">
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
    <slot></slot>
  </table>
</template>
<script>
import {
  computed,
  defineComponent,
  ref,
  provide,
  getCurrentInstance,
  toRefs
} from 'vue'
export default defineComponent({
  name: 'ElNewTable',
  props: ['data'],
  setup(props) {
    const { data } = toRefs(props)

    useProvide()

    const { columns, registryColumn } = useColumns()
    const { tableHeads } = useTableHeads(columns)
    const { rows } = useRows(data, tableHeads)

    return {
      registryColumn,
      tableHeads,
      rows
    }
  }
})

function useProvide() {
  const instance = getCurrentInstance()

  provide('table', instance.proxy)
}

function useColumns() {
  const columns = ref([])
  function registryColumn(column) {
    columns.value.push(column)
  }

  return {
    columns,
    registryColumn
  }
}

function useTableHeads(columns) {
  const tableHeads = computed(() => {
    return columns.value.map((columnVM) => {
      const { prop, label } = columnVM.props
      return {
        prop,
        label
      }
    })
  })

  return {
    tableHeads
  }
}

function useRows(data, tableHeads) {
  const rows = computed(() => {
    return data.value.map((item) => {
      return tableHeads.value.reduce((result, { prop: key }) => {
        result[key] = item[key]
        return result
      }, {})
    })
  })

  return {
    rows
  }
}
</script>

<style></style>

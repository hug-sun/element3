<template>
  <table>
    <table-colgroup></table-colgroup>
    <thead>
      <tr>
        <th v-for="col in state.columns" :key="col.key">
          <div>{{ col.props.label }}</div>
        </th>
      </tr>
    </thead>
  </table>
</template>

<script>
import TableColgroup from './TableColgroup'
import useTableState from './useTableState'
export default {
  components: { TableColgroup },
  name: 'ElTableFooter',

  setup() {
    return useTableState()
  }
}
</script>

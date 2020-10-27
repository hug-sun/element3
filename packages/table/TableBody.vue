<template>
  <table class="el-table__body" cellspacing="0" cellpadding="0" border="0">
    <table-colgroup></table-colgroup>
    <tbody>
      <tr v-for="row in data" :key="row.id">
        <td v-for="col in columns" :key="col.id">{{ row[col.props.prop] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import TableColgroup from './TableColgroup'
import useTableState from './useTableState'
export default {
  components: { TableColgroup },
  name: 'ElTableBody',

  setup() {
    return useTableState()
  }
}
</script>

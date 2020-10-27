import { getCurrentInstance, inject, provide } from 'vue'
import Table from './Table'

const tableStateSymbol = Symbol('tableStateSymbol')
export default function useTableState(initState) {
  const ci = getCurrentInstance()
  if (ci.type === Table) {
    console.info(/useTableState: provide init/)
    provide(tableStateSymbol, initState)
    return initState
  }
  console.info(/useTableState: inject/)
  return inject(tableStateSymbol)
}

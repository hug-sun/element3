import { mount } from '@vue/test-utils'
import TableColumn from '../src/TableColumn.vue'

describe('TableColumn', () => {
  it('should registry to table ', () => {
    const columns = []

    mount(TableColumn, {
      global: {
        provide: {
          table: {
            registryColumn(column) {
              columns.push(column)
            }
          }
        }
      }
    })

    expect(columns.length).toBe(1)
  })
})

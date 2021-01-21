import Table from '../src/Table.vue'
import TableColumn from '../../TableColumn/src/TableColumn.vue'
import { mount } from '@vue/test-utils'

describe('Table', () => {
  it('基础表格', () => {
    const Comp = {
      template: `
        <el-table
          :data="tableData"
          >
          <el-table-column
            prop="date"
            label="日期" width="180">
          </el-table-column>
        </el-table>
        `,
      components: {
        'el-table': Table,
        'el-table-column': TableColumn
      },
      data() {
        return {
          tableData: [
            {
              date: '2016-05-02',
              time: 10
            },
            {
              date: '2016-05-03',
              time: 11
            }
          ]
        }
      }
    }

    const wrapper = mount(Comp)
    expect(wrapper.text()).toContain('日期')
    expect(wrapper.text()).toContain('2016-05-02')
  })
})

import Table from '../src/Table.vue'
import TableColumn from '../../TableColumn/src/TableColumn.vue'
import { mount, flushPromises } from '@vue/test-utils'

describe('Table', () => {
  describe('基础表格', () => {
    it('happy path', async () => {
      const Comp = {
        template: `
        <el-table
          :data="tableData"
          >
          <el-table-column
            prop="date"
            label="日期">
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
      await flushPromises()

      expect(wrapper.text()).toContain('日期')
      expect(wrapper.text()).toContain('2016-05-02')
    })

    it('table 内存在其他组件', async () => {
      const Comp = {
        template: `
        <el-table
          :data="tableData"
          >
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
          <div></div>
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
      await flushPromises()

      expect(wrapper.text()).toContain('日期')
      expect(wrapper.text()).toContain('2016-05-02')
    })
  })
})

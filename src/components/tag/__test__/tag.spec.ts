import { describe } from 'vitest'
import { mount } from '@vue/test-utils'

import { render } from '@testing-library/vue'
import Tag from '../Tag.vue'

describe('Tag.vue', () => {
    it('用户可以通过 slot 的方式，定义组件的内容', () => {
        const { getByText } = render(Tag, {
            slots: {
                default: '标签一',
            },
        })
        expect(getByText('标签一')).toBeInTheDocument()
    })

    // it('设置type', () => {
    //     const { getByRole } = render(Tag, {
    //         props: {
    //             type: 'success',
    //         },
    //     })
    //     expect(getByRole('span')).toHaveClass(`el-tag--success`)
    // })

})

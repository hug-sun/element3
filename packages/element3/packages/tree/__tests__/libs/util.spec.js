import {
  nodeMap,
  transitionObjectKey,
  methodInterceptor,
  extractMethods
} from '../../libs/util'

describe('utils.js', () => {
  it('nodeMap', () => {
    const a = [
      {
        id: 1,
        label: '一级 1',
        children: [
          {
            id: 4,
            label: '二级 1-1',
            children: [
              {
                id: 9,
                label: '三级 1-1-1'
              },
              {
                id: 10,
                label: '三级 1-1-2'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '一级 2',
        children: [
          {
            id: 5,
            label: '二级 2-1'
          },
          {
            id: 6,
            label: '二级 2-2'
          }
        ]
      },
      {
        id: 3,
        label: '一级 3',
        children: [
          {
            id: 7,
            label: '二级 3-1'
          },
          {
            id: 8,
            label: '二级 3-2'
          }
        ]
      }
    ]

    const b = nodeMap(
      a[0],
      (node) => {
        return node
      },
      { childKey: 'children', mapChildKey: 'children' }
    )

    expect(b === a[0]).toBeFalsy()
  })

  it('transitionObjectKey', () => {
    const obj = {
      id: 1,
      label: '一级 1'
    }

    transitionObjectKey(obj, { key: 'id', text: 'label' })

    expect(obj).toStrictEqual({
      key: 1,
      text: '一级 1'
    })
  })

  it('deep clone a and rename property', () => {
    const a = [
      {
        id: 1,
        label: '一级 1',
        children: [
          {
            id: 4,
            label: '二级 1-1',
            children: [
              {
                id: 9,
                label: '三级 1-1-1'
              },
              {
                id: 10,
                label: '三级 1-1-2'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '一级 2',
        children: [
          {
            id: 5,
            label: '二级 2-1'
          },
          {
            id: 6,
            label: '二级 2-2'
          }
        ]
      },
      {
        id: 3,
        label: '一级 3',
        children: [
          {
            id: 7,
            label: '二级 3-1'
          },
          {
            id: 8,
            label: '二级 3-2'
          }
        ]
      }
    ]

    const b = a.map((item) => {
      return nodeMap(
        item,
        (node) => {
          transitionObjectKey(node, { key: 'id', text: 'label' })
          return node
        },
        { childKey: 'children', mapChildKey: 'childNodes' }
      )
    })

    expect(b[0].key).toBe(a[0].id)
    expect(b[1].key).toBe(a[1].id)
    expect(b[1].childNodes[0].key).toBe(a[1].children[0].id)
  })

  it('methodInterceptor', () => {
    class O {
      constructor(a) {
        this.a = a
      }

      sum(b) {
        return this.a + b
      }
    }

    const o = new O(15)

    methodInterceptor(
      O,
      'sum',
      function (b) {
        expect(this.a).toBe(15)
        expect(b).toBe(10)
        return [b]
      },
      function (ret, [b]) {
        expect(b).toBe(10)
        expect(ret).toBe(25)
        return 'change'
      }
    )

    const num = o.sum(10)
    expect(num).toBe('change')
  })

  it('extractMethods', () => {
    class O {
      constructor(a) {
        this.a = a
      }

      sum(b) {
        return this.a + b
      }
    }

    const o = new O(15)

    const { sum } = extractMethods(o, ['sum'])

    expect(sum(10)).toBe(25)
  })
})

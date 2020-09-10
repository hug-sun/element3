import { nodeMap, transitionObjectKey } from '../../libs/util'

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
    expect(b).toStrictEqual(a[0])

    const c = a.map((item) => nodeMap(item))

    expect(c === a).toBeFalsy()
    expect(c).toStrictEqual(a)
  })

  it('transitionObjectKey', () => {
    const obj = {
      id: 1,
      label: '一级 1'
    }

    transitionObjectKey(obj, { id: 'key', label: 'text' })

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
})

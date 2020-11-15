import { Tree } from '../../entity/Tree'

const data = [
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

describe('Tree.js', () => {
  it('instantiate Tree', () => {
    const tree = new Tree(data /*, default */)

    expect(tree.root.childNodes).toHaveLength(data.length)
    expect(tree.root.childNodes[0].label).toBe(data[0].label)
  })

  it('update', () => {
    const tree = new Tree(data)
    data[0].label = '更新后'
    expect(tree.root.childNodes[0].label).toBe('一级 1') // update before
    tree.update()
    expect(tree.root.childNodes[0].label).toBe('更新后') // update after
  })
})

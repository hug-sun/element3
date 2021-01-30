import { Tree } from '../../src/entity/Tree'

describe('Tree.ts', () => {
  it('generate tree by rawNodes', () => {
    type RawNode = { key: number; text: string; childs?: RawNode[] }
    const rawNodes: RawNode[] = [
      {
        key: 1,
        text: 'Node1',
        childs: [
          {
            key: 11,
            text: 'Node011'
          }
        ]
      },
      {
        key: 2,
        text: 'Node2'
      }
    ]

    const tree = new Tree(rawNodes, {
      id: 'key',
      label: 'text',
      children: 'childs'
    })

    expect(tree.root.children).toHaveLength(2)
    expect(tree.root.children[0].id).toEqual(rawNodes[0].key)
    expect(tree.root.children[1].id).toEqual(rawNodes[1].key)
    expect(tree.root.children[0].children[0].id).toEqual(
      rawNodes[0].childs[0].key
    )
  })
})

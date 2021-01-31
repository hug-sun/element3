import { TreeNode } from '../../src/entity/TreeNode'

describe('TreeNode.ts', () => {
  it('init a tree', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    expect(treeNode.id).toEqual(1)
    expect(treeNode.label).toEqual('Node1')

    expect(treeNode.children[0].id).toEqual(2)
    expect(treeNode.children[0].label).toEqual('Node2')

    expect(treeNode.children[1].id).toEqual(3)
    expect(treeNode.children[1].label).toEqual('Node3')
  })

  it('test level depth', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    expect(treeNode.level).toEqual(0)
    expect(treeNode.children[0].level).toEqual(1)
    expect(treeNode.children[1].level).toEqual(1)
  })

  it('when node children is null then isLeaf with true', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node2'),
      new TreeNode(3, 'Node3')
    ])

    expect(treeNode.isLeaf).toBeFalsy()
    expect(treeNode.children[0].isLeaf).toBeTruthy()
    expect(treeNode.children[1].isLeaf).toBeTruthy()
  })

  it('test appendChild method', () => {
    const treeNode = new TreeNode(1, 'Node1', [])
    treeNode.appendChild(new TreeNode(2, 'Node2'), new TreeNode(3, 'Node3'))

    expect(treeNode.children).toHaveLength(2)
    expect(treeNode.children[0].id).toEqual(2)
    expect(treeNode.children[1].id).toEqual(3)
  })

  it('test insertChild method', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(11, 'Node2'),
      new TreeNode(12, 'Node2')
    ])
    treeNode.insertChild(1, new TreeNode(2, 'Node2'), new TreeNode(3, 'Node3'))

    expect(treeNode.children).toHaveLength(4)
    expect(treeNode.children[1].id).toEqual(2)
    expect(treeNode.children[2].id).toEqual(3)
  })

  it('test removeChild method', () => {
    const treeNode = new TreeNode(1, 'Node1', [
      new TreeNode(11, 'Node2'),
      new TreeNode(12, 'Node2')
    ])

    treeNode.removeChild(1)

    expect(treeNode.children).toHaveLength(1)
    expect(treeNode.children[0].id).toEqual(11)
  })

  it('test isChecked and isIndeterminate state', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1'),
      new TreeNode(3, 'Node1-2', [
        new TreeNode(4, 'Node1-2-1'),
        new TreeNode(5, 'Node1-2-2')
      ])
    ])

    root.setChecked(true)
    expect(root.isChecked).toBeTruthy()
    expect(root.isIndeterminate).toBeFalsy()
    expect(root.findOne(2).isChecked).toBeTruthy()
    expect(root.findOne(3).isChecked).toBeTruthy()
    expect(root.findOne(4).isChecked).toBeTruthy()
    expect(root.findOne(5).isChecked).toBeTruthy()

    const node3 = root.findOne(3)
    node3.setChecked(false)
    expect(root.isChecked).toBeFalsy()
    expect(node3.isChecked).toBeFalsy()
    expect(node3.findOne(3).isChecked).toBeFalsy()
    expect(node3.findOne(4).isChecked).toBeFalsy()
    expect(node3.findOne(5).isChecked).toBeFalsy()
    expect(root.isIndeterminate).toBeTruthy()

    const node2 = root.findOne(2)
    expect(node2.isChecked).toBeTruthy()
    node2.setChecked(false)
    expect(root.isChecked).toBeFalsy()
    expect(root.isIndeterminate).toBeFalsy()
  })

  it('find one node', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1'),
      new TreeNode(3, 'Node1-2', [new TreeNode(4, 'Node1-2-1')])
    ])

    expect(root.findOne(1)).toBe(root)
    expect(root.findOne(2)).toBe(root.children[0])
    expect(root.findOne(3)).toBe(root.children[1])
    expect(root.findOne(4)).toBe(root.children[1].children[0])
    expect(root.findOne(5)).toBeUndefined()
  })

  it('test method getCheckedNodes', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [], {
        isChecked: true
      }),
      new TreeNode(3, 'Node1-2', [], {
        isChecked: true
      })
    ])

    expect(root.getCheckedNodes()).toHaveLength(2)
  })

  it('test isStrictly', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(
        2,
        'Node1-1',
        [new TreeNode(3, 'Node1-1-1', [new TreeNode(4, 'Node1-1-1-1')])],
        {
          isStrictly: true
        }
      )
    ])

    expect(root.findOne(4).isStrictly).toBeTruthy()
    expect(root.findOne(2).isStrictly).toBeTruthy()
    expect(root.isStrictly).toBeFalsy()
  })

  it('test strictly and setChecked', () => {
    const root = new TreeNode(
      1,
      'Node1',
      [new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')])],
      {
        isStrictly: true
      }
    )

    root.findOne(2).setChecked(true)
    expect(root.findOne(2).isChecked).toBeTruthy()
    expect(root.isChecked).toBeFalsy()
    expect(root.isIndeterminate).toBeFalsy()
    expect(root.findOne(4).isChecked).toBeFalsy()

    root.setChecked(true)
    expect(root.isChecked).toBeTruthy()
    expect(root.findOne(2).isChecked).toBeTruthy()
    expect(root.findOne(4).isChecked).toBeFalsy()
  })

  it('test isDisabled is true setChecked method', () => {
    const root = new TreeNode(1, 'Node1', [
      new TreeNode(2, 'Node1-1', [new TreeNode(4, 'Node1-1-1')], {
        isDisabled: true
      })
    ])

    root.findOne(2).setChecked(true)
    expect(root.findOne(2).isChecked).toBeFalsy()
  })
})
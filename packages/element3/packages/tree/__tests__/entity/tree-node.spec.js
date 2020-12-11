import { TreeNode } from '../../entity/TreeNode'

describe('TreeNode.js', () => {
  it('test init options', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(
          112,
          'root-1-2',
          [
            new TreeNode(1121, 'root-1-2-1'),
            new TreeNode(1122, 'root-1-2-2'),
            new TreeNode(1123, 'root-1-2-3')
          ],
          { isChecked: true, isExpanded: true }
        )
      ]),
      new TreeNode(12, 'root-2', [], { isExpanded: true, isChecked: true })
    ])

    expect(treeNode.findOne(11).isExpanded).toBeTruthy()
    expect(treeNode.findOne(11).isChecked).toBeTruthy()
    expect(treeNode.findOne(11).isIndeterminate).toBeTruthy()

    expect(treeNode.findOne(1122).isChecked).toBeTruthy()
    expect(treeNode.findOne(1122).isIndeterminate).toBeFalsy()

    expect(treeNode.isExpanded).toBeTruthy()
    expect(treeNode.isChecked).toBeTruthy()
    expect(treeNode.isIndeterminate).toBeFalsy()
  })

  it('test find node', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    const node12 = treeNode.findOne(12)

    expect(node12.label).toBe('root-2')

    const nodes = treeNode.findMany('root-1')

    expect(nodes).toHaveLength(3)
  })

  it('append a node', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    treeNode.appendChild(new TreeNode(13, 'root-3'))
    expect(treeNode.findOne(13)).toBeTruthy()
  })

  it('insert a node', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    treeNode.insertChild(1, new TreeNode(10, 'root-0'))
    expect(treeNode.findOne(10)).toBeTruthy()
  })

  it('remove a node', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    const oldLen = treeNode.childNodes.length
    treeNode.removeChild(1)
    expect(treeNode.childNodes).toHaveLength(oldLen - 1)
  })

  it('get root', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    const node112 = treeNode.findOne(112)

    expect(node112.root).toBe(treeNode)
  })

  it('set checked', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    const node111 = treeNode.findOne(111)
    node111.setChecked(true)
    expect(node111.isChecked).toBeTruthy()
    expect(node111.parent.isIndeterminate).toBeTruthy()
    expect(node111.root.isIndeterminate).toBeTruthy()

    const node112 = treeNode.findOne(112)
    node112.setChecked(true)
    expect(node112.isChecked).toBeTruthy()
    expect(node112.parent.isChecked).toBeTruthy()
    expect(node112.parent.isIndeterminate).toBeFalsy()
    expect(node112.root.isIndeterminate).toBeTruthy()
  })

  it('test expand', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    const node111 = treeNode.findOne(111)
    node111.expand()
    expect(node111.isExpanded).toBeTruthy()
    expect(node111.root.isExpanded).toBeTruthy()
  })

  it('separation a  node', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    const node11 = treeNode.findOne(11)
    node11.separation()

    expect(node11.parent).toBe(null)
    expect(treeNode.findOne(11)).toBe(null)
    expect(treeNode.childNodes).toHaveLength(1)
    expect(node11.childNodes).toHaveLength(2)
  })

  it('move a node', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    const node11 = treeNode.findOne(11)

    expect(node11.move(treeNode.findOne(12), 'bottom')).toBeTruthy()
    expect(node11.move(treeNode.findOne(12), 'inner')).toBeTruthy()
    expect(treeNode.childNodes).toHaveLength(1)
    expect(treeNode.findOne(12).childNodes).toHaveLength(1)
  })

  it('async load data', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2', [], {
        isAsync: true,
        asyncLoadFn: (node, resolve) => {
          expect(node.asyncState).toBe('loading')
          setTimeout(() => {
            expect(node === treeNode.findOne(12)).toBeTruthy()
            resolve([
              new TreeNode(121, '异步加载的节点'),
              new TreeNode(122, '异步加载的节点')
            ])
            expect(node.asyncState).toBe('loaded')
            expect(node.childNodes).toHaveLength(2)
          }, 1)
        }
      })
    ])

    const node12 = treeNode.findOne(12)
    expect(node12.isLeaf).toBeFalsy()
    expect(node12.asyncState).toBe('notload')
    node12.loadAsync()
  })

  it('collapse', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])

    const node11 = treeNode.findOne(11)
    const node12 = treeNode.findOne(12)
    node11.collapse()
    expect(node11.isExpanded).toBeTruthy()
    expect(node12.isExpanded).toBeFalsy()
    node12.collapse()
    expect(node11.isExpanded).toBeFalsy()
    expect(node12.isExpanded).toBeTruthy()
  })

  it('filter', () => {
    const treeNode = new TreeNode(1, 'root', [
      new TreeNode(11, 'root-1', [
        new TreeNode(111, 'root-1-1'),
        new TreeNode(112, 'root-1-2')
      ]),
      new TreeNode(12, 'root-2')
    ])
    const node111 = treeNode.findOne(111)
    const node112 = treeNode.findOne(112)
    const node12 = treeNode.findOne(12)

    treeNode.filter((node) => {
      return node === node111
    })

    expect(node111.isVisable).toBeTruthy()
    expect(node112.isVisable).toBeFalsy()
    expect(node12.isVisable).toBeFalsy()
  })
})

import { /*CreateElement,*/ VNode } from 'vue'
import { ElementUIComponent } from './component'

export type RawNode = DefaultNodeKey

export type ID = string | number | symbol

export enum AsyncState {
  NOLOAD = 'noload',
  LOADED = 'loaded',
  LOADING = 'loading'
}

export enum Relative {
  TOP = 'top',
  INNER = 'inner',
  BOTTOM = 'bottom'
}

export interface DefaultNodeKey {
  id: ID
  label: string
  childNodes: DefaultNodeKey[]
  isDisabled: boolean
  isAsync: boolean
  isChecked: boolean
  isVisable: boolean
  isExpanded: boolean
  isLeaf: boolean
}

export interface TreeNode {
  id: ID

  label: string

  parent: TreeNode

  childNodes: TreeNode[]

  isVisable: boolean

  isChecked: boolean

  isIndeterminate: boolean

  isExpanded: boolean

  isDisabled: boolean

  isDraggable: boolean

  isRendered: boolean

  data: { raw: RawNode } // Additional data carried by the node

  isLeaf: boolean

  isAsync: boolean // Load child only at expand time

  asyncState: AsyncState // notload || loaded || loading

  asyncLoadFn: (currentNode: TreeNode, resolveFn: ResolveFn) => void // (currentNode, resolveFn) async load child node

  append: (node: TreeNode | RawNode) => void

  remove: () => void

  insert: (index: number, node: TreeNode | RawNode) => void

  removeChild: (index: number) => void

  setChecked: (value?: boolean, strictly?: boolean) => void

  setChildChildren: (value: boolean) => void

  upwardEach: (callback: Function, opt: { isSkipSelf: boolean }) => void

  depthEach: (
    upToDownCallBack: (
      node: TreeNode,
      parentNode: TreeNode,
      deep: number
    ) => boolean,
    downToUpCallBack?: (
      node: TreeNode,
      parentNode: TreeNode,
      deep: number
    ) => boolean
  ) => void

  findOne: (target: TreeNode | ID) => TreeNode

  findMany: (label: string) => TreeNode

  findChildIndex: (target: TreeNode) => number

  expand: (value: boolean, ...extraNodes: TreeNode[] | RawNode[]) => void

  setVsiable: (value: boolean) => void

  move: (target: TreeNode, relative: Relative) => boolean

  filter: (
    callback: (node: TreeNode, parentNode: TreeNode, deep: number) => boolean
  ) => boolean
}

export interface ResolveFn {
  (childNodes: RawNode[] | TreeNode[]): void
}

export interface RenderContentFnArgs {
  treeNode: TreeNode
  rawNode: RawNode
}

/** Tree Component */
export const ElTree: ITree
interface ITree extends ElementUIComponent {
  /** Tree raw data */
  data: RawNode[]

  /** Text displayed when data is void */
  emptyText: string

  defaultNodeKey: DefaultNodeKey

  renderAfterExpand: boolean

  asyncLoadFn: (node: TreeNode, resolve: ResolveFn) => void

  renderContent: (renderContentFnArgs: RenderContentFnArgs) => void

  highlightCurrent: boolean

  defaultExpandAll: boolean

  expandOnClickNode: boolean

  checkOnClickNode: boolean

  expanded: ID[]

  showCheckbox: boolean

  checkStrictly: boolean

  checked: ID[]

  currentNodeKey: ID[]

  accordion: boolean

  indent: number

  iconClass: string

  async: boolean

  draggable: boolean

  allowDrag: (treeNode: TreeNode, event: Event) => void

  allowDrop: (
    draggingNode: TreeNode,
    dropNode: TreeNode,
    type: Relative
  ) => void

  initRoot: () => void

  getParentRawNode: (rawNode: RawNode) => RawNode

  showAll: () => void

  checkedAll: () => boolean

  expandAll: () => boolean

  onNodeClick: (treeNode: TreeNode, event: Event) => void

  onNodeContextmenu: (treeNode: TreeNode, event: Event) => void

  onCheckChange: (treeNode: TreeNode, event: Event) => void

  onCheck: (treeNode: TreeNode, checked: boolean, event: Event) => void

  onCurrentChange: (treeNode: TreeNode, event: Event) => void

  onNodeExpand: (treeNode: TreeNode, event: Event) => void

  onNodeCollapse: (treeNode: TreeNode, event: Event) => void

  onNodeDragStart: (treeNode: TreeNode, event: Event) => void

  onNodeDragEnter: (
    treeNode: TreeNode,
    enterNode: TreeNode,
    event: Event
  ) => void

  onNodeDragLeave: (
    treeNode: TreeNode,
    leaveNode: TreeNode,
    event: Event
  ) => void

  onNodeDragOver: (treeNode: TreeNode, overNode: TreeNode, event: Event) => void

  onNodeDragEnd: (treeNode: TreeNode, endNode: TreeNode, event: Event) => void

  onNodeDrop: (
    treeNode: TreeNode,
    endNode: TreeNode,
    relative: Relative,
    event: Event
  ) => void
}

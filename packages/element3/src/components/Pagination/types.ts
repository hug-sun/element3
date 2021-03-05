export interface ElPaginationProps {
  layout?: string
  pagerCount?: number
  currentPage?: number
  pageCount?: number
  total?: number
  pageSize?: number
  hideOnSinglePage?: boolean
  pageSizes?: number[]
}

declare class ElPagination {
  $props: ElPaginationProps
}

export default ElPagination

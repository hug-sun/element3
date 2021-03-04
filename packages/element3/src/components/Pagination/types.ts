export interface ElPaginationProps {
  layout?: string
  pagerCount?: number
  currentPage?: number
  pageCount?: number
  total?: number
  pageSize?: number
  hideOnSinglePage?: boolean
}

declare class ElPagination {
  $props: ElPaginationProps
}

export default ElPagination

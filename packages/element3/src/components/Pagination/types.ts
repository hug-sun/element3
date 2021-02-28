export interface ElPaginationProps {
  layout?: string
  pagerCount?: number

  currentPage?: number
  pageCount?: number
}

declare class ElPagination {
  $props: ElPaginationProps
}

export default ElPagination

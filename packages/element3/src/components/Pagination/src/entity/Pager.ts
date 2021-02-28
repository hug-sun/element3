import { makerArray } from '../tools/makerArray'

export class Pager {
  private _current: number
  private _count: number
  private _viewCount: number

  get pagerCountNotSelf(): number {
    return this._viewCount - 1
  }

  get halfPager(): number {
    return Math.floor(this.pagerCountNotSelf / 2)
  }

  get leftCount(): number {
    return Math.max(this._current - 1, 0)
  }

  get rightCount(): number {
    return Math.max(this._count - this._current, 0)
  }

  get current(): number {
    return this._current
  }

  set current(v: number) {
    if (v > this.count || v < 1) {
      console.warn(`[Pager Warn] class Pager.current not over value ${v}.`)
    }
    v = Math.min(this.count, v)
    v = Math.max(1, v)
    this._current = v
  }

  get count(): number {
    return this._count
  }

  get viewCount(): number {
    return this._viewCount
  }

  get pages(): number[] {
    return makerArray(1, this._count)
  }

  get viewPages(): number[] {
    let leftViewCount = Math.min(this.leftCount, this.halfPager)
    let rightViewCount = Math.min(this.rightCount, this.halfPager)

    if (leftViewCount > rightViewCount) {
      leftViewCount =
        this.pagerCountNotSelf - Math.min(rightViewCount, this.halfPager)
    } else {
      rightViewCount =
        this.pagerCountNotSelf - Math.min(leftViewCount, this.halfPager)
    }

    return this.catOut(
      this._current - leftViewCount,
      this._current + rightViewCount
    )
  }

  get midViewPages(): number[] {
    const result = this.viewPages
    result.shift()
    result.pop()
    return result
  }

  constructor(pageCount: number, currentPage: number, pagerCount: number) {
    this._count = pageCount
    this._current = currentPage
    this._viewCount = pagerCount
  }

  catOut(start: number, end: number): number[] {
    return this.pages.slice(Math.max(start - 1, 0), Math.min(end, this._count))
  }
}

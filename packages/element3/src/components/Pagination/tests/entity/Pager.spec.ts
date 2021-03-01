import { Pager } from '../../src/entity/Pager'

describe('Pager.ts', () => {
  it('instance Pager', () => {
    const pageCount = 6
    const currentPage = 2
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.pages).toHaveLength(6)
  })

  it('view pages', () => {
    const pageCount = 10
    const currentPage = 1
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.midViewPages).toEqual([2, 3, 4, 5, 6])

    pager.current = 2
    expect(pager.midViewPages).toEqual([2, 3, 4, 5, 6])

    pager.current = 3
    expect(pager.midViewPages).toEqual([2, 3, 4, 5, 6])

    pager.current = 5
    expect(pager.midViewPages).toEqual([3, 4, 5, 6, 7])

    pager.current = 8
    expect(pager.midViewPages).toEqual([5, 6, 7, 8, 9])

    pager.current = 9
    expect(pager.midViewPages).toEqual([5, 6, 7, 8, 9])

    pager.current = 10
    expect(pager.midViewPages).toEqual([5, 6, 7, 8, 9])

    expect(pager.leftCount).toBe(9)
    expect(pager.rightCount).toBe(0)
  })

  it('test catOut method', () => {
    const pageCount = 10
    const currentPage = 2
    const pagerCount = 7
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.catOut(1, 2)).toEqual([1, 2])
    expect(pager.catOut(4, 7)).toEqual([4, 5, 6, 7])
    expect(pager.catOut(0, 11)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('test pageCount = pagerCount', () => {
    const pageCount = 10
    const currentPage = 2
    const pagerCount = 10
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(pager.leftCount).toBe(1)
    expect(pager.rightCount).toBe(8)
  })

  it('test viewPages', () => {
    const pageCount = 10
    const currentPage = 1
    const pagerCount = 5
    const pager = new Pager({
      total: pageCount,
      size: 1,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5])

    pager.current = 2
    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5])

    pager.current = 3
    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5])

    pager.current = 4
    expect(pager.viewPages).toEqual([2, 3, 4, 5, 6])

    pager.current = 5
    expect(pager.viewPages).toEqual([3, 4, 5, 6, 7])

    pager.current = 6
    expect(pager.viewPages).toEqual([4, 5, 6, 7, 8])

    pager.current = 7
    expect(pager.viewPages).toEqual([5, 6, 7, 8, 9])

    pager.current = 8
    expect(pager.viewPages).toEqual([6, 7, 8, 9, 10])

    pager.current = 9
    expect(pager.viewPages).toEqual([6, 7, 8, 9, 10])

    pager.current = 10
    expect(pager.viewPages).toEqual([6, 7, 8, 9, 10])

    pager.current = 0
    expect(pager.viewPages).toEqual([1, 2, 3, 4, 5])

    pager.current = 11
    expect(pager.viewPages).toEqual([6, 7, 8, 9, 10])
  })
  it('test total', () => {
    const total = 100
    const currentPage = 2
    const pagerCount = 7
    const pageSize = 10
    const pager = new Pager({
      total: total,
      size: pageSize,
      current: currentPage,
      viewCount: pagerCount
    })

    expect(pager.count).toBe(10)
  })
})

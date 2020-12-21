import porps from '../src/prop/prop'
describe('porps', () => {
  test('props', () => {
    let o = { title: '23232', type: 'info' }
    const b = Object.assign(porps, o)
    expect(b.title).toBe('23232')
  })
})

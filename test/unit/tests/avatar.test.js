import Avatar from '../../../packages/avatar/src/main.vue'
import { mount } from '@vue/test-utils'
import { IMAGE_SUCCESS, IMAGE_FAIL } from '../mocks/uri'

describe('Avatar.vue', () => {
  describe('props', () => {
    describe('size', () => {
      it('size is number', () => {
        const wrapper = mount(Avatar, {
          props: {
            size: 100
          }
        })

        expect(wrapper.find('span').element.style.width).toBe('100px')
        expect(wrapper.find('span').element.style.height).toBe('100px')
        expect(wrapper.find('span').element.style.lineHeight).toBe('100px')
      })

      it('size is string', () => {
        const wrapper_large = mount(Avatar, {
          props: {
            size: 'large'
          }
        })
        const wrapper_medium = mount(Avatar, {
          props: {
            size: 'medium'
          }
        })
        const wrapper_small = mount(Avatar, {
          props: {
            size: 'small'
          }
        })

        expect(wrapper_large.find('span').classes()).toContain('el-avatar--large')
        expect(wrapper_medium.find('span').classes()).toContain('el-avatar--medium')
        expect(wrapper_small.find('span').classes()).toContain('el-avatar--small')
      })
    })

    it('shape', () => {
      const wrapper_circle = mount(Avatar, {
        props: {
          shape: 'circle'
        }
      })
      const wrapper_square = mount(Avatar, {
        props: {
          shape: 'square'
        }
      })

      expect(wrapper_circle.find('span').classes()).toContain('el-avatar--circle')
      expect(wrapper_square.find('span').classes()).toContain('el-avatar--square')
    })

    it('icon', () => {
      const wrapper = mount(Avatar, {
        props: {
          icon: 'el-icon-edit'
        }
      })

      expect(wrapper.find('span').classes()).toContain('el-avatar--icon')
      expect(wrapper.find('i').classes()).toContain('el-icon-edit')
    })

    it('src', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS
        }
      })

      expect(wrapper.find('img').attributes('src')).toBe(IMAGE_SUCCESS)
    })

    it('error', async() => {
      const wrapper = mount(Avatar, {
        props: {
          src: IMAGE_FAIL,
          error: () => true
        },
        slots: {
          default: () => 'fallback'
        }
      })

      await wrapper.find('img').trigger('error')

      expect(wrapper.vm.isImageExist).toBe(false)
      expect(wrapper.find('span').text()).toBe('fallback')
    })

    it('alt', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          alt: 'icon'
        }
      })

      expect(wrapper.find('img').attributes('alt')).toBe('icon')
    })

    it('fit', () => {
      const wrapper_fill = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'fill'
        }
      })
      const wrapper_contain = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'contain'
        }
      })
      const wrapper_cover = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'cover'
        }
      })
      const wrapper_none = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'none'
        }
      })
      const wrapper_scale_down = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'scale-down'
        }
      })

      expect(wrapper_fill.find('img').element.style.objectFit).toBe('fill')
      expect(wrapper_contain.find('img').element.style.objectFit).toBe('contain')
      expect(wrapper_cover.find('img').element.style.objectFit).toBe('cover')
      expect(wrapper_none.find('img').element.style.objectFit).toBe('none')
      expect(wrapper_scale_down.find('img').element.style.objectFit).toBe('scale-down')
    })
  })
})

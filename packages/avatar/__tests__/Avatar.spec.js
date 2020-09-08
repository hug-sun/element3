import Avatar from '../Avatar.vue'
import { mount } from '@vue/test-utils'
export const IMAGE_SUCCESS =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFmklEQVR4Xu2ba2wUVRTH/2cWtlaooFQwKpr4CkESTQBNUAkodGeaKFGD2u6WGPyAmmAEEZmpj1VhBghE/KKGBIztDIXAByWBnQ1oQREfARNiDDHiF1+ooBiksVt295hFiqSdxx3KdmcH5uv+z+3//O65c19TwgX+0AWePy4CuFgBISCQ3J6+DFLuVQKmg2k4gK3xuvwr6+9e+Xe57YViCCRttY1ALX2S/asIPLRB1jvLCSEUAFK2egKgYf0T5a6TxdhtmxqXfl8uCBUHMHfP4rqeE0OOeyS4w5T1hsgCmLNTvaWYp299EpxoyvpX5YBQ8QpotlvvkMBfeCbHvMpUjOejCSCjPSYROrySY/B+SzYmRRJA0tZWEfCcJwBGz81yvDZN6eL5hlDxIZCyta8BTPBLjIv5sVbjyp/8dEF/ryiAlL3kJkD6TsQ0STS5vWHZPhFtEE1FAYiUf28yBaZ7OpRle4IkJ6KtGIDZexfU1hyv/QXASBGjBeYpHYrxmYg2iKZiAFIZdSGIVouaLVJx0obE8v2ielFdRQA83pkemc/lDgE0StRopF6CSVuzCGgWTb6ku7T+aHztpLUng8SIaAe9ApJ265MEflvE3P8a/t2UjTHBYsTUgwqgKauOk4p0gAhxMXunVcwfmYpxX6AYQfGgAWjqTNdL3bndRDRe0NsZGYPXWLKxIGiciH5QAJye8r4UWfE5mWbCE1ZCXy+SUFBN2QEo2+fXjKK6zSDcH9Rcr55i0vj2mUsPnmu8V1xZAZxKXhq+G6A7z9U8Mx+zFOOKc433iysbgNKYj3XnNoHoXj8T3r/z+6ZsPDiwNtyjHQE07dTGSAU8QkX4LlSY6Ndh9UfWnT1Ht2QXjeZifC8INw7UOAMfE2MgB6NdhaFo65ih/+bkxRFAMqPuIaK7xM3zu6ZszO3Vt2S1CcwobXPD8TAfoZjU6LSb7AdgWmd6yLW5nqArrm5T1mtDC+A/Y3tNWe/XqY4VkLK1fwBcItp9DGZLNqQwA2DmgiUbQ0Hgs/NyBpBRD4PoqigBKOWSGxuv2XxruscXQNJWDxJoXJQAMPCnJev9XuouQ0D9PMjcXQ1DAIx9pqJP7tupLrOAZhMhEaUKAGOjqehNYgBsdSOBHo0UAOBlU9ZfFwOQUd8honmRAsA8y1SMrWIAbHUFgRZHCUCe6LqNiWU/igHIaCoR9KgAYMZRS9GvFF4Kp7LqU2B6KzoAeKulGLOEASRtrZkAK0IAVEsxlgsDaM6ojRLRtqgAIImntTcYu4UBpLKtU8D8aRQAMJD/uSZeu2t6Oi8MILldHU8SfRMFAG67wN7cHFeCcz5svaZ4koWvosO9FGbdlI1Wt850BNCSXTSMOX4iEhVAaDAT+o5AAEriVEYrgHBmj+8FI7QVwJzLjei+fPOUN0rnG46P66FoMqMdIUK9SBWEGIDvjZIrgFRGOyR6qBlWAMzQLEU3vDrRvQJsdR+BJlZzBYh8VuM1BHYSQehCMpwVwF1mwqjrewYotBk69RK0tS0AHq7eChC7UPEYAto6As6c9VfdLED8tJkwfL9DcH8J2upqgBZWbwXgalPWD/v59wCgvQTgNb8GSr+H7x3AB0zZuF3EuyuA5oz6jET0pkgjYQPAzEstxSh1oO/jVQFzALzn20IIK0CKFa5vm7niBxHvHgsh9QEQfSDSSP8KWDSaOe54GyvS3sA0vMuUjemibbgPgWzrVInZ8RChb+N9AQSdRkXNiul4qikbn4hp4f5/g7N3vDAiXpCOEcj/IwpG0VT02Nl/9NSOshjvGMinMaJJ9OqYeYulGLODxHkml7TVZ8GYT0Q3uDfKXQxaY8n6i06aZnvJDGKaB8JMAo0IYk5UW7r5BbAtNhRz22YYf4jGlXT+vRuktSrUXgRQhZ12Xi1f8BXwL38cy1+mrtJNAAAAAElFTkSuQmCC'

export const IMAGE_FAIL = 'data:image/png;base64,fail'

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
        const wrapperLarge = mount(Avatar, {
          props: {
            size: 'large'
          }
        })
        const wrapperMedium = mount(Avatar, {
          props: {
            size: 'medium'
          }
        })
        const wrapperSmall = mount(Avatar, {
          props: {
            size: 'small'
          }
        })

        expect(wrapperLarge.find('span').classes()).toContain(
          'el-avatar--large'
        )
        expect(wrapperMedium.find('span').classes()).toContain(
          'el-avatar--medium'
        )
        expect(wrapperSmall.find('span').classes()).toContain(
          'el-avatar--small'
        )
      })
    })

    it('shape', () => {
      const wrapperCircle = mount(Avatar, {
        props: {
          shape: 'circle'
        }
      })
      const wrapperSquare = mount(Avatar, {
        props: {
          shape: 'square'
        }
      })

      expect(wrapperCircle.find('span').classes()).toContain(
        'el-avatar--circle'
      )
      expect(wrapperSquare.find('span').classes()).toContain(
        'el-avatar--square'
      )
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

    it('error', async () => {
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
      const wrapperFill = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'fill'
        }
      })
      const wrapperContain = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'contain'
        }
      })
      const wrapperCover = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'cover'
        }
      })
      const wrapperNone = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'none'
        }
      })
      const wrapperScaleDown = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          fit: 'scale-down'
        }
      })

      expect(wrapperFill.find('img').element.style.objectFit).toBe('fill')
      expect(wrapperContain.find('img').element.style.objectFit).toBe('contain')
      expect(wrapperCover.find('img').element.style.objectFit).toBe('cover')
      expect(wrapperNone.find('img').element.style.objectFit).toBe('none')
      expect(wrapperScaleDown.find('img').element.style.objectFit).toBe(
        'scale-down'
      )
    })

    it('srcSet', () => {
      const wrapper = mount(Avatar, {
        props: {
          src: IMAGE_SUCCESS,
          srcSet: 'big.jpg 1440w,middle.jpg 800w'
        }
      })
      expect(wrapper.find('img').attributes('srcset')).toBe(
        'big.jpg 1440w,middle.jpg 800w'
      )
    })
  })
})

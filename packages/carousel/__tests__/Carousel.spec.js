import { h } from 'vue'
import { mount } from '@vue/test-utils'
import Carousel from '../Carousel.vue'
import CarouselItem from '../../carousel-item/CarouselItem.vue'

describe('Carousel', () => {
  it('create', () => {
    const wrapper = mount(Carousel, {
      slots: {
        default: [1, 2, 3].map(() => h(CarouselItem))
      }
    })
    expect(wrapper.props().direction).toBe('horizontal')
    expect(wrapper.findAll('.el-carousel__item').length).toBe(3)
  })

  it('auto play', (done) => {
    const autoPlay = {
      template: `
        <div>
          <carousel :interval="50">
            <carousel-item v-for="item in 3" :key="item"></carousel-item>
          </carousel>
        </div>
      `,
      components: { Carousel, CarouselItem }
    }

    const wrapper = mount(autoPlay)

    setTimeout(() => {
      const items = wrapper.findAll('.el-carousel__item')
      expect(items[0].classes()).toContain('is-active')
      setTimeout(() => {
        expect(items[1].classes()).toContain('is-active')
        done()
      }, 60)
    }, 10)
  })

  it('initial index', (done) => {
    const initialIndex = {
      template: `
        <div>
          <carousel :autoplay="false" :initial-index="1">
            <carousel-item v-for="item in 3" :key="item"></carousel-item>
          </carousel>
        </div>
      `,
      components: { Carousel, CarouselItem }
    }

    const wrapper = mount(initialIndex)

    setTimeout(() => {
      expect(wrapper.findAll('.el-carousel__item')[1].classes()).toContain(
        'is-active'
      )
      done()
    }, 10)
  })

  it('reset timer', (done) => {
    const resetTimer = {
      template: `
        <div>
          <carousel :interval="20">
            <carousel-item v-for="item in 3" :key="item"></carousel-item>
          </carousel>
        </div>
      `,
      components: { Carousel, CarouselItem }
    }

    const wrapper = mount(resetTimer)

    setTimeout(() => {
      const carousel = wrapper.findComponent({ name: 'ElCarousel' })
      const items = wrapper.findAllComponents({ name: 'ElCarouselItem' })
      carousel.trigger('mouseenter')
      setTimeout(() => {
        expect(items[0].classes()).toContain('is-active')
        carousel.trigger('mouseleave')
        setTimeout(() => {
          expect(items[1].classes()).toContain('is-active')
          done()
        }, 25)
      }, 25)
    }, 10)
  })

  // todo 需要重构这个测试 - 有时候成功有时候失败

  it('label', (done) => {
    const label = {
      template: `
        <div>
          <carousel>
            <carousel-item v-for="item in 3" :key="item" :label="item"></carousel-item>
          </carousel>
        </div>
      `,
      components: { Carousel, CarouselItem }
    }

    const wrapper = mount(label)
    setTimeout(() => {
      expect(wrapper.find('.el-carousel__button').find('span').text()).toBe('1')
      done()
    }, 10)
  })

  describe('manual control', () => {
    it('hover', (done) => {
      const hover = {
        template: `
          <div>
            <carousel :autoplay="false">
              <carousel-item v-for="item in 3" :key="item"></carousel-item>
            </carousel>
          </div>
      `,
        components: { Carousel, CarouselItem }
      }

      const wrapper = mount(hover)
      setTimeout(() => {
        const children = wrapper.findComponent({ name: 'ElCarousel' })
        children.componentVM.throttledIndicatorHover(1)
        setTimeout(() => {
          expect(wrapper.findAll('.el-carousel__item')[1].classes()).toContain(
            'is-active'
          )
          done()
        }, 10)
      }, 10)
    })

    // it('click', (done) => {
    //   const click = {
    //     template: `
    //       <div>
    //         <carousel :autoplay="false" trigger="click" ref="carousel">
    //           <carousel-item v-for="item in 3" :key="item"></carousel-item>
    //         </carousel>
    //       </div>
    //   `,
    //     components: { Carousel, CarouselItem }
    //   }

    //   const wrapper = mount(click)

    //   setTimeout(() => {
    //     const items = wrapper.findAllComponents({ name: 'ElCarouselItem' })
    //     const carousel = wrapper.findComponent({ name: 'ElCarousel' })
    //     wrapper.findAll('.el-carousel__indicator')[2].trigger('click')
    //     setTimeout(() => {
    //       expect(items[2].classes()).toContain('is-active')
    //       carousel.componentVM.handleButtonEnter('right')
    //       wrapper.find('.el-carousel__arrow--right').trigger('click')
    //       setTimeout(() => {
    //         expect(items[0].classes()).toContain('is-active')
    //         done()
    //       }, 10)
    //     }, 10)
    //   }, 10)
    // })
  })

  describe('methods', () => {
    it('setActiveItem', (done) => {
      const setActiveItem = {
        template: `
          <div>
            <carousel :autoplay="false">
              <carousel-item v-for="item in 3" :key="item"></carousel-item>
            </carousel>
          </div>
        `,
        components: { Carousel, CarouselItem }
      }
      const wrapper = mount(setActiveItem)

      setTimeout(() => {
        wrapper
          .findComponent({ name: 'ElCarousel' })
          .componentVM.setActiveItem(1)
        setTimeout(() => {
          expect(wrapper.findAll('.el-carousel__item')[1].classes()).toContain(
            'is-active'
          )
          done()
        }, 10)
      }, 10)
    })

    it('slide', (done) => {
      const slide = {
        template: `
          <div>
            <carousel :autoplay="false">
              <carousel-item v-for="item in 3" :key="item"></carousel-item>
            </carousel>
          </div>
        `,
        components: { Carousel, CarouselItem }
      }
      const wrapper = mount(slide)

      setTimeout(() => {
        const carousel = wrapper.findComponent({ name: 'ElCarousel' })
        carousel.componentVM.prev(1)
        const items = wrapper.findAllComponents({ name: 'ElCarouselItem' })
        setTimeout(() => {
          expect(items[2].classes()).toContain('is-active')
          carousel.componentVM.next(1)
          setTimeout(() => {
            expect(items[0].classes()).toContain('is-active')
            done()
          }, 10)
        }, 10)
      }, 10)
    })

    it('card', (done) => {
      const card = {
        template: `
          <div>
            <carousel :autoplay="false" type="card">
              <carousel-item v-for="item in 7" :key="item"></carousel-item>
            </carousel>
          </div>
        `,
        components: { Carousel, CarouselItem }
      }
      const wrapper = mount(card)

      setTimeout(() => {
        const items = wrapper.findAllComponents({ name: 'ElCarouselItem' })
        expect(items[0].classes()).toContain('is-active')
        expect(items[1].classes()).toContain('is-in-stage')
        expect(items[6].classes()).toContain('is-in-stage')
        items[1].trigger('click')
        setTimeout(() => {
          expect(items[1].classes()).toContain('is-active')
          wrapper.find('.el-carousel__arrow--left').trigger('click')
          setTimeout(() => {
            expect(items[0].classes()).toContain('is-active')
            items[6].trigger('click')
            setTimeout(() => {
              expect(items[6].classes()).toContain('is-active')
              done()
            }, 10)
          }, 10)
        }, 10)
      }, 10)
    })
    it('vertical direction', () => {
      const verticalDirection = {
        template: `
            <div>
              <carousel :autoplay="false" direction="vertical" height="100px">
                <carousel-item v-for="item in 3" :key="item"></carousel-item>
              </carousel>
            </div>
          `,
        components: { Carousel, CarouselItem }
      }
      const wrapper = mount(verticalDirection)
      const carousel = wrapper.findComponent({ name: 'ElCarousel' })
      const items = wrapper.findAllComponents({ name: 'ElCarouselItem' })

      expect(carousel.componentVM.direction).toBe('vertical')
      expect(items[0].attributes('style')).toContain('translateY')
    })
  })
})

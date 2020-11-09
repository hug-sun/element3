import { ElementUIComponent } from './component'

interface ICarouselItem extends ElementUIComponent {
  /** Name of the item, can be used in setActiveItem */
  name: string

  /** Text content for the corresponding indicator */
  label: string
}

/** Carousel Item Component */
export const ElCarouselItem: ICarouselItem

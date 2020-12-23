import { VNode, VNodeDirective } from 'vue'
import { ElementUIComponent } from './component'

export interface CardSlots {
  /** Content of the card */
  default: VNode[]

  /** Title of the card */
  header: VNode[]

  [key: string]: VNode[]
}

interface ICard extends ElementUIComponent {
  /** Title of the card */
  header: string

  /** CSS style of body */
  bodyStyle: object

  /** When to show card shadows */
  shadow: string

  $slots: CardSlots
}

/** Integrate information in a card container */
export const ElCard: ICard

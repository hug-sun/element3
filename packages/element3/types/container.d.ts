import { ElementUIComponent } from './component'

/** Container Component */
interface IContainer extends ElementUIComponent {
  /** Layout direction for child elements */
  direction: 'horizontal' | 'vertical'
}

export const ElContainer: IContainer

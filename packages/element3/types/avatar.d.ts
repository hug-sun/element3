import { ElementUIComponent } from './component'

/** Avatar Component */
export const ElAvatar: IAvatar

interface IAvatar extends ElementUIComponent {
  icon: string

  size: string | number

  shape: string

  src: string

  error: () => false

  srcSet: string

  alt: string

  fit: string
}

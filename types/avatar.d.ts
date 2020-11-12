import { ElementUIComponent } from './component'

/** Avatar Component */
interface IAvatar extends ElementUIComponent {
  icon: string;

  size: string | number;

  shape: string;

  src: string;

  error: () => false;

  srcSet: string;

  alt: string;

  fit: string;
}

export const ElAvatar: IAvatar

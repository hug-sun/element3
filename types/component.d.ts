import { App } from 'vue'

/** ElementUI component common definition */
export interface ElementUIComponent {
  /** Install component into Vue */
  install: (app: App, ...options: any[]) => any
}

/** Component size definition for button, input, etc */
export type ElementUIComponentSize = 'large' | 'medium' | 'small' | 'mini'

/** Horizontal alignment */
export type ElementUIHorizontalAlignment = 'left' | 'center' | 'right'

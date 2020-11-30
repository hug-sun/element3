import { VNode } from 'vue'
import { MessageType } from './message'

export type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'

export const useNotify: () => ElNotification

/** Notification Component */
interface INotificationComponent {
  /** Close the Notification instance */
  close(): void
}

export interface ElNotificationOptions {
  /** Title */
  title: string

  /** Description text */
  message: string | VNode

  /** Notification type */
  type?: MessageType

  /** Custom icon's class. It will be overridden by type */
  iconClass?: string

  /** Custom class name for Notification */
  customClass?: string

  /** Duration before close. It will not automatically close if set 0 */
  duration?: number

  /** Whether to show a close button */
  showClose?: boolean

  /** Whether message is treated as HTML string */
  dangerouslyUseHTMLString?: boolean

  /** Callback function when closed */
  onClose?: () => void

  /** Callback function when notification clicked */
  onClick?: () => void

  /** Offset from the top edge of the screen. Every Notification instance of the same moment should have the same offset */
  offset?: number

  /** custom position */
  position?: NotificationPosition
}

export interface ElNotification {
  /** Show a notification */
  (options: ElNotificationOptions): INotificationComponent

  /** Show a success notification */
  success(message: string | VNode): INotificationComponent

  /** Show a success notification */
  success(options: ElNotificationOptions): INotificationComponent

  /** Show a warning notification */
  warning(message: string | VNode): INotificationComponent

  /** Show a warning notification */
  warning(options: ElNotificationOptions): INotificationComponent

  /** Show an info notification */
  info(message: string | VNode): INotificationComponent

  /** Show an info notification */
  info(options: ElNotificationOptions): INotificationComponent

  /** Show an error notification */
  error(message: string | VNode): INotificationComponent

  /** Show an error notification */
  error(options: ElNotificationOptions): INotificationComponent
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /** Displays a global notification message at the upper right corner of the page */
    $notify: ElNotification
  }
}

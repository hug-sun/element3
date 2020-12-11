import { ElementUIComponent } from './component'

interface IBreadcrumbItem extends ElementUIComponent {
  /** Target route of the link, same as to of vue-router */
  to: string | object

  /** If true, the navigation will not leave a history record */
  replace: boolean
}

/** Breadcrumb Item Component */
export const ElBreadcrumbItem: IBreadcrumbItem

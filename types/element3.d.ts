import { PluginObject, App } from 'vue'
import {
  ElementUIComponent,
  ElementUIComponentSize,
  ElementUIHorizontalAlignment
} from './component'

export { ElAlert } from './alert'
export { ElAside } from './aside'
export { ElAutocomplete } from './autocomplete'
export { ElBadge } from './badge'
export { ElBreadcrumb } from './breadcrumb'
export { ElBreadcrumbItem } from './breadcrumb-item'
export { ElButton } from './button'
export { ElButtonGroup } from './button-group'
export { ElCard } from './card'
export { ElCarousel } from './carousel'
export { ElCarouselItem } from './carousel-item'
export { ElCascader } from './cascader'
export { ElCheckbox } from './checkbox'
export { ElCheckboxButton } from './checkbox-button'
export { ElCheckboxGroup } from './checkbox-group'
export { ElRow } from './row'
export { ElCol } from './col'
export { ElMain } from './main'
export { ElContainer } from './container'
export { ElHeader } from './header'
export { ElFooter } from './footer'
export { ElProgress } from './progress'
export { ElPagination } from './pagination'
export { ElSelect } from './select'
export { ElRadioButton } from './radio-button'
export { ElInput } from './input'
export { ElInputNumber } from './input-number'
export { ElRadio } from './radio'
export { ElRadioGroup } from './radio-group'
export { ElSlider } from './slider'
export { ElSwitch } from './switch'
export { ElLink } from './link'
export { ElAvatar } from './avatar'
export { ElTag } from './tag'
export { ElRate } from './rate'
export { useMessage } from './message'
export { useNotify } from './notification'
export { useLoading } from './loading'
export { useMsgbox } from './message-box'
export { ElSteps } from './steps'
export { ElUpload } from './upload'
import { ElCollapse } from './collapse'
import { ElCollapseItem } from './collapse-item'
import { ElColorPicker } from './color-picker'
import { ElDatePicker } from './date-picker'
import { ElDialog } from './dialog'
import { ElDropdown } from './dropdown'
import { ElDropdownItem } from './dropdown-item'
import { ElDropdownMenu } from './dropdown-menu'
import { ElForm } from './form'
import { ElFormItem } from './form-item'

import { ElInput } from './input'
import { ElInputNumber } from './input-number'
import { ElLoading } from './loading'
import { ElMenu } from './menu'
import { ElMenuItem } from './menu-item'
import { ElMenuItemGroup } from './menu-item-group'
import { ElNotification } from './notification'
import { ElOption } from './option'
import { ElOptionGroup } from './option-group'
import { ElPopover } from './popover'

import { ElStep } from './step'

import { ElSubmenu } from './submenu'
import { ElTable } from './table'
import { ElTableColumn } from './table-column'
import { ElTabs } from './tabs'
import { ElTabPane } from './tab-pane'
import { ElTimeline } from './timeline'
import { ElTimelineItem } from './timeline-item'
import { ElTimePicker } from './time-picker'
import { ElTimeSelect } from './time-select'
import { ElTooltip } from './tooltip'
import { ElTransfer } from './transfer'
import { ElTree, TreeData } from './tree'
import { ElDivider } from './divider'
import { ElIcon } from './icon'
import { ElCalendar } from './calendar'
import { ElImage } from './image'
import { ElBacktop } from './backtop'
import { ElInfiniteScroll } from './infinite-scroll'
import { ElPageHeader } from './page-header'
import { ElDrawer } from './drawer'
import { ElPopconfirm } from './popconfirm'

export interface InstallationOptions {
  locale: any
  i18n: any
  size: string
}

/** The version of element-ui */
export const version: string

/**
 * Install all element-ui components into Vue.
 * Please do not invoke this method directly.
 * Call `app.use(ElementUI)` to install.
 */
export function install(app: App, ...options: any[]): any

/** ElementUI component common definition */
export type Component = ElementUIComponent

/** Component size definition for button, input, etc */
export type ComponentSize = ElementUIComponentSize

/** Horizontal alignment */
export type HorizontalAlignment = ElementUIHorizontalAlignment

/** Show animation while loading data */
export const Loading: ElLoading

/** Displays a global notification message at the upper right corner of the page */
export const Notification: ElNotification

/** Collapse Component */
export class Collapse extends ElCollapse {}

/** Collapse Item Component */
export class CollapseItem extends ElCollapseItem {}

/** Color Picker Component */
export class ColorPicker extends ElColorPicker {}

/** Date Picker Component */
export class DatePicker extends ElDatePicker {}

/** Dialog Component */
export class Dialog extends ElDialog {}

/** Dropdown Component */
export class Dropdown extends ElDropdown {}

/** Dropdown Item Component */
export class DropdownItem extends ElDropdownItem {}

/** Dropdown Menu Component */
export class DropdownMenu extends ElDropdownMenu {}

/** Form Component */
export class Form extends ElForm {}

/** Form Item Component */
export class FormItem extends ElFormItem {}

/** Input Component */
export class Input extends ElInput {}

/** Input Number Component */
export class InputNumber extends ElInputNumber {}

/** Menu that provides navigation for your website */
export class Menu extends ElMenu {}

/** Menu Item Component */
export class MenuItem extends ElMenuItem {}

/** Menu Item Group Component */
export class MenuItemGroup extends ElMenuItemGroup {}

/** Dropdown Select Option Component */
export class Option extends ElOption {}

/** Dropdown Select Option Group Component */
export class OptionGroup extends ElOptionGroup {}

/** Popover Component */
export class Popover extends ElPopover {}

/** Rate Component */
export class Rate extends ElRate {}

/** Slider Component */
export class Slider extends ElSlider {}

/** Step Component */
export class Step extends ElStep {}

/** Submenu Component */
export class Submenu extends ElSubmenu {}

/** Table Component */
export class Table extends ElTable {}

/** Table Column Component */
export class TableColumn extends ElTableColumn {}

/** Tabs Component */
export class Tabs extends ElTabs {}

/** Tab Pane Component */
export class TabPane extends ElTabPane {}

/** Timeline Component */
export class Timeline extends ElTimeline {}

/** Timeline Item Component */
export class TimelineItem extends ElTimelineItem {}

/** TimePicker Component */
export class TimePicker extends ElTimePicker {}

/** TimeSelect Component */
export class TimeSelect extends ElTimeSelect {}

/** Tooltip Component */
export class Tooltip extends ElTooltip {}

/** Transfer Component */
export class Transfer extends ElTransfer {}

/** Tree Component */
export class Tree<K = any, D = TreeData> extends ElTree<K, D> {}

/** Divider Component */
export class Divider extends ElDivider {}

/** Image Component */
export class Image extends ElImage {}

/** Icon Component */
export class Icon extends ElIcon {}

/** Calendar Component */
export class Calendar extends ElCalendar {}

/** Backtop Component */
export class Backtop extends ElBacktop {}

/** InfiniteScroll Directive */
export const InfiniteScroll: PluginObject<ElInfiniteScroll>

/** PageHeader Component */
export class PageHeader extends ElPageHeader {}

/** Drawer Component */
export class Drawer extends ElDrawer {}

/** Popconfirm Component */
export class Popconfirm extends ElPopconfirm {}

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

import { ElCollapse } from './collapse'
import { ElCollapseItem } from './collapse-item'
import { ElColorPicker } from './color-picker'
import { ElContainer } from './container'
import { ElDatePicker } from './date-picker'
import { ElDialog } from './dialog'
import { ElDropdown } from './dropdown'
import { ElDropdownItem } from './dropdown-item'
import { ElDropdownMenu } from './dropdown-menu'
import { ElFooter } from './footer'
import { ElForm } from './form'
import { ElFormItem } from './form-item'
import { ElHeader } from './header'
import { ElLoading } from './loading'
import { ElMain } from './main'
import { ElMenu } from './menu'
import { ElMenuItem } from './menu-item'
import { ElMenuItemGroup } from './menu-item-group'
import { ElMessage } from './message'
import { ElMessageBox } from './message-box'
import { ElNotification } from './notification'
import { ElOption } from './option'
import { ElOptionGroup } from './option-group'
import { ElPopover } from './popover'
import { ElRate } from './rate'
import { ElStep } from './step'
import { ElSteps } from './steps'
import { ElSubmenu } from './submenu'
import { ElTable } from './table'
import { ElTableColumn } from './table-column'
import { ElTag } from './tag'
import { ElTabs } from './tabs'
import { ElTabPane } from './tab-pane'
import { ElTimeline } from './timeline'
import { ElTimelineItem } from './timeline-item'
import { ElTimePicker } from './time-picker'
import { ElTimeSelect } from './time-select'
import { ElTooltip } from './tooltip'
import { ElTransfer } from './transfer'
import { ElTree, TreeData } from './tree'
import { ElUpload } from './upload'
import { ElLink } from './link'
import { ElDivider } from './divider'
import { ElIcon } from './icon'
import { ElCalendar } from './calendar'
import { ElImage } from './image'
import { ElBacktop } from './backtop'
import { ElInfiniteScroll } from './infinite-scroll'
import { ElPageHeader } from './page-header'
import { ElAvatar } from './avatar'
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

/** Used to show feedback after an activity. The difference with Notification is that the latter is often used to show a system level passive notification. */
export const Message: ElMessage

/** A set of modal boxes simulating system message box, mainly for message prompt, success tips, error messages and query information */
export const MessageBox: ElMessageBox

/** Displays a global notification message at the upper right corner of the page */
export const Notification: ElNotification

/** Collapse Component */
export class Collapse extends ElCollapse {}

/** Collapse Item Component */
export class CollapseItem extends ElCollapseItem {}

/** Color Picker Component */
export class ColorPicker extends ElColorPicker {}

/** Container Component */
export class Container extends ElContainer {}

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

/** Footer Component */
export class Footer extends ElFooter {}

/** Form Component */
export class Form extends ElForm {}

/** Form Item Component */
export class FormItem extends ElFormItem {}

/** Header Component */
export class Header extends ElHeader {}

/** Main Component */
export class Main extends ElMain {}

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

/** Steps Component */
export class Steps extends ElSteps {}

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

/** Tag Component */
export class Tag extends ElTag {}

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

/** Upload Component */
export class Upload extends ElUpload {}

/** Divider Component */
export class Divider extends ElDivider {}

/** Link Component */
export class Link extends ElLink {}

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

/** Avatar Component */
export class Avatar extends ElAvatar {}

/** Drawer Component */
export class Drawer extends ElDrawer {}

/** Popconfirm Component */
export class Popconfirm extends ElPopconfirm {}

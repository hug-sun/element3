// 用于构建时的入口
// Basic
import ElRow from '../packages/row'
import ElCol from '../packages/col'
import ElContainer from '../packages/container'
import ElHeader from '../packages/header'
import ElFooter from '../packages/footer'
import ElAside from '../packages/aside'
import ElMain from '../packages/main'
import ElIcon from '../packages/icon'
import ElButton from '../packages/button'
import ElLink from '../packages/link'
// Form
import ElRadio from '../packages/radio'
import ElRadioButton from '../packages/radio-button'
import ElRadioGroup from '../packages/radio-group'
import ElCheckbox from '../packages/checkbox'
import ElCheckboxButton from '../packages/checkbox-button'
import ElCheckboxGroup from '../packages/checkbox-group'
import ElInput from '../packages/input'
import ElInputNumber from '../packages/input-number'
import ElSelect from '../packages/select'
import ElOption from '../packages/option'
import ElOptionGroup from '../packages/option-group'
import ElCascader from '../packages/cascader'
import ElCascaderPanel from '../packages/cascader-panel'
import ElSwitch from '../packages/switch'
import ElSlider from '../packages/slider'
// import ElTimePicker from '../packages/time-picker'
// import ElTimeSelect from '../packages/time-select'
// import ElDatePicker from '../packages/date-picker'
import ElUpload from '../packages/upload'
import ElRate from '../packages/rate'
import ElColorPicker from '../packages/color-picker'
import ElTransfer from '../packages/transfer'
import ElForm from '../packages/form'
import ElFormItem from '../packages/form-item'
// Data
import ElTable from '../packages/table'
import ElTableColumn from '../packages/table-column'
import ElTag from '../packages/tag'
import ElProgress from '../packages/progress'
import ElTree from '../packages/tree'
import ElPagination from '../packages/pagination'
import ElBadge from '../packages/badge'
import ElAvatar from '../packages/avatar'
// Notice
import ElAlert from '../packages/alert'

import ElLoading, { useLoading } from '../packages/loading'

import { useMessage } from '../packages/message'

import { useMsgbox } from '../packages/message-box'

import { useNotify } from '../packages/notification'
// Navigation
import ElMenu from '../packages/menu'
import ElMenuItem from '../packages/menu-item'
import ElSubmenu from '../packages/submenu'
import ElMenuItemGroup from '../packages/menu-item-group'
import ElTabs from '../packages/tabs'
import ElTabPane from '../packages/tab-pane'
import ElBreadcrumb from '../packages/breadcrumb'
import ElBreadcrumbItem from '../packages/breadcrumb-item'
import ElPageHeader from '../packages/page-header'
import ElDropdown from '../packages/dropdown'
import ElDropdownItem from '../packages/dropdown-item'
import ElDropdownMenu from '../packages/dropdown-menu'
import ElSteps from '../packages/steps'
import ElStep from '../packages/step'
// Others
import ElDialog from '../packages/dialog'
import ElTooltip from '../packages/tooltip'
import ElPopover from '../packages/popover'
import ElPopconfirm from '../packages/popconfirm'
import ElCard from '../packages/card'
import ElCarousel from '../packages/carousel'
import ElCarouselItem from '../packages/carousel-item'
import ElCollapse from '../packages/collapse'
import ElCollapseItem from '../packages/collapse-item'
import ElTimeline from '../packages/timeline'
import ElTimelineItem from '../packages/timeline-item'
import ElDivider from '../packages/divider'
import ElCalendar from '../packages/calendar'
import ElImage from '../packages/image'
import ElBacktop from '../packages/backtop'
import ElInfiniteScroll from '../packages/infinite-scroll'
import ElDrawer from '../packages/drawer'
import ElScrollbar from '../packages/scrollbar'

import { version } from '../package.json'

const components = [
  ElRow,
  ElCol,
  ElHeader,
  ElFooter,
  ElAside,
  ElMain,
  ElAlert,
  ElContainer,
  ElButton,
  ElSwitch,
  ElProgress,
  ElLink,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElBacktop,
  ElTree,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElMenuItemGroup,
  ElPagination,
  ElTag,
  ElBadge,
  ElAvatar,
  ElCarousel,
  ElCarouselItem,
  ElTabs,
  ElTabPane,
  ElPageHeader,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSteps,
  ElStep,
  ElLoading,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElCascader,
  ElCascaderPanel,
  ElSlider,
  // ElTimePicker,
  // ElTimeSelect,
  // ElDatePicker,
  ElUpload,
  ElRate,
  ElColorPicker,
  ElTransfer,
  ElOption,
  ElOptionGroup,
  ElDialog,
  ElTooltip,
  ElPopover,
  ElPopconfirm,
  ElCard,
  ElCarousel,
  ElCollapse,
  ElCollapseItem,
  ElTimeline,
  ElTimelineItem,
  ElDivider,
  ElCalendar,
  ElImage,
  ElInfiniteScroll,
  ElDrawer,
  ElScrollbar
]

const install = (app, opts = {}) => {
  app.use(setupGlobalOptions(opts))

  components.forEach((component) => {
    app.use(component)
  })
}

const setupGlobalOptions = (opts = {}) => {
  return (app) => {
    app.config.globalProperties.$ELEMENT = {
      size: opts.size || '',
      zIndex: opts.zIndex || 2000
    }
  }
}

const elementUI = {
  version,
  install
}

export {
  ElRow,
  ElCol,
  ElContainer,
  ElHeader,
  ElFooter,
  ElAside,
  ElMain,
  ElAlert,
  ElButton,
  ElSwitch,
  ElProgress,
  ElLink,
  ElIcon,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElBacktop,
  ElTree,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElMenuItemGroup,
  ElPagination,
  ElTag,
  ElBadge,
  ElAvatar,
  ElCarousel,
  ElCarouselItem,
  ElInfiniteScroll,
  ElDrawer,
  ElTabs,
  ElTabPane,
  ElPageHeader,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSteps,
  ElStep,
  ElLoading,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElCascader,
  ElCascaderPanel,
  ElSlider,
  // ElTimePicker,
  // ElTimeSelect,
  // ElDatePicker,
  ElUpload,
  ElRate,
  ElColorPicker,
  ElTransfer,
  ElOption,
  ElOptionGroup,
  ElDialog,
  ElTooltip,
  ElPopover,
  ElPopconfirm,
  ElCard,
  ElCollapse,
  ElCollapseItem,
  ElTimeline,
  ElTimelineItem,
  ElDivider,
  ElCalendar,
  ElImage,
  ElScrollbar,
  useMessage,
  useLoading,
  useMsgbox,
  useNotify,
  install,
  setupGlobalOptions
}

export default elementUI

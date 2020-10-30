// 用于构建时的入口
import ElRow from '../packages/row'
import ElCol from '../packages/col'
import ElContainer from '../packages/container'
import ElHeader from '../packages/header'
import ElFooter from '../packages/footer'
import ElAside from '../packages/aside'
import ElMain from '../packages/main'
import ElAlert from '../packages/alert'
import ElButton from '../packages/button'
import ElSwitch from '../packages/switch'
import ElProgress from '../packages/progress'
import ElLink from '../packages/link'
import ElIcon from '../packages/icon'
import ElBreadcrumb from '../packages/breadcrumb'
import ElBreadcrumbItem from '../packages/breadcrumb-item'
import ElBacktop from '../packages/backtop'
import ElTree from '../packages/tree'
import ElMenu from '../packages/menu'
import ElMenuItem from '../packages/menu-item'
import ElSubmenu from '../packages/submenu'
import ElMenuItemGroup from '../packages/menu-item-group'
import ElPagination from '../packages/pagination'
import ElTag from '../packages/tag'
import ElBadge from '../packages/badge'
import ElAvatar from '../packages/avatar'
import ElTabs from '../packages/tabs'
import ElTabPane from '../packages/tab-pane'
import ElPageHeader from '../packages/page-header'
import ElDropdown from '../packages/dropdown'
import ElDropdownItem from '../packages/dropdown-item'
import ElDropdownMenu from '../packages/dropdown-menu'
import ElSteps from '../packages/steps'
import ElStep from '../packages/step'
import ElForm from '../packages/form'
import ElFormItem from '../packages/form-item'
import ElRadio from '../packages/radio'
import ElRadioButton from '../packages/radio-button'
import ElRadioGroup from '../packages/radio-group'
import ElCheckbox from '../packages/checkbox'
import ElCheckboxButton from '../packages/checkbox-button'
import ElCheckboxGroup from '../packages/checkbox-group'
import ElInput from '../packages/input'
import ElInputNumber from '../packages/input-number'
import ElSelect from '../packages/select'
import ElCascader from '../packages/calendar'
import ElCascaderPanel from '../packages/cascader-panel'
import ElSlider from '../packages/slider'
import ElTimePicker from '../packages/time-picker'
import ElTimeSelect from '../packages/time-select'
import ElDatePicker from '../packages/date-picker'
import ElUpload from '../packages/upload'
import ElRate from '../packages/rate'
import ElColorPicker from '../packages/color-picker'
import ElTransfer from '../packages/transfer'
import ElOption from '../packages/option'
import ElOptionGroup from '../packages/option-group'

import ElLoading, { useLoading } from '../packages/loading'
import { useMessage } from '../packages/message'
import {
  useMsgbox,
  useAlert,
  usePrompt,
  useConfirm
} from '../packages/message-box'
import { useNotify } from '../packages/notification'

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
  ElTimePicker,
  ElTimeSelect,
  ElDatePicker,
  ElUpload,
  ElRate,
  ElColorPicker,
  ElTransfer,
  ElOption,
  ElOptionGroup
]

const install = (app) => {
  components.forEach((component) => {
    app.use(component)
  })
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
  ElTimePicker,
  ElTimeSelect,
  ElDatePicker,
  ElUpload,
  ElRate,
  ElColorPicker,
  ElTransfer,
  ElOption,
  ElOptionGroup,
  useMessage,
  useLoading,
  useMsgbox,
  useAlert,
  usePrompt,
  useConfirm,
  useNotify
}

export default elementUI

## 快速上手

本节将介绍如何在项目中使用 Element3。

### 引入 Element3

你可以引入整个 Element3，或是根据需要仅引入部分组件。我们先介绍如何引入完整的 Element3。

#### 完整引入

在 main.js 中写入以下内容：

```javascript
import 'element3/lib/theme-chalk/index.css'
import { createApp } from 'vue'
import Element3 from 'element3'
import App from './App.vue'

createApp(App).use(Element3).mount('#app')
```

以上代码便完成了 Element3 的引入。需要注意的是，样式文件需要单独引入。

#### 按需引入

如果你只希望引入部分组件，比如 Button ，那么需要在 main.js 中写入以下内容：

```javascript
import 'element3/lib/theme-chalk/button.css'
import { createApp } from 'vue'
import { ElButton } from 'element3'
import App from './App.vue'

createApp(App).use(ElButton).mount('#app')
```

完整组件列表和引入方式

```javascript
import App from './App.vue'
import { createApp } from 'vue'
import {
  ElRow,
  ElCol,
  ElContainer,
  ElHeader,
  ElFooter,
  ElAside,
  ElMain,
  ElIcon,
  ElButton,
  ElLink,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElOptionGroup,
  ElCascader,
  ElCascaderPanel,
  ElSwitch,
  ElSlider,
  ElTimePicker,
  ElTimeSelect,
  ElDatePicker,
  ElUpload,
  ElRate,
  ElColorPicker,
  ElTransfer,
  ElForm,
  ElFormItem,
  ElTag,
  ElProgress,
  ElTree,
  ElPagination,
  ElBadge,
  ElAvatar,
  ElAlert,
  ElLoading,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElMenuItemGroup,
  ElTabs,
  ElTabPane,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElPageHeader,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSteps,
  ElStep,
  ElDialog,
  ElTooltip,
  ElPopover,
  ElPopconfirm,
  ElCard,
  ElCarousel,
  ElCarouselItem,
  ElCollapse,
  ElCollapseItem,
  ElTimeline,
  ElTimelineItem,
  ElDivider,
  ElCalendar,
  ElImage,
  ElBacktop,
  ElInfiniteScroll,
  ElDrawer,
  ElScrollbar
} from 'element3'

createApp(App)
  .use(ElRow)
  .use(ElCol)
  .use(ElContainer)
  .use(ElHeader)
  .use(ElFooter)
  .use(ElAside)
  .use(ElMain)
  .use(ElIcon)
  .use(ElButton)
  .use(ElLink)
  .use(ElRadio)
  .use(ElRadioButton)
  .use(ElRadioGroup)
  .use(ElCheckbox)
  .use(ElCheckboxButton)
  .use(ElCheckboxGroup)
  .use(ElInput)
  .use(ElInputNumber)
  .use(ElSelect)
  .use(ElOption)
  .use(ElOptionGroup)
  .use(ElCascader)
  .use(ElCascaderPanel)
  .use(ElSwitch)
  .use(ElSlider)
  .use(ElTimePicker)
  .use(ElTimeSelect)
  .use(ElDatePicker)
  .use(ElUpload)
  .use(ElRate)
  .use(ElColorPicker)
  .use(ElTransfer)
  .use(ElForm)
  .use(ElFormItem)
  .use(ElTag)
  .use(ElProgress)
  .use(ElTree)
  .use(ElPagination)
  .use(ElBadge)
  .use(ElAvatar)
  .use(ElAlert)
  .use(ElLoading)
  .use(ElMenu)
  .use(ElMenuItem)
  .use(ElSubmenu)
  .use(ElMenuItemGroup)
  .use(ElTabs)
  .use(ElTabPane)
  .use(ElBreadcrumb)
  .use(ElBreadcrumbItem)
  .use(ElPageHeader)
  .use(ElDropdown)
  .use(ElDropdownItem)
  .use(ElDropdownMenu)
  .use(ElSteps)
  .use(ElStep)
  .use(ElDialog)
  .use(ElTooltip)
  .use(ElPopover)
  .use(ElPopconfirm)
  .use(ElCard)
  .use(ElCarousel)
  .use(ElCarouselItem)
  .use(ElCollapse)
  .use(ElCollapseItem)
  .use(ElTimeline)
  .use(ElTimelineItem)
  .use(ElDivider)
  .use(ElCalendar)
  .use(ElImage)
  .use(ElBacktop)
  .use(ElInfiniteScroll)
  .use(ElDrawer)
  .use(ElScrollbar)
```

### 全局配置

在引入 Element3 时，可以传入一个全局配置对象。该对象目前支持 `size` 与 `zIndex` 字段。`size` 用于改变组件的默认尺寸，`zIndex` 设置弹框的初始 z-index（默认值：2000）。按照引入 Element3 的方式，具体操作如下：

完整引入 Element3：

```js
import { createApp } from 'vue'
import App from './App.vue'
import Element3 from 'element3'

createApp(App).use(Element3, { size: 'small', zIndex: 3000 }).mount('#app')
```

按需引入 Element3：

使用 setupGlobalOptions 设置全局配置对象

```js
import { createApp } from 'vue'
import App from './App.vue'
import { ElButton, setupGlobalOptions } from 'element3'

createApp(App)
  .use(setupGlobalOptions({ size: 'small', zIndex: 3000 }))
  .use(ElButton)
  .mount('#app')
```

按照以上设置，项目中所有拥有 `size` 属性的组件的默认尺寸均为 'small'，弹框的初始 z-index 为 3000。

### 开始使用

至此，一个基于 Vue 和 Element 的开发环境已经搭建完毕，现在就可以编写代码了。各个组件的使用方法请参阅它们各自的文档。

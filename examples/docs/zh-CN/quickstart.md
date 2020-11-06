## 快速上手

本节将介绍如何在项目中使用 Element3。

### 引入 Element3

你可以引入整个 Element3，或是根据需要仅引入部分组件。我们先介绍如何引入完整的 Element3。

#### 完整引入

在 main.js 中写入以下内容：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import "element3/lib/theme-chalk/index.css";
import Element3 from 'element3'

createApp(App)
  .use(Element3)
  .mount("#app")
```

以上代码便完成了 Element3 的引入。需要注意的是，样式文件需要单独引入。

#### 按需引入

借助 [babel-plugin-component](https://github.com/QingWei-Li/babel-plugin-component)，我们可以只引入需要的组件，以达到减小项目体积的目的。

首先，安装 babel-plugin-component：

```bash
npm install babel-plugin-component -D
```

然后，将 .babelrc 修改为：

```json
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

接下来，如果你只希望引入部分组件，比如 Button 和 Select，那么需要在 main.js 中写入以下内容：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import "element3/lib/theme-chalk/index.css";
import {
  ElLink,
  ElButton
  // ...
} from 'element3'

createApp(App)
  .use(ElLink)
  .use(ElButton)
```

完整组件列表和引入方式（完整组件列表以 [components.json](https://github.com/ElemeFE/element/blob/master/components.json) 为准）

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Tree,
  Alert,
  Slider,
  Icon,
  Row,
  Col,
  Upload,
  Progress,
  Spinner,
  Badge,
  Card,
  Rate,
  Steps,
  Step,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Cascader,
  ColorPicker,
  Transfer,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Timeline,
  TimelineItem,
  Link,
  Divider,
  Image,
  Calendar,
  Backtop,
  PageHeader,
  CascaderPanel,
  Loading,
  MessageBox,
  Message,
  Notification
} from 'element3';

createApp(App)
  .use(Pagination)
  .use(Dialog)
  .use(Autocomplete)
  .use(Dropdown)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(MenuItemGroup)
  .use(Input)
  .use(InputNumber)
  .use(Radio)
  .use(RadioGroup)
  .use(RadioButton)
  .use(Checkbox)
  .use(CheckboxButton)
  .use(CheckboxGroup)
  .use(Switch)
  .use(Select)
  .use(Option)
  .use(OptionGroup)
  .use(Button)
  .use(ButtonGroup)
  .use(Table)
  .use(TableColumn)
  .use(DatePicker)
  .use(TimeSelect)
  .use(TimePicker)
  .use(Popover)
  .use(Tooltip)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Form)
  .use(FormItem)
  .use(Tabs)
  .use(TabPane)
  .use(Tag)
  .use(Tree)
  .use(Alert)
  .use(Slider)
  .use(Icon)
  .use(Row)
  .use(Col)
  .use(Upload)
  .use(Progress)
  .use(Spinner)
  .use(Badge)
  .use(Card)
  .use(Rate)
  .use(Steps)
  .use(Step)
  .use(Carousel)
  .use(CarouselItem)
  .use(Collapse)
  .use(CollapseItem)
  .use(Cascader)
  .use(ColorPicker)
  .use(Transfer)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Footer)
  .use(Timeline)
  .use(TimelineItem)
  .use(Link)
  .use(Divider)
  .use(Image)
  .use(Calendar)
  .use(Backtop)
  .use(PageHeader)
  .use(CascaderPanel)
```

### 全局配置

在引入 Element3 时，可以传入一个全局配置对象。该对象目前支持 `size` 与 `zIndex` 字段。`size` 用于改变组件的默认尺寸，`zIndex` 设置弹框的初始 z-index（默认值：2000）。按照引入 Element3 的方式，具体操作如下：

完整引入 Element3：

```js
import {createApp} from 'vue';
import Element3 from 'element3';
import App from './App.vue'
createApp(App).use(Element3, { size: 'small', zIndex: 3000 });
```

按需引入 Element3：

```js
import {createApp} from 'vue';
import { Button,useELEMENT } from 'element3';
import App from './App.vue'

let ELEMENT = useElement()
ELEMENT = { size: 'small', zIndex: 3000 };
createApp(App).use(Button);
```

按照以上设置，项目中所有拥有 `size` 属性的组件的默认尺寸均为 'small'，弹框的初始 z-index 为 3000。

### 开始使用

至此，一个基于 Vue3 和 Element3 的开发环境已经搭建完毕，现在就可以编写代码了。各个组件的使用方法请参阅它们各自的文档。


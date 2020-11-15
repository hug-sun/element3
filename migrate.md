## 迁移进度跟踪

跟踪当前组件迁移的进度

### 跑通所有组件

当前优先级最高任务，先让组件在 vue3 坏境下跑通

#### 重构步骤

在做组件逻辑升级时要遵循的步骤

1. 使用 [VTU](https://github.com/vuejs/vue-test-utils-next) 给要重构的组件添加测试
   - 新的组件测试需要放置到 test/unit/tests 内
   - 可通过 yarn test:unit 执行测试
2.  使用 composition api 重构组件逻辑

#### status 状态图标

- ❌ - 还没处理
- ⚰️ - 可以跑通 (使用 VTU 改写组件原有测试逻辑，并且可以在 dev 坏境下跑通组件原有逻辑)
- ✅ - 重构完成 (使用 composition api 完成重构其逻辑)

### 进度表

|           component           | status |              notes               |
| :---------------------------: | :----: | :------------------------------: |
|          Layout 布局          |   ✅   |                无                |
|      Container 布局容器       |   ✅   |                无                |
|          Color 色彩           |   ✅   |                无                |
|        Typography 字体        |   ✅   |                无                |
|          Border 边框          |   ✅   |                无                |
|           Icon 图标           |   ✅   |                无                |
|            Button             |   ✅   | 修改 From 组件时需要处理一些逻辑 |
|             Link              |   ✅   |                无                |
|         Radio 单选框          |   ✅   | 修改 From 组件时需要处理一些逻辑 |
|        Checkbox 多选框        |   ✅   |  修改 From 组件时需要处理一些逻辑 |
|         Input 输入框          |   ✅   |                无                |
|      InputNumber 计数器       |   ✅   |        功能完成，没写完全测试                 |
|         Select 选择器         |   ❌   |                无                |
|      Cascader 级联选择器      |   ❌   |                无                |
|          Switch 开关          |   ✅   |                无                |
|          Slider 滑块          |   ✅   |                无                |
|     TimePicker 时间选择器     |   ✅   |                无                |
|     DatePicker 日期选择器     |   ✅   |                无                |
| DateTimePicker 日期时间选择器 |   ❌   |                无                |
|          Upload 上传          |   ❌   |                无                |
|           Rate 评分           |   ✅   |                修改 From 组件时需要处理一些逻辑                |
|    ColorPicker 颜色选择器     |   ✅   |                                  |
|        Transfer 穿梭框        |   ✅   |                                  |
|           Form 表单           |   ✅   |                                  |
|          Table 表格           |   ❌   |                                  |
|           Tag 标签            |   ✅   |                                  |
|        Progress 进度条        |   ✅   |                                  |
|         Tree 树形控件         |   ❌   |                                  |
|        Pagination 分页        |   ✅   |                                  |
|          Badge 标记           |   ✅   | 无 |
|          Avatar 头像          |   ✅   |                                  |
|          Alert 警告           |   ✅   |                                  |
|         Loading 加载          |   ✅   |                                  |
|       Message 消息提示        |   ✅   |              功能完成             |
|        MessageBox 弹框        |   ✅   |                                  |
|       Notification 通知       |   ✅   |          功能完成，没写测试           |
|       NavMenu 导航菜单        |   ❌   |                                  |
|          Tabs 标签页          |   ✅   |                                  |
|       Breadcrumb 面包屑       |   ✅   |                                  |
|        PageHeader 页头        |   ✅   |                                  |
|       Dropdown 下拉菜单       |   ✅   |                                  |
|         Steps 步骤条          |   ✅   |                                  |
|         Dialog 对话框         |   ✅   |                                  |
|       Tooltip 文字提示        |   ✅   |                                  |
|        Popover 弹出框         |   ✅   |                                  |
|     Popconfirm 气泡确认框     |   ✅   |                                  |
|           Card 卡片           |   ✅   |                                  |
|        Carousel 走马灯        |   ✅   |                                  |
|       Collapse 折叠面板       |   ❌   |                                  |
|        Timeline 时间线        |   ❌   |                                  |
|        Divider 分割线         |   ✅   |  功能完成，没写测试
|         Calendar 日历         |   ❌   |                                  |
|          Image 图片           |   ❌   |                                  |
|       Backtop 回到顶部        |   ❌   |                                  |
|    InfiniteScroll 无限滚动    |   ❌   |                                  |
|          Drawer 抽屉          |   ❌   |                                  |
|          Layout 布局          |   ❌   |                                  |

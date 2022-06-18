# component组件 开发介绍

开发组件的步骤，我会在 [issue](https://github.com/hug-sun/element3/issues?q=is%3Aopen+is%3Aissue+label%3Afeat) 发布任务, 比如搞一个button组件

task 拆分成单元测试=> .vue开发 => tdd搞定

## 1. 组件文件

`src/components/button`文件夹， 内部的Button.vue 使用`script setup`+`ts`+`scss`

defineProps定义props类型 (无需import) ,withDefaults设置默认值
```js
interface ButtonProps {
  size?: ButtonSize
  type?: ButtonType
  nativeType?: ButtonNativeType
  plain?: boolean
  round?: boolean
  circle?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button',
})

```

## 2. 组件入口 

`src/components/ts` 设置组件安装

```ts
import ElButton from './Button.vue'

ElButton.install = function (app) {
  app.component('ElButton', ElButton)
}

export { ElButton }
```

然后在src/index.ts内部负责element3全部组件的安装，作为统一入口
```
import { ElDivider } from './components/divider/'

const components = [
  ElButton,
  ElDivider,
]
function install(app) {
  components.forEach((component) => {
    app.use(component)
  })
}
const element3 = {
  install,
}

export {
  ElButton,
}
export default element3

```


## 3. 组件测试
测试算是组件库开发和业务开发最重要的区别了， 测试是重中之重, 并且要先写测试，在写.vue功能

测试基于vitest,`describe`测试分子，`it`具体的测试，`expect`期望值, `toBe`,`toEual`,`toHaveClass`等判断值

测试vue组件，用`@vue/test-utils`,`@testing-library/vue`都可以，都是vue官网推荐的渲染测试库

```ts
import { mount } from '@vue/test-utils'
import Divider from '../Divider.vue'
describe('Divider.vue', () => {
  it('content', () => {
    const vm = mount(Divider, {
      slots: {
        default: () => 'Im perfect divider!',
      },
    })

    expect(vm.text()).toBe('Im perfect divider!')
  })

  it('direction', () => {
    const vm = mount(Divider, {
      props: { direction: 'vertical' },
    })

    expect(vm.classes()).toContain('el-divider--vertical')
  })
})
```

```ts

describe('Button.vue', () => {
  it('should show content', () => {
    const content = 'foo'

    const { getByText } = render(Button, {
      slots: {
        default: content,
      },
    })
    expect(getByText('foo')).toBeInTheDocument()
  })

  it('button type', () => {
    const Comp = {
      template: '<Button type="primary"></Button>',
      components: {
        Button,
      },
    }

    const { getByRole } = render(Comp)
    expect(getByRole('button')).toHaveClass('el-button--primary')
  })

})
```

## 4. 组件文档

`src/components/button/index.md`负责文档, 暂定使用`:::demo`语法渲染组件代码

@next 后续会自己实现demo的插件渲染
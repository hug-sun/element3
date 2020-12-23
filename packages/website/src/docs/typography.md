<script>
  import bus from '../bus';
  import { reactive, toRefs, ref, getCurrentInstance, onMounted, watch } from 'vue'
  export default {
    setup(){
      const original=reactive({
         'font_size_extra_large': '20px',
         'font_size_large': '18px',
         'font_size_medium': '16px',
         'font_size_base': '14px',
         'font_size_small': '13px',
         'font_size_extra_small': '12px'
      })
      const varMap=[
         '$--font-size-extra-large',
         '$--font-size-large',
         '$--font-size-medium',
         '$--font-size-base',
         '$--font-size-small',
        '$--font-size-extra-small'
      ]
      const global=reactive({})
      const font_size_extra_large=ref
      ('')
      const font_size_large=ref('')
      const font_size_medium=ref('')
      const font_size_base=ref('')
      const font_size_small=ref('')
      const font_size_extra_small=ref('')

      const tintColor=(color, tint)=>{
        return tintColor(color, tint)
      }

      const setGlobal=()=>{
        if (window.userThemeConfig) {
          self.global = window.userThemeConfig.global;
        }
      }

      onMounted(()=>{
        setGlobal()
      })

      watch(global, value =>{
          varMap.forEach((v) => {
            const key = v.replace('$--', '').replace(/-/g, '_')
            if (value[v]) {
              self[key] = value[v]
            } else {
              self[key] = original[key]
            }
          });
      },{
        immediate: true,
      }
      )
  return{
    ...toRefs(global),
    font_size_extra_large,
    font_size_large,
    font_size_medium,
    font_size_base,
    font_size_small,
    font_size_extra_small,
    tintColor,
    setGlobal,
    varMap,
    ...toRefs(original)
  }
}}
</script>

## Typography 字体

我们对字体进行统一规范，力求在各个操作系统下都有最佳展示效果。

### 字体

<div class="demo-term-box">
<img src="../assets/images/term-pingfang.png" alt="">
<img src="../assets/images/term-hiragino.png" alt="">
<img src="../assets/images/term-microsoft.png" alt="">
<img src="../assets/images/term-sf.png" alt="">
<img src="../assets/images/term-helvetica.png" alt="">
<img src="../assets/images/term-arial.png" alt="">
</div>

### 字号

<table class="demo-typo-size">
  <tbody>
  <tr
    >
      <td>层级</td>
      <td>字体大小</td>
      <td class="color-dark-light">举例</td>
    </tr>
    <tr
    :style="{ fontSize: font_size_extra_small }"
    >
      <td>辅助文字</td>
      <td class="color-dark-light">{{font_size_extra_small}} Extra Small</td>
      <td>用 Element3 快速搭建页面</td>
    </tr>
    <tr
    :style="{ fontSize: font_size_small }"
    >
      <td>正文（小）</td>
      <td class="color-dark-light">{{font_size_small}} Small</td>
      <td>用 Element3 快速搭建页面</td>
    </tr>
    <tr
    :style="{ fontSize: font_size_base }"
    >
      <td>正文</td>
      <td class="color-dark-light">{{font_size_base}} Base</td>
      <td>用 Element3 快速搭建页面</td>
    </tr>
    <tr
    :style="{ fontSize: font_size_medium }"
    >
      <td>小标题</td>
      <td class="color-dark-light">{{font_size_medium}} Medium</td>
      <td>用 Element3 快速搭建页面</td>
    </tr>
    <tr
    :style="{ fontSize: font_size_large }"
    >
      <td>标题</td>
      <td class="color-dark-light">{{font_size_large}} large</td>
      <td>用 Element3 快速搭建页面</td>
    </tr>
    <tr
    :style="{ fontSize: font_size_extra_large }"
    >
      <td>主标题</td>
      <td class="color-dark-light">{{font_size_extra_large}} Extra large</td>
      <td>用 Element3 快速搭建页面</td>
    </tr>
  </tbody>
</table>

### 行高

<div>
<img class="lineH-left" src="../assets/images/typography.png" />
<ul class="lineH-right">
<li>line-height:1 <span>无行高</span></li>
<li>line-height:1.3 <span>紧凑</span></li>
<li>line-height:1.5 <span>常规</span></li>
<li>line-height:1.7 <span>宽松</span></li>
</ul>
</div>

### Font-family 代码

```css
font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
```

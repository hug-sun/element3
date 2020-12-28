<script>
  import bus from '../bus';
  import { reactive, toRefs, ref, getCurrentInstance, onMounted, watch } from 'vue'
  export default {
    setup(){
    const varMap = reactive({
      'box-shadow-light': 'boxShadowLight',
      'box-shadow-base': 'boxShadowBase',
      'border-radius-base': 'borderRadiusBase',
      'border-radius-small': 'borderRadiusSmall'
    });
  const original = reactive({
    boxShadowLight: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
    boxShadowBase: '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)',
    borderRadiusBase: '4px',
    borderRadiusSmall: '2px'
  })
  const global = reactive({})
  const boxShadowLight = ref('')
  const boxShadowBase = ref('')
  const borderRadiusBase = ref('')
  const borderRadiusSmall =ref('')
  const self = getCurrentInstance().proxy;

  const setGlobal=()=>{
    if(window.userThemeConfig){
      self.global = window.userThemeConfig.global;
    }
  }

  onMounted(()=>{
    self.setGlobal()
  })

  watch(global, value =>{
      Object.keys(varMap).forEach((c)=>{
          if (value[c]) {
            self[varMap[c]] = value[c]
          }else{
            self[varMap[c]] = original[varMap[c]]
          }  
      });
    },
    {
      immediate: true
    }
  )
  return {
    ...toRefs(global),
    boxShadowLight,
    boxShadowBase,
    borderRadiusBase,
    borderRadiusSmall,
    setGlobal,
    ...toRefs(varMap),
    ...toRefs(original)
  }
 }  
}
</script>

## Border 边框

我们对边框进行统一规范，可用于按钮、卡片、弹窗等组件里。

### 边框

我们提供了以下几种边框样式，以供选择。

<table class="demo-border">
  <tbody>
    <tr>
      <td class="text">名称</td>
      <td class="text">粗细</td>
      <td class="line">举例</td>
    </tr>
    <tr>
      <td class="text">实线</td>
      <td class="text">1px</td>
      <td class="line">
        <div></div>
      </td>
    </tr>
    <tr>
      <td class="text">虚线</td>
      <td class="text">2px</td>
      <td class="line">
        <div class="dashed"></div>
      </td>
    </tr>
  </tbody>
</table>

### 圆角

我们提供了以下几种圆角样式，以供选择。

<el-row :gutter="12" class="demo-radius">
  <el-col :span="6" :xs="{span: 12}">
    <div class="title">无圆角</div>
    <div class="value">border-radius: 0px</div>
    <div class="radius"></div>
  </el-col>
  <el-col :span="6" :xs="{span: 12}">
    <div class="title">小圆角</div>
    <div class="value">border-radius: {{borderRadiusSmall}}</div>
    <div 
      class="radius" 
      :style="{ borderRadius: borderRadiusSmall }"
    ></div>
  </el-col>
  <el-col :span="6" :xs="{span: 12}">
    <div class="title">大圆角</div>
    <div class="value">border-radius: {{borderRadiusBase}}</div>
    <div 
      class="radius"
      :style="{ borderRadius: borderRadiusBase }"
    ></div>
  </el-col>
  <el-col :span="6" :xs="{span: 12}">
    <div class="title">圆形圆角</div>
    <div class="value">border-radius: 30px</div>
    <div class="radius radius-30"></div>
  </el-col>
</el-row>

### 投影

我们提供了以下几种投影样式，以供选择。

<div 
class="demo-shadow"
:style="{ boxShadow: boxShadowBase }"
></div>
<span class="demo-shadow-text">基础投影 box-shadow: {{boxShadowBase}}</span>

<div 
class="demo-shadow"
:style="{ boxShadow: boxShadowLight }"
></div>
<span class="demo-shadow-text">浅色投影 box-shadow: {{boxShadowLight}}</span>

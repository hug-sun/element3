<template>
  <el-radio-group v-model="direction">
    <el-radio label="ltr">从左往右开</el-radio>
    <el-radio label="rtl">从右往左开</el-radio>
    <el-radio label="ttb">从上往下开</el-radio>
    <el-radio label="btt">从下往上开</el-radio>
  </el-radio-group>

  <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">点我打开</el-button>

  <el-drawer
    title="我是标题"
    v-model:visible="drawer"
    :direction="direction"
    :before-close="handleClose"
  >
    <span>我来啦!</span>
  </el-drawer>
</template>

<script>
export default {
	data() {
		return {
			drawer: false,
			direction: 'rtl'
		}
	},
	methods: {
		handleClose(done) {
			done()
		}
	}
}
</script>

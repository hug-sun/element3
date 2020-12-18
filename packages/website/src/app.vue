<template>
  <div id="app" :class="{ 'is-component': isComponent }">
    <main-header v-if="lang !== 'play'"></main-header>
    <div class="main-cnt">
      <router-view></router-view>
    </div>
    <!-- <main-footer v-if="lang !== 'play' && !isComponent"></main-footer> -->
  </div>
</template>

<script>
import { use } from './locale'
import zhLocale from './locale/lang/zh-CN'
import enLocale from './locale/lang/en'
import esLocale from './locale/lang/es'
import frLocale from './locale/lang/fr'

const lang = location.hash.replace('#', '').split('/')[1] || 'zh-CN'
const localize = (lang) => {
  switch (lang) {
    case 'zh-CN':
      use(zhLocale)
      break
    case 'es':
      use(esLocale)
      break
    case 'fr-FR':
      use(frLocale)
      break
    default:
      use(enLocale)
  }
}
localize(lang)

export default {
  name: 'app',

  computed: {
    lang() {
      return this.$route.path.split('/')[1] || 'zh-CN'
    },
    isComponent() {
      return /^component-/.test(this.$route.name || '')
    }
  },

  watch: {
    lang(val) {
      if (val === 'zh-CN') {
        this.suggestJump()
      }
      localize(val)
    }
  },

  methods: {
    suggestJump() {
      if (process.env.NODE_ENV !== 'production') return

      const href = location.href
      const preferGithub = localStorage.getItem('PREFER_GITHUB')
      const cnHref =
        href.indexOf('eleme.cn') > -1 ||
        href.indexOf('element-cn') > -1 ||
        href.indexOf('element.faas') > -1
      if (cnHref || preferGithub) return
    }
  },

  mounted() {
    localize(this.lang)
    if (this.lang === 'zh-CN') {
      this.suggestJump()
    }
  }
}
</script>

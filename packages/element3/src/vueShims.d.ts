declare module '*.vue' {
  // TODO: Figure out the typing for this
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

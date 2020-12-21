/// <reference types="jest" />

declare namespace jest {
  interface Matchers<R, T> {
    /**
     * @description
     * Check whether the given wrapper has certain classes within its `class` attribute.
     *
     * You must provide at least one class
     * @example
     * 
     * Button.vue
     * <template>
     *   <button class="el-button--small">
     *   </button>
     * </template>
     * 
     * const wrapper = mount(Button)       
     * 
     * expect(wrapper).toHaveClass(`el-button--small`)
     * expect(deleteButton).not.toHaveClass(`el-button--foo`)
     */
    toHaveClass(className: string): R
  }
}

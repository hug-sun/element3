import Button from "../../../packages/button/src/button.vue";
import { mount } from "@vue/test-utils";
describe("Button.vue", () => {
  it("should return 2 ", () => {
    const wrapper = mount(Button);
    console.log(wrapper);
  });
});

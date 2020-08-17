import Progress from "../Progress.vue";
import { mount } from "@vue/test-utils";

describe("Progress.vue", () => {
  describe("props", () => {
    it("percentage", () => {
      const wrapper = mount(Progress, {
        props: {
          percentage: 50,
        },
      });
      expect(wrapper.find(".el-progress__text").text()).toContain("50%");
      expect(
        wrapper.find(".el-progress-bar__inner").attributes().style
      ).toContain("50%");
    });

    it("type", () => {
      const wrapper_line = mount(Progress, {
        props: {
          type: "line",
        },
      });
      const wrapper_circle = mount(Progress, {
        props: {
          type: "circle",
        },
      });
      const wrapper_dashboard = mount(Progress, {
        props: {
          type: "dashboard",
        },
      });
      expect(wrapper_line.classes()).toContain("el-progress--line");
      expect(wrapper_circle.classes()).toContain("el-progress--circle");
      expect(wrapper_dashboard.classes()).toContain("el-progress--dashboard");
    });

    it("strokeWidth", () => {
      const wrapper = mount(Progress, {
        props: {
          strokeWidth: 10,
        },
      });
      expect(
        wrapper.find(".el-progress-bar__outer").attributes().style
      ).toContain("10px");
    });

    it("textInside", () => {
      const wrapper = mount(Progress, {
        props: {
          textInside: true,
        },
      });
      expect(wrapper.classes()).toContain("el-progress--text-inside");
    });

    it("status", () => {
      const wrapper_success = mount(Progress, {
        props: {
          status: "success",
        },
      });
      const wrapper_exception = mount(Progress, {
        props: {
          status: "exception",
        },
      });
      const wrapper_warning = mount(Progress, {
        props: {
          status: "warning",
        },
      });
      expect(wrapper_success.classes()).toContain("is-success");
      expect(wrapper_exception.classes()).toContain("is-exception");
      expect(wrapper_warning.classes()).toContain("is-warning");
    });

    it("color", () => {
      const wrapper_string = mount(Progress, {
        props: {
          color: "rgb(0, 0, 0)",
        },
      });
      const wrapper_function = mount(Progress, {
        props: {
          color: () => {
            return "#13ce66";
          },
        },
      });
      expect(
        wrapper_string.find(".el-progress-bar__inner").attributes().style
      ).toContain("rgb(0, 0, 0)");
      expect(
        wrapper_function.find(".el-progress-bar__inner").attributes().style
      ).toContain("rgb(19, 206, 102)");
    });

    it("width", () => {
      const wrapper = mount(Progress, {
        props: {
          type: "circle",
          width: 100,
        },
      });
      expect(wrapper.find(".el-progress-circle").attributes().style).toContain(
        "100px"
      );
    });

    it("showText", () => {
      const wrapper = mount(Progress, {
        props: {
          showText: false,
        },
      });
      expect(wrapper.classes()).toContain("el-progress--without-text");
    });
  });
});

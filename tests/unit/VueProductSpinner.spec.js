import { shallowMount } from "@vue/test-utils";
import VueProductSpinner from "@/components/VueProductSpinner.vue";

describe("VueProductSpinner", () => {
  const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];

  it("should mount the component", () => {
    const wrapper = shallowMount(VueProductSpinner, {
      props: { images }
    });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should initialize with the correct values", () => {
    const wrapper = shallowMount(VueProductSpinner, {
      props: { images }
    });

    expect(wrapper.vm.spinner.current).toBe(0);
    expect(wrapper.vm.spinner.size).toBe(0);
    expect(wrapper.vm.spinner.currentPath).toBeNull();
  });

  it("should handle mouse down and up", async () => {
    const wrapper = shallowMount(VueProductSpinner, {
      props: { images }
    });

    await wrapper.trigger("mousedown");
    expect(wrapper.vm.mouse.isDragging).toBe(true);
    expect(wrapper.vm.mouse.isMoving).toBe(true);

    await wrapper.trigger("mouseup");
    expect(wrapper.vm.mouse.isMoving).toBe(false);
  });

  it("should handle touch start and end", async () => {
    const wrapper = shallowMount(VueProductSpinner, {
      props: { images }
    });

    await wrapper.trigger("touchstart", {
      touches: [{ pageX: 10 }],
      preventDefault: () => {},
    });
    expect(wrapper.vm.touch.isDragging).toBe(true);
    expect(wrapper.vm.touch.isMoving).toBe(true);

    await wrapper.trigger("touchend");
    expect(wrapper.vm.touch.isMoving).toBe(false);
  });
});

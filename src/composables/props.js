// In composables/props.js
import { reactive, toRefs } from 'vue'

export function useProps() {
  const production = window.location.hostname !== "localhost";

  const images = () =>
    [...Array(71)].map((_img, i) => `${production ? "/vue-product-spinner" : ""}/imgs/shoe/UnderArmour-${i + 1}.jpg`);

  const props = reactive({
     slider: true,
     infinite: true,
     mouseWheel: true,
     animation: false,
     shoeImages: images(),
  });

  // Ensure reactivity when destructuring
  return toRefs(props);
}


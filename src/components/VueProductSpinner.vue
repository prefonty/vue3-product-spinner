<template>
  <picture class="vue-product-spinner" ref="componentContainer">
    <template v-if="imagesPreloaded">
      <img
        tabindex="1"
        draggable="false"
        :src="spinner.currentPath"
        @keydown="handleKeydown"
        @mouseup="handleMouseUp"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
        @touchmove="handleTouchMove"
      />
      <input
        type="range"
        tabindex="1"
        min="1"
        :max="spinner.size"
        :value="spinner.current"
        class="vue-product-spinner-slider"
        :class="props.sliderClass"
        @input="handleSlider"
        v-if="props.slider"
      />
    </template>
    <slot v-else>Loading images...</slot>
  </picture>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, reactive, defineProps  } from 'vue';
  import PreloadImages from "../PreloadImages.js";

  const props = defineProps({
    images: {
      type: Array,
      required: true,
      default: () => [],
    },
    infinite: {
      type: Boolean,
      required: false,
      default: true,
    },
    speed: {
      type: Number,
      required: false,
      default: 3,
    },
    mouseWheel: {
      type: Boolean,
      required: false,
      default: false,
    },
    slider: {
      type: Boolean,
      required: false,
      default: false,
    },
    sliderClass: {
      type: String,
      required: false,
      default: "",
    },
    animation: {
      type: Boolean,
      required: false,
      default: false,
    },
  });

  const imagesPreloaded = ref(false);
  const speedController = ref(0);
  const spinner = reactive({
    current: 0,
    size: 0,
    currentPath: null,
  });

  const mouse = reactive({
    isMoving: false,
    isDragging: false,
  });
  const touch = reactive({
    isMoving: false,
    initialX: 0,
    isDragging: false,
  });
  const animationRequestID = ref(0);
  const lastPosition = ref(0);
  const componentContainer = ref(null);

  const handleMouseDragging = () => { mouse.isDragging = false; }
  const handleTouchDragging = () => { touch.isDragging = false; }

  const handleWheel = (event) => {
    if (props.mouseWheel) {
      event.preventDefault();
      handleMovement(event.deltaY);
    }
  }

  const initSpinner = () => {
    spinner.size = props.images.length;
    if (props.animation) {
      spinImages(0, spinner.size);
    } else {
      spinner.currentPath = props.images[0];
    }
  }

  const handlePreload = async () => {
    if (Array.isArray(props.images) && props.images.length > 0) {
      await PreloadImages(props.images)
        .then(() => {
          imagesPreloaded.value = true;
        })
        .catch(error => {
          console.error('Error preloading images:', error);
        });
    }
  }

  onMounted(async () => {
    if (Array.isArray(props.images) && props.images.length > 0) {
      imagesPreloaded.value = false;
      await handlePreload();
      initSpinner();
    }

    window.addEventListener('mouseup', handleMouseDragging);
    window.addEventListener('touchend', handleTouchDragging);

    if (props.mouseWheel && componentContainer.value) {
      componentContainer.value.addEventListener('wheel', handleWheel, false);
    }
  });

  onUnmounted(() => {
    if (props.mouseWheel && componentContainer.value) {
      componentContainer.value.removeEventListener('wheel', handleWheel);
    }
    window.removeEventListener('mouseup', handleMouseDragging);
    window.removeEventListener('touchend', handleTouchDragging);
  });

  const handleKeydown = (event) => {
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;
    if (event.keyCode === RIGHT_ARROW) {
      event.preventDefault();
      handleMovement(lastPosition.value + 1);
    }
    if (event.keyCode === LEFT_ARROW) {
      event.preventDefault();
      handleMovement(lastPosition.value - 1);
    }
  }

  const handleSlider = (event) => {
    spinner.current = Number(event.target.value);
    spinner.currentPath = props.images[event.target.value - 1];
  }

  const handleMouseDown = () => {
    if (props.animation) {
      stopAnimation();
    }
    mouse.isDragging = true;
    mouse.isMoving = true;
  }

  const handleMouseUp = () => {
    mouse.isMoving = false;
  }

  const handleMouseMove = (event) => {
    if (mouse.isMoving && mouse.isDragging) {
      handleMovement(event.pageX);
    }
  }

  const handleTouchStart = (event) => {
    event.preventDefault();
    if (props.animation) {
      stopAnimation();
    }
    touch.isMoving = true;
    touch.isDragging = true;
    touch.initialX = event.touches[0].pageX;
  }

  const handleTouchEnd = () => {
    touch.isMoving = false;
  }

  const handleTouchMove = (event) => {
    if (touch.isDragging) {
      const delta = -(touch.initialX - event.touches[0].pageX);
      handleMovement(delta);
    }
  }

  const spinImages = (index, lastIndex) => {
    let i = index;
    if (i !== lastIndex) {
      spinner.currentPath = props.images[i];
      animationRequestID.value = window.requestAnimationFrame(() => spinImages(i, lastIndex));
    } else {
      stopAnimation();
      [spinner.currentPath] = props.images;
      return;
    }
    i += 1;
  }

  const stopAnimation = () => {
    if (animationRequestID.value) {
      window.cancelAnimationFrame(animationRequestID.value);
      animationRequestID.value = null;
    }
  }

  const handleMovement = (delta) => {
    speedController.value += 1;
    if (speedController.value < props.speed) {
      return;
    }
    if (speedController.value > props.speed) {
      speedController.value = 0;
    }
    if (delta > lastPosition.value) {
      if (spinner.current >= 0 && spinner.current < spinner.size && props.images.length > 0) {
        spinner.current += 1;
        spinner.currentPath = props.images[spinner.current - 1];
      } else if (props.infinite && props.images.length > 0) {
        spinner.current = 1;
        spinner.currentPath = props.images[spinner.current - 1];
      }
    } else if (delta < lastPosition.value) {
      if (spinner.current >= 0 && spinner.current - 1 > 0 && props.images.length > 0) {
        spinner.current -= 1;
        spinner.currentPath = props.images[spinner.current - 1];
      } else if (props.infinite && props.images.length > 0) {
        spinner.current = spinner.size;
        spinner.currentPath = props.images[spinner.current - 1];
      }
    }
    lastPosition.value = delta;
  }
</script>

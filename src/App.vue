<template>
  <div id="app">
    <div class="demo">
      <VueProductSpinner
          :images="shoeImages"
          :slider="slider"
          :infinite="infinite"
          :mouseWheel="mouseWheel"
          :animation="animation"
          sliderClass="demo-slider"
      >
        <PulseLoader color="#3f51b5"/>
      </VueProductSpinner>
    </div>
  </div>
</template>


<script setup>
import { useProps } from './composables/props';
import VueProductSpinner from "./components/VueProductSpinner.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const {
  slider,
  infinite,
  mouseWheel,
  animation,
  shoeImages,
} = useProps();
</script>


<style>
body {
  margin: 0;
  font-family: sans-serif;
}

.vue-product-spinner img {
  width: 90%;
  margin-left: 5%;
}

.demo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.demo-slider {
  -webkit-appearance: none;
  width: 90%;
  height: 15px;
  margin-left: 5%;
  border-radius: 5px;
  background: #e8e8e8;
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.demo-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: royalblue;
  cursor: pointer;
}

.demo-slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: royalblue;
  cursor: pointer;
}
</style>

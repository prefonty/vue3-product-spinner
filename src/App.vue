<template>
  <div id="app">
    <TheRibbon/>
    <DemoCommands :onNewCommand="handleCommands"/>
    <div class="demo demo-2">
      <VueProductSpinner
          :images="props.shoeImages"
          :slider="props.slider"
          :infinite="props.infinite"
          :mouseWheel="props.mouseWheel"
          :animation="props.animation"
          sliderClass="demo-slider"
      >
        <PulseLoader color="#3f51b5"/>
      </VueProductSpinner>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import VueProductSpinner from "./components/VueProductSpinner.vue";
import DemoCommands from "./components/DemoCommands.vue";
import TheRibbon from "./components/TheRibbon.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const production = window.location.hostname !== "localhost";

const shoe = () =>
    [...Array(71)].map(
        (_img, i) =>
            `${production ? "/vue-product-spinner" : ""}/imgs/shoe/UnderArmour-${i + 1}.jpg`
    );

let props = reactive({
    slider: true,
    infinite: true,
    mouseWheel: true,
    animation: true,
    shoeImages: shoe(),
    commands: null,
});

const handleCommands = (commands) => {
    props.commands = {...props.commands, ...commands};
}
</script>

<style lang="postcss">
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
</style>
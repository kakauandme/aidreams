<template>
  <canvas
    ref="canvas"
    :width="MAX_IMAGE_SIZE"
    :height="MAX_IMAGE_SIZE"
    v-show="!isLoading"
  ></canvas>
</template>
<style scoped>
canvas {
  width: 100%;
}
</style>
<script setup>
import { ref, computed, onMounted } from 'vue'

const canvas = ref()
const context = ref()
const image = new Image()

const MAX_IMAGE_SIZE = 1024

let size = 4

const isLoading = ref(true)

const props = defineProps({
  image_key: {
    type: String,
    required: true
  }
})

const fullUrl = computed(() => {
  return `r2/${props.image_key}`
})

onMounted(() => {
  context.value = canvas.value?.getContext('2d')
  setSmoothing(false)

  image.onload = () => {
    isLoading.value = false
    window.requestAnimationFrame(pixelate)
  }
  image.src = fullUrl.value
})
function rand(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function setSmoothing(value) {
  context.value.mozImageSmoothingEnabled = value
  context.value.webkitImageSmoothingEnabled = value
  context.value.imageSmoothingEnabled = value
}
function pixelate() {
  context.value.drawImage(image, 0, 0, size, size)
  context.value.drawImage(
    canvas.value,
    0,
    0,
    size,
    size,
    0,
    0,
    canvas.value.width,
    canvas.value.height
  )

  if (size >= MAX_IMAGE_SIZE) {
    setSmoothing(true)
    return
  }
  size *= 2
  setTimeout(
    () => {
      window.requestAnimationFrame(pixelate)
    },
    rand(100, 750)
  )
}
</script>

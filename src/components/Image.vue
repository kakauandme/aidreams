<template>
  <img :src="fullUrl" v-if="!isLoading" />
  <Loader v-else />
</template>
<style scoped>
img {
  width: 100%;
  height: auto;
  aspect-ratio: 1/1;
}
</style>
<script setup>
import { ref, computed, onMounted } from 'vue'
import Loader from './Loader.vue'
const isLoading = ref(true)

//add URL prop
const props = defineProps({
  image_key: {
    type: String
  }
})

const fullUrl = computed(() => {
  return `r2/${props.image_key}`
})

onMounted(() => {
  const image = new Image()
  image.onload = () => {
    isLoading.value = false
  }
  console.log(fullUrl.value)
  image.src = fullUrl.value
})
</script>

<template>
  <main>
    <section>
      <!-- <header></header> -->
      <Loader v-if="isLoading" />
      <Image :image_key="data.key" v-else />
    </section>
    <aside>
      <Label :title="title" :details="details" v-if="!isLoading" />
      <!-- <footer>©</footer> -->
    </aside>
  </main>
</template>
<script setup>
// import { RouterLink, RouterView } from 'vue-router'

import Image from '../components/Image.vue'
import Label from '../components/Label.vue'
import Loader from '../components/Loader.vue'

import { ref, computed, onMounted } from 'vue'

const isLoading = ref(true)

const data = ref({})

const title = computed(() => {
  const article = ['a', 'e', 'i', 'o', 'u'].includes(
    data.value.date_and_time.season[0].toLowerCase()
  )
    ? 'an'
    : 'a'

  return `${data.value.location.city} in ${data.value.weather.description} on ${article} ${data.value.date_and_time.season.toLowerCase()} ${data.value.date_and_time.time_of_day.toLowerCase()}`
})

const details = computed(() => {
  return `Location: ${data.value.location.latitude}, ${data.value.location.longitude}. Weather: ${data.value.weather.temperature}°${data.value.weather.symbol}, ${data.value.weather.description}. Time: ${data.value.date_and_time.time}, ${data.value.date_and_time.date}. Style: hand-drawn illustration. Model: Dall-E 3. Dimensions: 1024 pixels.`
})

function updateTags() {
  document.querySelector('link[rel="icon"]').href = data.value.weather.icon
  document.title = `${title.value} | AI dreams`
}

onMounted(async () => {
  if (!isLoading.value) return
  try {
    isLoading.value = true
    const response = await fetch('/init')

    const response_data = await response.json()

    // console.log(response_data)
    data.value = response_data
    updateTags()
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss">
@media (min-aspect-ratio: 4/3) {
  main {
    /* grid container settings */
    display: grid;
    grid-template-columns: 100vh auto;
  }
  section {
    height: 100vh;
    width: 100vh;
    //box-shadow: 0 0 1rem rgba(var(--vt-c-black), 0.1);
  }
  aside {
    transform: translateX(-1rem);
    padding: 1rem 0rem 1rem 3rem;

    box-shadow: -1rem 0 0.5rem rgba(var(--vt-c-black), 0.1);
  }
}

@media (max-aspect-ratio: 4/3) {
  aside {
    transform: translateY(-1rem);
    padding: 2rem 2rem 0;
    box-shadow: 0 -1rem 0.5rem rgba(var(--vt-c-black), 0.1);
  }
  section {
    width: 100%;
  }
}

section {
  aspect-ratio: 1/1;
  position: relative;
}
aside {
  display: flex; /* Uses flexbox */
  flex-direction: column; /* Stack children vertically */
  justify-content: center;
  border-radius: 1rem;
  background-color: rgba(var(--color-background), 1);
}
</style>

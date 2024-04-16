<template>
  <main>
    <section>
      <Image :image_key="data.key" v-if="!isLoading" />
      <Loader v-else />
      <!-- <header></header> -->
    </section>
    <aside>
      <article v-if="!isLoading">
        <typewriter>
          <p class="artist">
            <strong
              ><a href="https://twitter.com/KaKaUandME" target="_blank" title="Twitter"
                >Kirill Kliavin</a
              ></strong
            >
            (b. 1987)
          </p>
          <p class="title">
            <em>{{ title }},</em> c. {{ new Date().getFullYear() }}
          </p>
          <p>AI on a digital canvas</p>
          <p>
            <small
              >Location: {{ data.location.latitude }}, {{ data.location.longitude }}. Weather:
              {{ data.weather.temperature }}°{{ data.weather.symbol }},
              {{ data.weather.description }}. Time: {{ data.date_and_time.time }},
              {{ data.date_and_time.date }}. Style: hand-drawn illustration. Model: Dall-E 3.
              Dimensions: 1024 pixels.
            </small>
          </p>
        </typewriter>
      </article>
      <!-- <footer>©</footer> -->
    </aside>
  </main>
</template>
<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import Loader from '../components/Loader.vue'
import Image from '../components/Image.vue'

import { ref, computed } from 'vue'

const isLoading = ref(true)

const data = ref({})

const title = computed(() => {
  if (isLoading.value) return ''

  const article = ['a', 'e', 'i', 'o', 'u'].includes(
    data.value.date_and_time.season[0].toLowerCase()
  )
    ? 'an'
    : 'a'

  return `${data.value.location.city} in ${data.value.weather.description} on ${article} ${data.value.date_and_time.season.toLowerCase()} ${data.value.date_and_time.time_of_day.toLowerCase()}`
})

function updateTags() {
  document.querySelector('link[rel="icon"]').href = data.value.weather.icon
  document.title = `${title.value} | AI dreams`

  // var highResImage = new Image()
  // highResImage.onload = function () {
  //   isImageLoading.value = false
  // }
  // highResImage.src = `/r2/${data.value.key}`
}

async function init() {
  if (!isLoading.value) return
  try {
    isLoading.value = true
    const response = await fetch('/init')

    const response_data = await response.json()

    // console.log(response_data)
    data.value = response_data
    updateTags()
  } catch (e) {
    console.error('Error: ', e)
  } finally {
    isLoading.value = false
  }
}

init()
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
    box-shadow: 0 0 1rem rgba(var(--vt-c-black), 0.6);
  }
  aside {
    padding: 1rem 1rem 1rem 3rem;
  }
}

@media (max-aspect-ratio: 4/3) {
  aside {
    transform: translateY(-1rem);
    border-radius: 1rem;
    background-color: rgba(var(--color-background), 1);
    padding: 2rem 2rem 0;
    box-shadow: 0 -1rem 1rem rgba(var(--vt-c-black), 0.6);
  }
  section {
    width: 100%;
  }
}

aside {
  display: flex; /* Uses flexbox */
  flex-direction: column; /* Stack children vertically */
  justify-content: center;
  // user-select: none;
}
article {
  .artist {
    font-size: 1.5rem;
  }
  .title {
    font-size: 2rem;
  }
}
</style>

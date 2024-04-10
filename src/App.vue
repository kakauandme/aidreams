<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import Loader from './components/Loader.vue'

import { ref, computed } from 'vue'

const isLoading = ref(true)
const data = ref({})
// const unsplashPhoto = computed(() => {
//   return isLoading.value
//     ? null
//     : `url(https://source.unsplash.com/daily?${data.value.location.city}%20${data.value.location.country},${data.value.weather.name})`
// })

const bgImage = computed(() => {
  return isLoading.value ? null : `url("/r2/${data.value.image.key}")`
  //return isLoading.value ? null : `url(${data.value.image.url})`
})

const title = computed(() => {
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

<template>
  <section
    :style="{
      backgroundImage: bgImage
    }"
  >
    <header v-if="!isLoading">
      <p>{{ title }}.</p>
    </header>
    <main v-if="!isLoading">
      <h4>{{ data.location.city }}</h4>
      <p>{{ data.location.region }}, {{ data.location.country }}</p>
      <img class="icon" :src="data.weather.icon" alt="Weather icon" width="100" height="100" />
      <h1>{{ data.weather.temperature }}°{{ data.weather.symbol }}</h1>
      <p class="description">{{ data.weather.description }}</p>
    </main>
    <Loader v-else />
    <!-- <RouterView /> -->
    <footer>
      <p>
        Ai dreams by
        <a href="https://twitter.com/KaKaUandME" target="_blank" title="Twitter">@kakauandme</a> |
        Copyright {{ new Date().getFullYear() }} ©
      </p>
    </footer>
  </section>
</template>

<style lang="scss">
section {
  background-size: cover;
  background-position: center;
  height: 100vh;

  /* grid container settings */
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'header'
    'main'
    'footer';
}

section > * {
  padding: 1rem;
}

section > main {
  grid-area: main;
  overflow: auto;

  border-radius: 0.5rem;
  margin: auto;
  text-align: center;

  background: rgba(var(--color-background), 0.1);
  box-shadow: 0 0 2rem rgba(var(--color-text), 0.1);
  backdrop-filter: blur(0.1rem);
  border: 1px solid rgba(var(--color-background), 0);
  cursor: pointer;
  user-select: none;

  //color: rgba(var(--color-text), 0.25);

  // img {
  //   opacity: 0.25;
  // }

  &:hover {
    background: rgba(var(--color-background), 0.25);
    backdrop-filter: blur(0.25rem);
    color: rgba(var(--color-text), 0.9);
    border: 1px solid rgba(var(--color-background), 0.25);
    img {
      opacity: 0.9;
    }
  }
}

/* From https://css.glass */

section {
  header,
  footer {
    text-shadow: 0 0 2rem rgba(var(--color-background), 0.9);
  }
}

section > header {
  grid-area: header;
}

section > footer {
  grid-area: footer;
  text-align: right;
}

section > * > p {
  margin: 0;
}
.description::first-letter {
  text-transform: uppercase;
}
</style>

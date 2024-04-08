<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'

import { ref, computed } from 'vue'

const isLoading = ref(true)
const data = ref({})
// const unsplashPhoto = computed(() => {
//   return isLoading.value
//     ? null
//     : `url(https://source.unsplash.com/daily?${data.value.location.city}%20${data.value.location.country},${data.value.weather.name})`
// })

const bgImage = computed(() => {
  return isLoading.value ? null : `url(${data.value.image})`
})

function updateTags() {
  document.querySelector('link[rel="icon"]').href = data.value.weather.icon
  document.title = `${data.value.weather.temperature}°${data.value.weather.symbol} and ${data.value.weather.name} in ${data.value.location.city} | WeatherScape`
}

async function init() {
  try {
    isLoading.value = true
    const response = await fetch('/init')

    const response_data = await response.json()

    console.log(response_data)
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
    <header>
      <p>WeatherScape</p>
    </header>
    <main v-if="!isLoading">
      <h4>{{ data.location.city }}</h4>
      <p>{{ data.location.region }}, {{ data.location.country }}</p>
      <img class="icon" :src="data.weather.icon" alt="Weather icon" width="100" height="100" />
      <h1>{{ data.weather.temperature }}°{{ data.weather.symbol }}</h1>
      <p class="description">{{ data.weather.description }}</p>
    </main>
    <!-- <RouterView /> -->
    <footer>
      <p>
        Made by
        <a href="https://twitter.com/KaKaUandME" target="_blank" title="Twitter">@kakauandme</a> |
        Copyright {{ new Date().getFullYear() }} ©
      </p>
    </footer>
  </section>
</template>

<style>
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

  background: rgba(var(--color-background), 0.25);
  box-shadow: 0 0 2rem rgba(var(--color-text), 0.1);
  backdrop-filter: blur(0.25rem);
  border: 1px solid rgba(var(--color-background), 0.25);

  /* From https://css.glass */
}

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

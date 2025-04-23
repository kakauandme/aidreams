<template>
  <main>
    <section>
      <!-- <header></header> -->
      <ImageCanvas :image_key="data.key" v-if="isDataLoaded" />
      <LoadingSpinner v-else />
    </section>
    <aside>
      <LabelDisplay :title="title" :details="details" v-if="isDataLoaded" />
      <!-- <footer>©</footer> -->
    </aside>
  </main>
</template>
<script setup>
// import { RouterLink, RouterView } from 'vue-router'

import ImageCanvas from '../components/ImageCanvas.vue'
import LabelDisplay from '../components/LabelDisplay.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const data = ref({})

const DEFAULT_META = {
  title: 'AI dreams',
  description: 'AI dreaming art.',
  image:
    'https://pub-45bccef9813f4db2a0dc170d4cf4dcd6.r2.dev/nl-amsterdam-fog-winter-early-afternoon-v3.png',
  icon: 'https://openweathermap.org/img/wn/02n@2x.png'
}

// Check if data is loaded
const isDataLoaded = computed(() => {
  return (
    data.value?.key &&
    data.value?.location?.country_code &&
    data.value?.location?.city &&
    data.value?.date_and_time?.season &&
    data.value?.weather?.description &&
    !isLoading.value
  )
})

// compile title string
const title = computed(() => {
  if (!isDataLoaded.value) return DEFAULT_META.title

  const article = ['a', 'e', 'i', 'o', 'u'].includes(
    data.value.date_and_time.season[0].toLowerCase()
  )
    ? 'an'
    : 'a'

  let location = ''
  if (data.value.location.city) {
    location = data.value.location.city
  } else if (
    !data.value.location.city &&
    data.value.location.region &&
    data.value.location.country
  ) {
    location = `${data.value.location.region}, ${data.value.location.country}`
  } else if (
    !data.value.location.city &&
    !data.value.location.region &&
    data.value.location.country
  ) {
    location = data.value.location.country
  }

  return `${location} in ${data.value.weather.description} on ${article} ${data.value.date_and_time.season.toLowerCase()} ${data.value.date_and_time.time_of_day.toLowerCase()}`
})

// details string
const details = computed(() => {
  if (!isDataLoaded.value) return DEFAULT_META.description
  return `Location: ${data.value.location.latitude}, ${data.value.location.longitude}. Weather: ${data.value.weather.temperature}°${data.value.weather.symbol}, ${data.value.weather.description}. Time: ${data.value.date_and_time.time}, ${data.value.date_and_time.date}. Style: ${data.value.style}. Model: GPT Image 1. Dimensions: 1024 pixels.`
})

// Format helpers
const formatCityName = (city) => {
  return city
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
}

const formatCountryCode = (countryCode) => {
  return countryCode.toLowerCase()
}

// Current URL
const currentUrl = computed(() => {
  if (!isDataLoaded.value) return window.location.origin
  return `${window.location.origin}/${formatCountryCode(data.value.location.country_code)}/${formatCityName(data.value.location.city)}`
})

// Image URL
const imageUrl = computed(() => {
  if (!isDataLoaded.value) return DEFAULT_META.image
  return `${window.location.origin}/r2/${data.value.key}`
})

// Setup reactive head
useHead({
  title: () => `${title.value} | ${DEFAULT_META.title}`,
  meta: [
    { name: 'description', content: () => details.value },
    // Open Graph
    { property: 'og:title', content: () => title.value },
    { property: 'og:description', content: () => details.value },
    { property: 'og:image', content: () => imageUrl.value },
    { property: 'og:url', content: () => currentUrl.value },
    { property: 'og:site_name', content: () => DEFAULT_META.title },
    { property: 'og:type', content: 'website' },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: () => title.value },
    { name: 'twitter:description', content: () => details.value },
    { name: 'twitter:image', content: () => imageUrl.value },
    { name: 'twitter:url', content: () => currentUrl.value },
    { name: 'twitter:creator', content: '@kakauandme' }
  ],
  link: [
    { rel: 'icon', href: () => data.value?.weather?.icon || DEFAULT_META.icon },
    { rel: 'canonical', href: () => currentUrl.value }
  ]
})

onMounted(async () => {
  if (!isLoading.value) return
  try {
    isLoading.value = true

    // Build the init URL with route parameters if they exist
    let initUrl = '/init'
    if (route.params.country_code && route.params.city) {
      initUrl += `?country_code=${encodeURIComponent(formatCountryCode(route.params.country_code))}&city=${encodeURIComponent(formatCityName(route.params.city))}`
    }

    const response = await fetch(initUrl)
    const response_data = await response.json()

    data.value = response_data

    // Update URL if we don't have route parameters but got location data
    if (response_data.location) {
      router.push({
        name: 'location',
        params: {
          country_code: formatCountryCode(response_data.location.country_code),
          city: formatCityName(response_data.location.city)
        }
      })
    }
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

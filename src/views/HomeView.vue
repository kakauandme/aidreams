<template>
  <main>
    <section>
      <!-- <header></header> -->
      <LoadingSpinner v-if="isLoading" />
      <ImageCanvas :image_key="data.key" v-else />
    </section>
    <aside>
      <LabelDisplay :title="title" :details="details" v-if="!isLoading" />
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

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const data = ref({})

// compile title string
const title = computed(() => {
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
  return `Location: ${data.value.location.latitude}, ${data.value.location.longitude}. Weather: ${data.value.weather.temperature}°${data.value.weather.symbol}, ${data.value.weather.description}. Time: ${data.value.date_and_time.time}, ${data.value.date_and_time.date}. Style: ${data.value.style}. Model: Dall-E 3. Dimensions: 1024 pixels.`
})

// TODO: use https://unhead.unjs.io/setup/vue/how-it-works
function updateTags() {
  document.querySelector('link[rel="icon"]').href = data.value.weather.icon
  document.title = `${title.value} | AI dreams`
}

onMounted(async () => {
  if (!isLoading.value) return
  try {
    isLoading.value = true

    // Convert city names to kebab-case
    const formatCityName = (city) => {
      if (!city) return city
      return city
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
    }

    // Ensure country code is lowercase
    const formatCountryCode = (countryCode) => {
      if (!countryCode) return countryCode
      return countryCode.toLowerCase()
    }

    // Build the init URL with route parameters if they exist
    let initUrl = '/init'
    if (route.params.country_code && route.params.city) {
      initUrl += `?country_code=${encodeURIComponent(formatCountryCode(route.params.country_code))}&city=${encodeURIComponent(formatCityName(route.params.city))}`
    }

    console.log(initUrl)

    const response = await fetch(initUrl)
    const response_data = await response.json()

    // console.log(response_data)
    data.value = response_data
    updateTags()

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

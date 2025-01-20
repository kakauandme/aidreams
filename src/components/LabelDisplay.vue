<template>
  <article>
    <p class="artist">
      <a href="https://twitter.com/KaKaUandME" target="_blank" title="Twitter">Kirill Kliavin</a>
      (b. 1987)
    </p>
    <!-- <p class="title">{{ props.title }} c. {{ new Date().getFullYear() }}</p> -->
    <p class="title">
      <v-typical :steps="['', 1000, props.title + ',']" :loop="1" :wrapper="'em'"></v-typical
      ><v-typical
        class="blink"
        :steps="[
          '',
          8000,
          ' c. ' + new Date().getFullYear(),
          2000,
          (e) => e.classList.remove('blink'),
        ]"
        :loop="1"
        :wrapper="'span'"
      ></v-typical>
    </p>
    <p>AI on a digital canvas</p>
    <p>
      <small>{{ props.details }}</small>
    </p>
  </article>
</template>
<style scoped>
article {
  user-select: none;
  .artist {
    font-size: 1.5rem;
  }
  .title {
    font-size: 2rem;
  }
  a {
    font-weight: bold;
  }
  p:not(.title) {
    opacity: 0;
    animation: appear 2s ease forwards;
    animation-delay: 8s;
  }
}
</style>
<script setup>
import VTypical from 'vue-typical'

const props = defineProps({
  //   title_key: {
  //     type: String,
  //     required: true
  //   },
  details: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

// const isLoading = ref(true)

// const response_text = ref('')

// async function loadTitle() {
//   if (!isLoading.value) return

//   if (props.title) {
//     response_text.value = props.title
//     isLoading.value = false
//     return
//   }

//   isLoading.value = true
//   try {
//     const response = await fetch('/title/' + props.title_key)

//     const response_data = await response.text()

//     response_text.value = response_data
//   } catch (e) {
//     console.error(e)
//   } finally {
//     isLoading.value = false
//   }
// }

// loadTitle()
</script>

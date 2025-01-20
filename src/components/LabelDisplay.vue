<template>
  <article>
    <p class="artist">
      <a href="https://twitter.com/KaKaUandME" target="_blank" title="Twitter">Kirill Kliavin</a>
      (b. 1987)
    </p>
    <!-- <p class="title">{{ props.title }} c. {{ new Date().getFullYear() }}</p> -->
    <p class="title">
      <!-- Type out the title letter by letter -->
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
<script setup>
import VTypical from 'vue-typical'

const props = defineProps({
  details: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})
</script>
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

  /* display everything after title is displayed */
  p:not(.title) {
    opacity: 0;
    animation: appear 2s ease forwards;
    animation-delay: 8s;
  }
}
</style>

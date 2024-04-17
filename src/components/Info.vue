<script setup>
import VTypical from 'vue-typical'
import { computed } from 'vue'

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
<template>
  <article>
    <p class="artist">
      <v-typical
        :steps="[
          '',
          6000,
          'Kirill Kliavin',
          (e) => {
            e.href = 'https://twitter.com/KaKaUandME'
            e.target = '_blank'
            e.title = 'Twitter'
          }
        ]"
        :loop="1"
        :wrapper="'a'"
      ></v-typical
      ><v-typical
        :steps="[
          '',
          5000,
          (e) => e.classList.add('blink'),
          2000,
          ' (b. 1987)',
          (e) => e.classList.remove('blink')
        ]"
        :loop="1"
        :wrapper="'span'"
      ></v-typical>
    </p>
    <p class="title">
      <v-typical :steps="['', 500, props.title + ',']" :loop="1" :wrapper="'em'"></v-typical
      ><v-typical
        class="blink"
        :steps="['', 5000, ' c. ' + new Date().getFullYear(), (e) => e.classList.remove('blink')]"
        :loop="1"
        :wrapper="'span'"
      ></v-typical>
    </p>
    <p>
      <v-typical
        :steps="[
          '',
          3000,
          (e) => e.classList.add('blink'),
          'AI on a digital canvas',
          (e) => e.classList.remove('blink')
        ]"
        :loop="1"
        :wrapper="'span'"
      ></v-typical>
    </p>
    <p>
      <v-typical
        :steps="[
          '',
          2000,
          (e) => e.classList.add('blink'),
          props.details,
          2000,
          (e) => e.classList.remove('blink')
        ]"
        :loop="1"
        :wrapper="'small'"
      ></v-typical>
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
}
</style>

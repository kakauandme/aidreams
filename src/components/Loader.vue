<template>
  <div class="container">
    <VCodeBlock
      :code="code"
      highlightjs
      lang="javascript"
      theme="neon-bunny"
      :copyButton="false"
      :tabs="true"
    />
  </div>
</template>
<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  text-align: center;
}
</style>
<script setup>
import { ref } from 'vue'
import VCodeBlock from '@wdns/vue-code-block'
const code = ref(`const foo = 'bar';`)
</script>
